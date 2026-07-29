#!/usr/bin/env node
/**
 * @file Update a safe person field with ETag and idempotency protection.
 */
import { createHollyHrApiClient, createIdempotencyKey } from "@hollyhr/api-client";

const token = process.env.HOLLYHR_API_TOKEN;
const baseUrl = process.env.HOLLYHR_API_BASE_URL;
const personId = process.env.HOLLYHR_PERSON_ID;
const jobTitle = process.env.HOLLYHR_JOB_TITLE ?? "People Lead";

if (!token || !baseUrl || !personId) {
  throw new Error(
    "Set HOLLYHR_API_TOKEN, HOLLYHR_API_BASE_URL and HOLLYHR_PERSON_ID before running this example.",
  );
}

const hollyhr = createHollyHrApiClient({
  baseUrl,
  token,
  userAgent: "hollyhr-api-examples/safe-update-person",
});

const current = await hollyhr.get("/people/{personId}", {
  pathParams: { personId },
});

if (!current.etag) {
  throw new Error("The person read returned no ETag, so the example stopped without writing.");
}

const updated = await hollyhr.patch("/people/{personId}", {
  pathParams: { personId },
  ifMatch: current.etag,
  idempotencyKey: createIdempotencyKey("update_person"),
  body: { job_title: jobTitle },
});

console.log(
  JSON.stringify(
    {
      requestId: updated.requestId,
      etag: updated.etag,
      person: updated.data,
    },
    null,
    2,
  ),
);
