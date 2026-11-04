# QA — Native AI Binding Only v2.1

## Local automated checks

Run `npm test`, `node --check worker/index.js`, `node --check site/app.js`.

- All 11 Public routes and AI/official-guide separation.
- All three legal AI workflows call native `env.AI.run()` with mocked AI and AI Search bindings.
- Source grounding, domain restrictions, citation constraints, missing-source fail-closed.
- Missing AI binding fails closed regardless of external configuration values.
- Input validation, uploads disabled, rate limits, cross-origin blocking and error redaction.
- Worker source contains no REST-based Cloudflare AI inference or bearer-token fallback.

## Not yet verified in production

- Cloudflare account binding provisioned on a deployed Worker.
- Real AI Search index populated with verified Bangladesh law.
- Actual Qwen model quality, cost, Bengali performance, speed and citation correctness.
- Legal subject-matter review and sensitive-data privacy clearance.
- Frontend real-browser interaction and live Cloudflare routing.

No guarantee of 100% accuracy. Always review source citations and consult a lawyer for consequential decisions.
