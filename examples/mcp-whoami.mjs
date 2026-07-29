#!/usr/bin/env node
/**
 * @file Connect to hosted HollyHR MCP and make one read-only identity call.
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const endpointValue = process.env.HOLLYHR_MCP_URL;
const token = process.env.HOLLYHR_MCP_TOKEN;

if (!endpointValue || !token) {
  throw new Error("Set HOLLYHR_MCP_URL and HOLLYHR_MCP_TOKEN before running this example.");
}

const endpoint = new URL(endpointValue);
const client = new Client(
  { name: "hollyhr-api-examples", version: "0.1.0" },
  { versionNegotiation: { mode: "auto" } },
);
const transport = new StreamableHTTPClientTransport(endpoint, {
  requestInit: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

await client.connect(transport);

try {
  const tools = await client.listTools();
  const identity = await client.callTool({ name: "whoami", arguments: {} });

  console.log(
    JSON.stringify(
      {
        protocolEra: client.getProtocolEra(),
        tools: tools.tools.map((tool) => tool.name).sort(),
        identity: identity.structuredContent,
      },
      null,
      2,
    ),
  );
} finally {
  await transport.close();
}
