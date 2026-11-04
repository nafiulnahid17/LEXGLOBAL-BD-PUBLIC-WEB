# QA — Cloudflare Workers AI Integration v2

## Automated tests

`npm test` runs Node.js test cases with mocked Cloudflare bindings. Scenarios include:
- 11 features and configuration health
- Official guidance response for every non-AI public route
- Three AI workflow input types with official source grounding
- Failure closed for missing source index, invalid domains, low similarity
- Blocking uncited and out-of-range citations
- Safe response on model failure, cross-origin abuse, overlong request, invalid JSON, file upload
- Approximate rate limiting and static asset fallback

Also run `node --check worker/index.js` and `node --check site/app.js`.

## Production verification NOT YET performed

- Cloudflare account authorization and deployment
- Real Workers AI token validity / native AI binding inference
- AI Search index creation and trustworthy legal-text ingestion
- Bengali legal-domain correctness evaluated by licensed reviewers
- Actual response latency and throughput benchmarks
- Cloudflare account billing and data residency/privacy settings
- End-to-end browser visual accessibility review

**No model can guarantee zero legal mistakes.** The app requires official-source retrieval, displays citations, and rejects some malformed responses to reduce risk. A human review and continuous source maintenance are still essential.
