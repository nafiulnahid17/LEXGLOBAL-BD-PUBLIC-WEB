# LexGlobal BD — For Public (Cloudflare Workers AI Preview v3)

This version makes **all 11 public pages usable for UI testing**. The three legal AI forms respond through Cloudflare's **native `env.AI.run` Workers AI binding** even without a legal-source index. Responses are explicitly labeled **experimental AI preview**; do not treat them as verified Bangladeshi legal advice.

There is **no login/signup, external AI engine, provider token, REST fallback, mock AI in production, or user-data database**. The existing premium Navy Blue + Gold frontend is retained.

## What works

- `AI Legal Assistant`, `Instant Legal Draft`, `AI Case Analysis`: input -> same-origin `/api/workflows/:slug` -> Cloudflare Workers AI -> AI response. **No required AI Search collection.** Short greetings such as `hi` also produce an answer from the model.
- `Smart Land Management`, `Smart Vehicle & BRTA`, `Smart Tax`, `Passport Assistant`, `Expat & Documentation`: working interactive service selectors and curated government links/instructions (no government transaction APIs).
- `NariSafe`, `Emergency Call`, `Emergency SOS Gesture`: public safety information and call links. **The SOS gesture is not an operational dispatch/location-sharing feature.**
- All 11 routes can be opened directly or through desktop/mobile navigation without authentication. Responsive design and accessible form controls remain intact.

### Modes and accuracy

| Condition | Behavior |
|---|---|
| AI binding exists; no legal source index | `preview_ai` (200) with `verified:false`, no citations and an unverified-content warning |
| AI binding + indexed official legal sources | `grounded_ai` when retrieval provides supported sources with numbered citations; if retrieval fails, fallback to `preview_ai` with warnings |
| AI binding missing | `AI_BINDING_NOT_CONFIGURED` (503), not a fabricated AI answer |
| Cloudflare model fails | `AI_TEMPORARILY_UNAVAILABLE` (503) |

Preview AI is for workflow testing and general explanations only. **There is no safe way to guarantee perfectly accurate legal AI outputs without verified, current source documents and review by a qualified lawyer.** The system prompt instructs the model not to invent legal sections, decisions, prices or official processes in preview mode. Generated text can still be wrong; it is not independently fact-checked.

## Deployment

1. Workers & Pages in your Cloudflare account must permit Workers AI usage. Use Node.js 20+ and current Wrangler.
2. Install and check locally:

   ```bash
   npm install
   npm test
   node --check worker/index.js
   node --check site/app.js
   ```

3. Deploy this repo's **main** branch via your existing Cloudflare dashboard Git integration or:

   ```bash
   npx wrangler login
   npx wrangler deploy
   ```

   Wrangler login authenticates the deployment tool, **not AI inference**. Inference uses `env.AI.run()` from `"ai":{"binding":"AI"}` in `wrangler.jsonc`.

4. Open `/api/health`, `/api/features` and `/public/ai-legal-assistant`. If `aiBindingConfigured` is true, `legalAnsweringEnabled` should be true regardless of a legal-source index. Enter `hi` and confirm a **real** AI response is returned. Inspect browser network POST `/api/workflows/ai-legal-assistant` for HTTP 200 and `mode:'preview_ai'`.

### Optional future legal-source index

When the verified Bangladesh law corpus is ready, add your **actual** AI Search binding to Wrangler, set `vars.LEGAL_SEARCH_INSTANCE`, ingest the original documents with valid HTTPS `*.gov.bd` source metadata, and redeploy. Until then **no AI Search binding is required**.

## Local testing without external services

`npm run preview:mock` starts a **local-only mock binding** at `http://127.0.0.1:4175/public` for UI / smoke testing. It is not deployed and is not a replacement for testing the real Cloudflare model. The production Worker still calls only Cloudflare native binding `env.AI.run()`.

`npm test` runs API safety and workflow tests with mocked AI/Search responses. Browser smoke testing has been performed locally with Chromium using an embedded UI and a bridge to the same mocked Worker APIs because local network navigation was blocked in that browser environment.

## Privacy and emergency limitations

Never enter real NID/passport numbers, private case files, credentials or identifying client details during this preview. The application does not persist request bodies in its own storage, but Cloudflare's inference data handling remains subject to its service terms. Rate limiting and same-origin checks remain enabled, and file contents are rejected.

The platform does not file government applications, dispatch SOS calls, verify official records or offer emergency-response services. For emergencies, call Bangladesh **999**. Government legal aid: **16699**; women and child support: **109**. Verify important legal steps directly with competent sources.

## Conversational AI Assistant (v4)

The `/public/ai-legal-assistant` route now uses a WhatsApp/Messenger-style conversation interface instead of the old single-input/single-result form. Each user and AI message has its own bubble, timestamps, a temporary typing indicator while waiting for a response, animated message entry, and auto-scrolling transcript. Enter sends, Shift+Enter creates a new line, and **New Chat** clears the session. The mobile layout is responsive and supports reduced-motion accessibility settings.

**Context:** For a follow-up question, the browser sends the last four completed user/assistant pairs (at most eight prior messages, each truncated to 650 characters) in a `history` field to `POST /api/workflows/ai-legal-assistant`, together with the latest `question`. The Worker validates the role sequence, lengths and structure, treats history as untrusted client-supplied context, and invokes the existing Cloudflare native `env.AI.run()` binding. No database, localStorage or browser cookies are used for conversations. Refreshing the page clears the in-tab history.

**Safety and limitations:** Answers remain AI Preview unless verified official legal sources are available. Do not enter sensitive client or identity data. The typing dots are a waiting animation, **not streaming tokens**. The demo does not guarantee factual correctness or long-term memory. The other ten Public feature workflows and no-login design remain unchanged.

**Verification:** `npm test` passes 27 unit/API checks. Local Chromium/Playwright checks covered two-turn conversation history, message order, animated typing, New Chat, keyboard shortcuts, text-only sanitization, another feature's form and 390px mobile responsiveness. This is local mocked AI testing; actual Cloudflare Workers live inference and deployment are separate.
