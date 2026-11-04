# LexGlobal BD Public — QA Notes (v5: multilingual + streaming)

**Local automated API tests:** 34 passed, 0 failed (`npm test`).
**Local Playwright browser checks:** 10 passed, 0 failed (SSE stream presentation, typing animation, user/assistant bubbles, Banglish conversation context, grounded JSON fallback, New Chat, XSS-safe textContent, another feature route, mobile layout).
**Syntax:** `node --check worker/index.js`, `node --check site/app.js` passed.

## New behavior
- Same-language instruction selected from the *latest* message without a second inference call.
- Bengali Unicode -> Bangla; high-confidence romanized Bengali -> Bangla script; other languages -> multilingual model recognition; explicit language requests respected.
- Banglish examples disambiguate `bou` (wife/spouse) vs `ma` (mother). Uncertain relationship wording should trigger clarification.
- Preview chat streams SSE from the native Cloudflare Workers AI binding; existing JSON response mode remains supported.
- Shorter output budget for AI Assistant chat; not a measured Cloudflare latency claim.
- Normal safety rules remain: no fake citations or government integration, no private file upload, sensitive legal claims need verification.

## Still unverified
- Live Cloudflare model multilingual consistency, first-token latency and speed relative to v4.
- Actual production deployment, Cloudflare quota, and edge performance; production must be re-deployed from GitHub.
- Model accuracy for all dialects and languages is not guaranteed. Preview mode answers are not verified legal advice.
