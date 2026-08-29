#!/usr/bin/env python3
"""Make a dependency-free first HollyHR API call and preserve request evidence."""

from __future__ import annotations

import json
import os
import sys
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("HOLLYHR_API_BASE_URL")
TOKEN = os.environ.get("HOLLYHR_API_TOKEN")

if not BASE_URL or not TOKEN:
    raise SystemExit("Set HOLLYHR_API_BASE_URL and HOLLYHR_API_TOKEN before running this example.")


def get_json(path: str) -> tuple[Any, dict[str, str | None]]:
    """Fetch one JSON resource and return bounded operational response metadata."""

    request = Request(
        urljoin(f"{BASE_URL.rstrip('/')}/", path.lstrip("/")),
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {TOKEN}",
            "User-Agent": "hollyhr-api-examples/python-first-call",
        },
        method="GET",
    )
    with urlopen(request, timeout=20) as response:
        body = json.load(response)
        headers = response.headers
        return body, {
            "request_id": headers.get("x-request-id") or headers.get("x-correlation-id"),
            "rate_limit": headers.get("ratelimit-limit"),
            "rate_limit_remaining": headers.get("ratelimit-remaining"),
            "rate_limit_reset": headers.get("ratelimit-reset"),
        }


try:
    identity, identity_meta = get_json("me")
    people, people_meta = get_json("people?limit=10")
except HTTPError as error:
    request_id = error.headers.get("x-request-id") or error.headers.get("x-correlation-id")
    try:
        body = json.loads(error.read().decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        body = {"error": {"message": "HollyHR returned a non-JSON error response"}}
    print(
        json.dumps(
            {"status": error.code, "request_id": request_id, "response": body},
            indent=2,
        ),
        file=sys.stderr,
    )
    raise SystemExit(1) from error
except URLError as error:
    print(json.dumps({"network_error": str(error.reason)}, indent=2), file=sys.stderr)
    raise SystemExit(1) from error

print(
    json.dumps(
        {
            "identity": identity,
            "identity_response": identity_meta,
            "people": people,
            "people_response": people_meta,
        },
        indent=2,
    )
)
