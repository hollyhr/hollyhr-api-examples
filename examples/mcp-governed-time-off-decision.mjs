#!/usr/bin/env node
/**
 * @file Exercise HollyHR's frozen MCP prepare, human-confirm and commit decision flow.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const endpointValue = process.env.HOLLYHR_MCP_URL;
const token = process.env.HOLLYHR_MCP_TOKEN;
const timeOffId = process.env.HOLLYHR_TIME_OFF_ID;
const decision = process.env.HOLLYHR_TIME_OFF_DECISION;
const responseNote = process.env.HOLLYHR_TIME_OFF_RESPONSE_NOTE;

if (!endpointValue || !token || !timeOffId) {
  throw new Error(
    "Set HOLLYHR_MCP_URL, HOLLYHR_MCP_TOKEN and HOLLYHR_TIME_OFF_ID before running this example.",
  );
}

if (decision !== "approve" && decision !== "decline") {
  throw new Error("Set HOLLYHR_TIME_OFF_DECISION to exactly approve or decline.");
}

if (decision === "approve" && responseNote) {
  throw new Error("HOLLYHR_TIME_OFF_RESPONSE_NOTE is supported only for decline decisions.");
}

if (responseNote && responseNote.length > 512) {
  throw new Error("HOLLYHR_TIME_OFF_RESPONSE_NOTE must be 512 characters or fewer.");
}

if (!stdin.isTTY || !stdout.isTTY) {
  throw new Error("This governed write example requires an interactive terminal for human approval.");
}

const endpoint = new URL(endpointValue);
const readline = createInterface({ input: stdin, output: stdout });
const approvalPhrase = `confirm ${decision} ${timeOffId}`;
let approvalRequested = false;

const client = new Client(
  { name: "hollyhr-api-examples-governed-write", version: "0.1.0" },
  {
    versionNegotiation: { mode: "auto" },
    capabilities: { elicitation: { form: {} } },
  },
);

client.setRequestHandler("elicitation/create", async (request) => {
  approvalRequested = true;
  console.error("\nHollyHR requested per-action confirmation:");
  console.error(JSON.stringify(request.params, null, 2));
  const answer = await readline.question(`\nType \"${approvalPhrase}\" to approve, or anything else to decline: `);

  if (answer !== approvalPhrase) {
    return { action: "decline" };
  }

  return {
    action: "accept",
    content: {
      approve: true,
      reason: `Approved by the human running the ${decision} example`,
    },
  };
});

const transport = new StreamableHTTPClientTransport(endpoint, {
  requestInit: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

function requireStructuredContent(result, label) {
  if (result.isError === true || !result.structuredContent) {
    throw new Error(`${label} failed safely: ${JSON.stringify(result.content)}`);
  }
  return result.structuredContent;
}

await client.connect(transport);

try {
  if (client.getProtocolEra() !== "modern") {
    throw new Error(
      "This write example requires a modern 2026-07-28 MCP client with form elicitation support.",
    );
  }

  const current = await client.callTool({
    name: "call_api_operation",
    arguments: {
      operation_id: "getTimeOff",
      args: { pathParams: { timeOffId } },
    },
  });
  console.error("Current safe time-off projection:");
  console.error(JSON.stringify(requireStructuredContent(current, "getTimeOff"), null, 2));

  const args = {
    pathParams: { timeOffId },
    ...(decision === "decline" && responseNote
      ? { body: { response_note: responseNote } }
      : {}),
  };
  const operationId = decision === "approve" ? "approveTimeOff" : "declineTimeOff";
  const prepared = await client.callTool({
    name: "prepare_api_write",
    arguments: { operation_id: operationId, args },
  });
  const preparation = requireStructuredContent(prepared, "prepare_api_write");
  const confirmationToken = preparation.confirmation_token;

  if (typeof confirmationToken !== "string") {
    throw new Error("Preparation returned no confirmation token, so the example stopped.");
  }

  console.error("\nFrozen write for review:");
  console.error(JSON.stringify(preparation.frozen_payload, null, 2));
  console.error("The signed confirmation token is intentionally held in memory and not printed.");

  const committed = await client.callTool({
    name: "commit_api_write",
    arguments: { confirmation_token: confirmationToken },
  });

  if (!approvalRequested) {
    throw new Error("The server did not request host confirmation, so the result is not trusted.");
  }

  console.log(JSON.stringify(requireStructuredContent(committed, "commit_api_write"), null, 2));
} finally {
  readline.close();
  await transport.close();
}
