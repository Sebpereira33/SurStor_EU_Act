# Usage event v1

`examples/event.json` is synthetic metadata, not measured usage or a price quote.
All fields outside the documented schema are rejected. No free-form notes, raw
provider responses, tool calls, prompts or responses are accepted.

| Field | Contract |
|---|---|
| version | Integer 1 |
| event_id | Stable UUID per request; reuse for delivery retries |
| occurred_at | ISO timestamp with timezone; normalized to UTC; future skew <=5 minutes |
| provider / model / integration | Bounded identifiers, never paths, credentials or arbitrary descriptions |
| project_id | Optional opaque UUID; no repository names or local paths |
| usage_source | provider_response, inference_server, harness_event or manual |
| usage_status | reported, estimated, incomplete or unknown |
| input_tokens | Inclusive input count, including cache reads/writes; null when unknown |
| output_tokens | Output count; null when unknown |
| cache_read_tokens / cache_write_tokens | Optional input subsets; null when unavailable |
| cost | null when unpriced, or the exact object below |

Cost object: `amount` is a nonnegative decimal string with <=6 decimals,
`currency` is a three-uppercase-letter currency code, `kind` is `estimated` or
`provider_reported`, and `pricing_version` is an identifier (required for estimates;
nullable for reported costs). Different currencies and cost kinds are never summed
together. Currency codes are syntactically validated, not checked against ISO data.

A reported event needs known input/output counts. Unknown usage must have null
counts. Zero means a real zero, never missing data. Input counts must be normalized
before reporting; cache totals cannot exceed inclusive input. Output/reasoning
breakdowns and multimodal/provider-specific units need a future schema version.

Use one event per completed model request. Session cumulative totals must not be
submitted as request events. The current schema has no revision protocol: an
interrupted request may be submitted as incomplete, but cannot later be updated
under the same UUID. Collectors should wait for final usage where possible.

The API token determines workspace/device; those cannot be supplied in an event.
The client can still lie about usage. Cryptographic provenance is future work.

MCP references: [stdio transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
and [tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools).


Identifiers must start with a letter or digit and contain only letters, digits,
dot, underscore, colon, slash or hyphen, with a maximum length of 128.
Values resembling secrets, URLs or filesystem paths are rejected.
The maximum JSON body is 16,384 bytes. Counts are integers from 0 to
1,000,000,000 or null. The timestamp allows up to six fractional digits.
Costs have up to nine integer digits and six fractional digits.

Example with measured cache counts and a reported cost (synthetic):

```json
{
  "version": 1,
  "event_id": "0a7d8517-f064-4bf5-9d86-5d63218bb080",
  "occurred_at": "2026-11-20T12:00:00Z",
  "provider": "anthropic",
  "model": "claude-example",
  "integration": "my-agent",
  "usage_source": "provider_response",
  "usage_status": "reported",
  "input_tokens": 140,
  "output_tokens": 20,
  "cache_read_tokens": 30,
  "cache_write_tokens": 10,
  "project_id": "1b52591a-72cc-4996-9be7-8196e49733cb",
  "cost": {
    "amount": "0.001200",
    "currency": "USD",
    "kind": "provider_reported",
    "pricing_version": null
  }
}
```

For Anthropic responses, add input_tokens, cache_creation_input_tokens and
cache_read_input_tokens to produce SurStor's inclusive input count. A missing
count stays unknown. Never submit session cumulative counts as request events.

Hosted responses: 201 stores an event; 200 with duplicate=true acknowledges an
equivalent resend; 409 event_conflict means the UUID already has different
metadata; 422 names the invalid field; 401 means authentication failed.
Optional omitted and null fields and equivalent timestamp/cost representations
are treated identically when comparing hosted duplicates.
