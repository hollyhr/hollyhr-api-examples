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
| `governed-time-off-decision.mjs` | Approve or decline a pending request with ETag, idempotency and request-ID evidence |
| `verify-webhook-signature.mjs` | Verify a captured webhook without trusting its body first |
| `mcp-whoami.mjs` | Connect to hosted MCP, list the available tools and call `whoami` |
| `mcp-governed-time-off-decision.mjs` | Review a frozen MCP decision and require interactive host confirmation before commit |
| `first_call.py` | Make the first API calls with Python's standard library and no package install |

## Requirements

- Node.js 20 or newer
- Python 3.11 or newer for `first_call.py` only
- A HollyHR workspace or the hosted synthetic sandbox
- An organisation-scoped API key with only the scopes required by the example

Install the pinned Node dependencies:

```bash
npm ci
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

### Approve or decline time off through REST

Use a disposable tenant and a key with `time_off:read` and `time_off:write`:

```bash
export HOLLYHR_TIME_OFF_ID="time_off_..."
export HOLLYHR_TIME_OFF_DECISION="approve" # or decline
# Optional for decline only; never include health or medical details:
# export HOLLYHR_TIME_OFF_RESPONSE_NOTE="Private response note"
npm run governed-time-off
```

The script reads the current record first, requires its ETag, generates a fresh
idempotency key and prints the HollyHR request ID. A stale record fails with
`412 Precondition Failed`; inspect the returned request ID and read again rather
than retrying an old decision blindly.

## Run the MCP example

Use the same scoped API key and the tenant's MCP URL:

```bash
export HOLLYHR_MCP_URL="https://sandbox.hollyhr.com/api/mcp"
export HOLLYHR_MCP_TOKEN="$HOLLYHR_API_TOKEN"
npm run mcp-whoami
```

The script negotiates the current protocol through the official MCP client,
lists tool names and calls the read-only `whoami` tool.

### Approve or decline time off through MCP

The governed example requires `time_off:read`, `time_off:write` and `mcp:write`
plus a modern confirmation-capable MCP connection:

```bash
export HOLLYHR_TIME_OFF_ID="time_off_..."
export HOLLYHR_TIME_OFF_DECISION="approve" # or decline
npm run mcp-governed-time-off
```

It reads the safe record, prepares a signed frozen decision, shows the frozen
payload and calls commit only through HollyHR's protocol-native elicitation.
The terminal human must type the exact displayed confirmation phrase. Any
other response declines the action. The signed token is never printed, and a
legacy stateless client fails closed before mutation.

## Run the Python example

Python 3.11 or newer is sufficient; there are no Python dependencies:

```bash
npm run python-first-call
```

The example reports request IDs and rate-limit headers and keeps HTTP failures
structured so they can be handed to HollyHR support without exposing the API
key.

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
- [TypeScript SDK source](https://github.com/hollyhr/hollyhr-api-client)
- [MCP guide](https://developers.hollyhr.com/mcp)
- [Support](https://developers.hollyhr.com/support)

The HollyHR API is in Public Preview. The TypeScript SDK remains a prerelease,
so pin its version, review the
[developer changelog](https://developers.hollyhr.com/changelog) and test
against a disposable tenant before production use.

Paul Gould is the accountable repository owner. See
[MAINTENANCE.md](./MAINTENANCE.md), [CONTRIBUTING.md](./CONTRIBUTING.md) and
[SECURITY.md](./SECURITY.md) for the review cadence, contribution path and
private security-reporting route.
