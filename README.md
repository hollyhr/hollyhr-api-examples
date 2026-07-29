# HollyHR API examples

Small, runnable examples for the
[HollyHR public API](https://developers.hollyhr.com) and hosted MCP endpoint.

These examples deliberately begin with reads. Use a disposable sandbox before
trying writes, keep tokens out of source control and review every requested
scope.

## What is included

| Example | Purpose |
| --- | --- |
| `first-call.mjs` | Verify an API key and list the first ten people |
| `paginate-people.mjs` | Walk the cursor-paginated people collection |
| `safe-update-person.mjs` | Read an ETag and perform an idempotent conditional update |
| `verify-webhook-signature.mjs` | Verify a captured webhook without trusting its body first |
| `mcp-whoami.mjs` | Connect to hosted MCP, list the available tools and call `whoami` |

## Requirements

- Node.js 20 or newer
- A HollyHR workspace or the hosted synthetic sandbox
- An organisation-scoped API key with only the scopes required by the example

Install the pinned preview dependencies:

```bash
npm install
```

Set the API base URL and token:

```bash
export HOLLYHR_API_BASE_URL="https://sandbox.hollyhr.com/api/v1"
export HOLLYHR_API_TOKEN="hhr_test_..."
```

For your own workspace, replace `sandbox` with its subdomain and use the key
issued there.

## Run the API examples

```bash
npm run first-call
npm run paginate-people
```

The conditional update additionally requires a public person ID:

```bash
export HOLLYHR_PERSON_ID="7k3m9q2vx6rt"
export HOLLYHR_JOB_TITLE="People Lead"
npm run safe-update-person
```

It stops rather than writing if the initial read does not return an ETag.

## Run the MCP example

Use the same scoped API key and the tenant's MCP URL:

```bash
export HOLLYHR_MCP_URL="https://sandbox.hollyhr.com/api/mcp"
export HOLLYHR_MCP_TOKEN="$HOLLYHR_API_TOKEN"
npm run mcp-whoami
```

The script negotiates the current protocol through the official MCP client,
lists tool names and calls the read-only `whoami` tool. MCP writes use HollyHR's
separate prepare, review and commit flow and remain environment-controlled; this
starter repository intentionally does not automate them.

## Webhook verification

Set the signing secret and captured delivery values, then run:

```bash
export HOLLYHR_WEBHOOK_SECRET="whsec_..."
export HOLLYHR_WEBHOOK_PAYLOAD_PATH="./payload.json"
export HOLLYHR_WEBHOOK_SIGNATURE="v1=..."
export HOLLYHR_WEBHOOK_TIMESTAMP="2026-07-30T12:00:00.000Z"
export HOLLYHR_WEBHOOK_ID="evt_..."
npm run verify-webhook
```

Use the raw request body. Reject deliveries when verification fails.

## Useful links

- [5-minute quickstart](https://developers.hollyhr.com/quickstart)
- [API reference and guides](https://developers.hollyhr.com)
- [OpenAPI 3.1 document](https://developers.hollyhr.com/openapi.v1.yaml)
- [TypeScript SDK](https://www.npmjs.com/package/@hollyhr/api-client)
- [MCP guide](https://developers.hollyhr.com/mcp)
- [Support](https://developers.hollyhr.com/support)

The API and SDK are currently in preview. Pin versions, review the
[developer changelog](https://developers.hollyhr.com/changelog) and test
against a disposable tenant before production use.
