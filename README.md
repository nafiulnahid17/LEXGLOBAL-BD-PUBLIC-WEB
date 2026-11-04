# LexGlobal BD — For Public | Native Cloudflare Workers AI Binding v2.1

**Status:** Native `env.AI` binding implementation and mocked tests complete. Production Cloudflare deployment and live inference have NOT been performed. No model credential is required or accepted by the inference code.

The existing Premium Navy Blue + Gold frontend with all **11 public feature pages** remains intact. No login / signup has been introduced. Submit buttons now call the same-origin Cloudflare Worker API and show results or explicit configuration errors; data and sources are rendered as text rather than injected HTML.

## Architecture

- **Static Assets + Worker:** `site/` static content and `worker/index.js` on the Cloudflare Workers edge.
- **Fast model:** `@cf/qwen/qwen3-30b-a3b-fp8`, a multilingual 30B MoE model with about 3B active parameters. This is a practical low-overhead default, **not a benchmarked claim that it is the fastest model for every prompt**.
- **Binding only:** `wrangler.jsonc` declares `"ai": { "binding": "AI" }`. The sole inference path is `env.AI.run(model, payload)`. No REST mode, no Cloudflare account ID, no bearer token, and no AI Gateway required. Missing binding produces `AI_BINDING_NOT_CONFIGURED` and never falls back to HTTP.
- **Privacy caution:** No AI Gateway routing is configured. Review Cloudflare account-level AI inference retention and pricing before processing sensitive information.
- **Source-grounded legal AI:** `AI_SEARCH` namespace binding queries the `LEGAL_SEARCH_INSTANCE` collection. Hybrid retrieval (max 5, score >= 0.55) must return official `*.gov.bd` HTTPS sources before a legal answer or draft may be generated. Outputs with no valid `[n]` citation are rejected. **This reduces some hallucination risks, but cannot guarantee zero legal errors.** All important legal facts require human review.
- **Low latency deterministic government guides:** Land, BRTA, Tax, Passport, Expat, NariSafe and Emergency routes respond immediately from curated official URLs — they do *not* call the LLM or claim a government integration.
- **Abuse controls:** 8 KB JSON-only requests, origin check, approximate 12/minute Cloudflare per-IP rate limit, no document uploads, and no server-side storage of user inputs. With no user accounts, the public endpoint still needs production abuse monitoring and privacy review.
- **Fail closed:** Until an indexed set of verified official Bangladesh legal source documents is available, the three legal AI features return `LEGAL_SOURCES_NOT_CONFIGURED` (503), instead of fabricating legal answers.

## Features

### Source-grounded AI (requires verified AI Search index)
1. `ai-legal-assistant` — general legal questions
2. `instant-legal-draft` — preliminary **sample** legal draft
3. `ai-case-analysis` — preliminary issue checklist (no attachments; not an outcome prediction)

### Direct official guidance (works even without an AI model)
4. `smart-land-management` — `land.gov.bd`
5. `smart-vehicle-brta` — `bsp.brta.gov.bd`
6. `smart-tax-management` — `etaxnbr.gov.bd`
7. `passport-assistant` — `epassport.gov.bd`
8. `expat-documentation` — `probashi.gov.bd`, `oep.gov.bd`
9. `narisafe` — official help channels
10. `emergency-sos-gesture` — **not activated**, never implies alerts are sent
11. `emergency-call` — tel links, no automatic dialing

## Deploy

Requirements: Node.js 20+, Wrangler 4.36+, authorized Cloudflare account.

```bash
npm install
npm test
npx wrangler login
npx wrangler deploy
```

See `DEPLOY_BN.md` for Cloudflare Workers AI binding and legal AI Search configuration. `wrangler login` authenticates the deployment CLI; this is separate from AI inference and does not put credentials inside the Worker.

### Cloudflare AI Search instance

1. In Cloudflare, create an AI Search instance that indexes **actual, current official Bangladesh legal material** (e.g. verified statutory texts from `bdlaws.minlaw.gov.bd` or other official `*.gov.bd` sources) with `source_url` metadata set to its original HTTPS URL. Review all content provenance and updates before enabling.
2. In `wrangler.jsonc`, set `vars.LEGAL_SEARCH_INSTANCE` to that existing instance ID. AI Search namespace `default` is already bound as `AI_SEARCH`.
3. Deploy and call `GET /api/health` to verify `legalAnsweringEnabled: true` (configuration readiness, not proof that indexing succeeded). Then perform genuine source-backed legal tests with a human reviewer.

### Binding-only runtime

The `AI` binding is declared in `wrangler.jsonc`; deployment attaches it to the Worker automatically. Set `LEGAL_SEARCH_INSTANCE` to the name of an indexed **verified** AI Search instance for the three legal workflows. The AI model cannot produce legal answers before trusted retrieval is configured. No alternative inference transport exists.

## API

- `GET /api/health` — public configuration readiness (never returns tokens)
- `GET /api/features` — 11 statuses
- `POST /api/workflows/{slug}` — `Content-Type: application/json`, same origin. For example `{ "question":"ভাড়াটিয়ার অধিকার সম্পর্কে সাধারণ প্রশ্ন কী?" }` for `ai-legal-assistant`.

A successful answer has `{ok:true,mode:'grounded_ai'|'official_guide',answer,sources,stored:false}`. Errors return `{ok:false,code,message,stored:false}`. The API does not accept files or personal identification and is **not a government transaction endpoint**.

## Testing

```bash
npm test
node --check worker/index.js
node --check site/app.js
```

All tests run with mocked Cloudflare AI/Search bindings and include safety cases. Live model quality, legal accuracy, token validation, real Cloudflare throughput and browser visual QA require deployment and account resources. See `QA_NOTES.md`.

Official platform documentation:
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/
- https://developers.cloudflare.com/ai-search/api/search/workers-binding/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/
