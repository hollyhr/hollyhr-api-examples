#!/usr/bin/env node
/**
 * @file Verify a HollyHR API key and make the first useful people read.
 */
import { createHollyHrApiClient, HollyHrApiError } from "@hollyhr/api-client";

const token = process.env.HOLLYHR_API_TOKEN;
const baseUrl = process.env.HOLLYHR_API_BASE_URL;

if (!token || !baseUrl) {
  throw new Error("Set HOLLYHR_API_TOKEN and HOLLYHR_API_BASE_URL before running this example.");
}

const hollyhr = createHollyHrApiClient({
  baseUrl,
  token,
  userAgent: "hollyhr-api-examples/first-call",
});

try {
  const identity = await hollyhr.get("/me");
  const people = await hollyhr.get("/people", { query: { limit: 10 } });

  console.log(
    JSON.stringify(
      {
        identity: identity.data,
        requestId: people.requestId,
        rateLimit: people.rateLimit,
        people: people.data,
      },
      null,
      2,
    ),
  );
} catch (error) {
  if (error instanceof HollyHrApiError) {
    console.error(
      JSON.stringify(
        {
          status: error.status,
          code: error.code,
          requestId: error.requestId,
          message: error.message,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } else {
    throw error;
  }
}
