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


## v5: Same-language replies + lower perceived latency

- The **latest** user message controls the reply language. The Worker adds a trusted language instruction to the same Workers AI call; it does **not** run a separate language-detection model.
- Bengali script inputs are answered in Bengali; common Latin-script Bengali (Banglish) is recognized and the response is requested in **Bangla script**. Example: `amar bou palai gese onno cheler sathe` refers to the user's **wife**, not mother.
- Natural English inputs produce English replies. For French, Hindi, Arabic, Spanish and other languages the multilingual model determines the language from the latest message. Explicit requests for a different reply language take priority. Rare or ambiguous language mixes can still be misclassified and require testing.
- Chat requests now add `stream: true` in JSON. In **preview mode**, `env.AI.run(...,{...,stream:true})` returns Cloudflare Workers AI SSE streamed to the chat bubble as text is generated (time-to-first-text improvement). The UI also accepts regular JSON as before; **source-grounded legal answers remain non-streamed** so the server can validate citations first.
- Chat replies have a smaller `max_tokens` limit (480 preview / 520 grounded), a concise-answer policy, and low temperature to reduce output generation time while preserving response usefulness. Longer legal drafts retain a larger token budget.
- No REST fallback, third-party API token, extra cloud engine, database, login or signup was added. Streaming is opt-in and existing POST API clients remain compatible.
- Streaming improves **perceived** responsiveness. Actual first-token latency, model accuracy and multilingual output must be checked on the live Cloudflare Worker; no fixed speedup or 100% language accuracy is promised.

### Verification for v5

`npm test`: **34/34** local Node tests passed (including multilingual hinting, Banglish relational disambiguation in prompts, SSE endpoint and JSON fallback). Browser smoke test: **10/10** Playwright checks passed using synthetic SSE AI chunks. Both are mocked tests, not live Workers AI benchmarks.

## v5.1 — Conversation continuity and incomplete-answer recovery

The AI Legal Assistant keeps the same Messenger-style interface while improving long Bangla replies and follow-ups:

- Native Workers AI model output budget increases to **1,400 tokens** for an initial chat answer. The model is still instructed to be concise; this is a *maximum*, not a mandatory output length.
- Validated recent chat context now contains up to **six complete user/assistant pairs** (12 messages, up to 1,800 characters each) in **separate model roles** instead of a truncated flattened transcript. No database, cookies or localStorage are used.
- Short follow-ups such as `bujhi nai` and `বুঝিনি` prompt the assistant to re-explain the **specific prior subject**, rather than asking a generic question when the subject is present in the history.
- Browser SSE handling watches the `[DONE]` marker and `finish_reason`. If the answer is cut off, it makes **one bounded continuation call** using the same question/history and appends into the *same assistant bubble*. When still incomplete, it offers a **Continue answer** button; incomplete text is not silently treated as finished.
- The browser never executes model-returned HTML; responses are inserted as plain text. New Chat cancels the request and resets ephemeral conversation state.
- The Worker remains **binding-only** (`env.AI.run`), without REST credentials or a separate AI engine. Existing 11 Public feature routes are unchanged.

### Verification

`node --test tests/worker.test.mjs` passes **39 tests** including continuation payload validation, long Banglish/Bengali history, and token truncation. Local Playwright UI checks simulated a cutoff (`আপনি ক`), verified seamless completion in the same bubble, history-aware `bujhi nai`, a manual Continue fallback, reset, and mobile layout. The model was **mocked** for these checks. A live Cloudflare deployment and real inference quality have not been verified in this environment; token-budget exhaustion, network failures or model errors can still interrupt results.


## Conversation continuity regression fix (November 2026)

- For short clarification follow-ups (`bujhi nai`, `বুঝিনি`, `explain again`), the same user topic is made explicit in the model prompt while previous conversation roles are still preserved. The fallback does not invent facts.
- Long Bangla assistant history is compacted with both its opening context and closing conclusion, rather than keeping only the first 1800 characters.
- Streaming now treats a long sentence lacking an ending as potentially incomplete even if a provider reports `stop`. Existing bounded auto-continuation and manual `উত্তর চালিয়ে যান` controls remain available.
- Regression tests cover context continuity and SSE termination without `[DONE]`. AI inference remains via native Cloudflare Workers binding, without REST tokens or login.

## Instant Legal Drafting Studio (v6)

The Public `/public/instant-legal-draft` route now contains a full bilingual drafting catalog (9 categories, 78 selectable document types, 8 featured draft cards), searchable selection, incident intake, auto/Bengali/English output choice, editable AI preview, and Copy, TXT, downloadable DOCX, plus Print/Save-to-PDF actions.

- Native Cloudflare Workers AI binding only; no external engine or API key, and no login.
- One authoritative draft registry shared between browser and Worker. Unknown `draftTypeId` values and missing incident descriptions are rejected.
- User-supplied incident text may be written in Bengali, English, Banglish or another language. Auto mode asks the multilingual model to match its language; Banglish should produce formal Bengali. Explicit output-language choice overrides auto detection.
- Draft profiles are **editable software defaults**, not universally mandatory Bangladesh filing specifications: A4, 25.4-mm margins, Bengali 14 pt, English 12 pt, 1.5 line spacing. Court and registry documents must follow the specific authority's latest requirements, which may differ (including foolscap forms, stamps, oath/affidavit and annexures).
- Every output is an **unverified SAMPLE**, not ready for filing. The model is told to avoid invented facts, names, court rules, case law, legal sections and deadlines, and use placeholders for missing specifics. Court, criminal, family, land/property and higher-court documents need qualified legal review before use.
- DOCX export is generated locally in the browser using a minimal OOXML ZIP. Print/Save PDF opens the browser print workflow. No PDF API or third-party export provider is used.
- Sensitive identity information and actual case files are discouraged. This UI does not save forms to a database, but entered incident text is sent to the Cloudflare Worker and Workers AI provider for generation. Review Cloudflare data-handling and local law before receiving real client records.
- The other ten Public feature routes and existing AI Legal Assistant are preserved.

Tests: `npm test` covers the catalog, server-side validation, language routing, the draft prompt, and Word XML packaging. Live Workers AI factual accuracy, source indexing, and court-format acceptance **are not guaranteed by automated tests**.


### Instant Legal Drafting QA refinements (November 2026)

The generated document is now tied to its selected draft type and output language. Changing the document type, incident, purpose or output language invalidates a stale preview and requires regeneration, preventing a Legal Notice from being incorrectly downloaded as a Bail Petition. Category-specific **preparation hints** help users supply context without making unsupported legal-filing claims; high-risk court and registry types display an explicit lawyer-review warning. Word (.docx) exports now use configured page-profile margins and Bengali complex-script font settings, and auto output-language selection respects generated document script. Browser print remains Save-as-PDF, not a certified court filing format.

Automated tests cover all 78 draft types, 9 categories, safeguards, editable DOCX structure, formatting profiles and stale-draft prevention. These are software tests and do not establish legal sufficiency or court acceptance.


### Instant Legal Drafting — professional parties and paper-only document output (7 November 2026)

**Sender / Applicant**, **Receiver / Addressee**, both addresses, **Location / District / Thana** and optional **Document Date** are editable inputs on the existing drafting page. The AI receives only provided values; missing details must remain placeholders, never invented names or addresses. High-risk court or registry documents still require authority-specific formatting and qualified legal review.

The Cloudflare Workers AI prompt now requests a formal, respectful document structure: document title, appropriate parties, place/date, subject, facts, requested relief/terms and signature block. A small **AI can make mistakes** reminder is shown **beneath** the editable document in the app, not inside the paper. The DOCX and TXT exports no longer prepend **DRAFT — REVIEW BEFORE USE**. Word formatting applies centered/bold headings, emphasized subjects and justified body paragraphs. Print-to-PDF excludes UI reminders.

Draft inputs are neither persisted to the application's own database nor included in export footers, but **the sender, receiver, addresses and location are sent to Cloudflare Workers AI for generation**. Do not use confidential third-party case details or identity numbers until consent, privacy and retention policies are confirmed. The draft may require manual correction and is not guaranteed suitable for court filing.


### Official-style Bangladesh drafting format correction (November 7, 2026)

- The General Diary (GD) application now has a dedicated **Officer-in-Charge / police-station application** structure (date, addressee, subject, formal salutation, user-supplied incident, requested action and applicant signature). A **Village Court application** is a distinct option (addressed to the relevant Union Parishad Chairperson, subject to actual jurisdiction). They MUST NOT be conflated; other general applications and legal notices also have separate formal structures.
- Application headers, subjects, sender/recipient and signatures are assembled from supplied fields by **server-side document-specific formatting**, rather than trusting a model to translate generic labels. Unknown names, places and dates remain clear placeholders. The AI is instructed to rewrite the **incident narrative only** for these formats; malformed AI replies with full letter headings trigger a safe fallback to supplied facts (or an error if Banglish translation cannot be verified).
- The frontend also removes markdown heading/bold markers from generated previews, so **`**পাঠানো হয়েছে**`**, **`**গ্রহণ করা হয়েছে**`**, and chat-style markup cannot be mistaken for proper application fields. For contracts, deeds, affidavits and court petitions the prompting follows distinct document classes rather than one generic application style.
- No statutes, deadlines, court names, police jurisdiction, deeds or case numbers are invented by deterministic templates. These outputs remain **editable sample drafts**, not a police receipt, official Village Court form, court-ready pleading, registered deed, or legal opinion. Review with the intended receiving authority and qualified legal counsel.

Sources checked for document structure:
- Bangladesh Police Citizen Charter — GD is made in person or online through the police station: https://www.police.gov.bd/index.php/en/citizen_charter
- Government information on Village Court application structure and the Union Parishad Chairperson as addressee: https://dss.sadar.madaripur.gov.bd/pages/static-pages/6995691035ce18e1c07787be
- Government application sample showing address, subject, salutation, main statement and applicant signature: https://teachers.gov.bd/blog/details/851147
- Land Administration Manual requiring prescribed mutation/application forms: https://bhumipedia.land.gov.bd/ebook/view/216

Verification: `npm test` includes screenshot-regression scenarios, correct authority selection, markdown cleanup, formal Bengali/English output, Banglish translation fail-closed, and end-to-end Worker mock. Passing software tests does **not** certify acceptance by Bangladesh police, courts or registries.


### Compact drafting UX + narrative quality update (7 Nov 2026)

The Instant Legal Drafting form now prioritizes **the actual incident description**, followed by applicant/recipient names, location and output language. Sender/receiver addresses, date and specific remedy are available under **More details (optional)**; format guidance and the 79-item library are collapsed by default. All existing fields remain and no user information is retained by the app's own database.

For applications and legal notices, a single native Workers AI invocation now requests a structured narrative (factual prose rather than filler headers), a concise specific subject, and optional Bengali phonetic spellings of user-supplied Latin names/locations. The server assembles a shorter conventional Bangladesh paper without redundant place, repeated sender metadata or duplicated subject lines. The fallback preserves original names rather than inventing a spelling; users must verify legal spelling before use.

If **Legal Notice** is selected with a police-station addressee or an explicit GD request, the backend returns `DRAFT_TYPE_MISMATCH` with a suggestion to choose **GD Application**, instead of creating the wrong kind of paper. The UI offers a switch to the suggested type.

These are editable sample documents, not legal advice or filing-ready papers. An authentic authority-specific official form or qualified lawyer's review takes precedence. Test coverage includes compact form markup, old JSON / plain-text outputs, correct subject/metadata, and GD vs notice mismatch detection.


### Workers AI drafting recovery & citizen-friendly featured cards (2026-11-07)

The runtime `AI_MODEL` setting in `wrangler.jsonc` has been moved off Cloudflare's scheduled-for-deprecation `@cf/qwen/qwen3-30b-a3b-fp8` to `@cf/google/gemma-4-26b-a4b-it`, which Cloudflare advertises as a faster low-compute multilingual replacement. The Cloudflare-native `env.AI.run()` binding is unchanged; the supported Gemma example uses `chat_template_kwargs.enable_thinking=false` to prioritize actual output rather than empty reasoning. A dashboard-level variable may override Wrangler and must be checked at deployment.

Draft generation now detects empty, truncated, malformed JSON and too-short model output, and attempts at most ONE short native AI retry. Model responses are extracted from known text envelopes, excluding reasoning. If both tries fail, ordinary English or Bengali user facts can populate an explicit `template_fallback` working document (NOT presented as a successful AI draft). Latin-script Banglish is never silently passed off as official Bengali; a clear retry/translate instruction appears instead. All legal assertions, identity names and legal procedures remain unverified until reviewed.

Featured cards now focus on everyday citizen-facing drafts: general application, GD application, complaint letter, right-to-information application, consumer complaint, certificate application, Village Court application and refund/return notice. Other drafts remain available in the searchable library with risk/review caveats. Citizens may draft or seek assistance with more complex documents; the shortlist is a convenience, not a declaration of legal permissions. Official filing systems and prescribed forms must still be used where applicable.

Official resources: Bangladesh GRS https://grs.gov.bd/ ; Right to Information forms https://infocom.gov.bd/pages/forms ; Cloudflare migration notice https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/ ; Gemma 4 model docs https://developers.cloudflare.com/ai/models/%40cf/google/gemma-4-26b-a4b-it/ .
