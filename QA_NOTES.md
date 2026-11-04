# LexGlobal BD Public — QA Notes (v5.1)

**Local API tests:** 39 passed, 0 failed (`node --test tests/worker.test.mjs`).
**Syntax:** `node --check worker/index.js` and `node --check site/app.js` passed.
**Browser simulation:** Playwright/Chromium successfully tested multi-turn Banglish follow-up, AI cutoff followed by one automatic continuation, same assistant bubble after completion, partial-answer manual Continue fallback, New Chat reset, 390px mobile viewport, 11 visible Public feature navigation links, and no unexpected JavaScript page errors. Responses were mocked; tests do not prove live model fidelity.

## Fixes

- Increased AI Legal Assistant output cap from 480 to 1,400 tokens in the initial turn; continuation capped at 750 tokens.
- Six complete user/assistant turn pairs may be carried as separate model messages, at most 1,800 characters per prior message, bounded by request validation.
- Common requests to explain previous content again, including `bujhi nai`, are interpreted in context.
- Streaming completion distinguishes `[DONE]`, `finish_reason`, abrupt cutoffs and transport interruptions.
- At most one automatic continuation is attempted for incomplete streams. If that still fails or is incomplete, a manual Continue button is shown. Incomplete responses are not hidden.
- Existing legal preview warning and native Cloudflare `AI` binding are retained; no REST token fallback or persistent chat data introduced.

## Limits and still unverified

- **Cloudflare production deployment and live Qwen inference** (including actual cutoff telemetry, response quality, latency and quotas) have not been verified here.
- Automatic continuation incurs another inference call when required, so worst-case latency/cost can increase.
- SSE completion metadata may vary by model, so punctuation-based fallback is heuristic; no design can guarantee every AI answer is complete or correct.
- AI legal answers are experimental and must be checked against verified official sources or by a qualified lawyer.
