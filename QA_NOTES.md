# QA — Public AI Preview v3

- API node:test suite: **23 / 23 PASS** (native AI binding path, all 11 feature slugs, 3 preview AI forms, official guide fallback, source lookup failure, origin/rate limiting, JSON/file validation, upstream failure, and no token fallback).
- Chromium-based embedded browser smoke checks: **14 / 14 PASS**. All 11 routes rendered with distinct headings; AI form `hi` submitted through mock Worker binding and visibly returned a preview answer; Land Guide returned government link; 390px mobile navigation worked without horizontal overflow. No page JS errors.
- The test browser refused HTTP/file URL navigation due environment policy; the embedded UI executed actual site JS/CSS and bridged requests to the local Worker test server. This is not a genuine Cloudflare browser test.
- Source-index absence no longer causes `LEGAL_SOURCES_NOT_CONFIGURED`. Preview output has `verified:false` + caution and never fabricates a 'verified' status.
- **Not tested:** live Cloudflare inference latency or Qwen output quality, Cloudflare auto-deployment, official source corpus, external government transactions, emergency alert delivery. Browser QA on the *deployed user URL* remains necessary after deployment.


## v4 chat update checks

- 27/27 Node backend tests pass, including context history forwarding and invalid/malicious history rejection.
- 9/9 local Chromium/Playwright browser interaction checks pass (with mocked Cloudflare binding).
- Checked two-turn chat history, enter-to-send, Shift+Enter newline, typing dots, auto-scrolling, New Chat reset, HTML-safe text rendering, original Draft form and 390px mobile layout.
- No login, token, storage or alternate LLM transport added.
- Live Cloudflare response quality and latency were not measured by these mocked tests; the existing live Worker must be redeployed from `main` for this UI change to appear.
