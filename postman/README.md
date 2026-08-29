# HollyHR in Postman

The `HollyHR - Start Here` collection is the shortest route to a useful first
response. The `HollyHR Public API` collection is the generated reference for
the complete public OpenAPI contract.

- [Open the HollyHR public workspace](https://www.postman.com/hollyhr-4691443/workspace/hollyhr-public-api~73d93b69-5cda-44a4-b491-db7062f974bd/overview)
- [Open HollyHR - Start Here](https://www.postman.com/hollyhr-4691443/workspace/hollyhr-public-api~73d93b69-5cda-44a4-b491-db7062f974bd/collection/57810961-cb33ed54-f10a-4298-9e48-21ef4a1398dd)
- [Open the complete HollyHR Public API collection](https://www.postman.com/hollyhr-4691443/workspace/hollyhr-public-api~73d93b69-5cda-44a4-b491-db7062f974bd/collection/57810961-d54d7cd9-96ee-4f26-abdf-7af6b0a8ec12)

Neither collection contains an API key. After importing or forking a
collection, set these collection variables locally:

- `baseUrl`: `https://<your-workspace>.hollyhr.com/api/v1`
- `bearerToken`: an organisation-scoped API key with only the scopes needed by
  the requests you intend to run

Use a disposable tenant while evaluating writes. Keep conditional `If-Match`
headers and idempotency keys intact, and review the
[write-safety guide](https://developers.hollyhr.com/write-safety) before making
changes.

## Source and maintenance

The API reference collection was generated from HollyHR's public
[OpenAPI 3.1 document](https://developers.hollyhr.com/openapi.v1.yaml), then
curated so optional query parameters are disabled by default and no credential
is stored. The importable Postman Collection v2.1 JSON files in this directory
are the portable source for the hosted workspace.

When the public contract changes, regenerate the reference collection from the
OpenAPI document, replace the checked-in export and update the hosted workspace
in the same change.

Before publishing an export, confirm that `bearerToken` is empty and run the
repository's normal checks. Never commit a Postman current value, API key,
workspace secret or reviewer credential.
