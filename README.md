# LexGlobal BD — For Public | Cloudflare Workers Foundation

**Status: Cloudflare deployment foundation — user interface only.**

A responsive, premium Navy Blue + Gold public-services frontend designed around the user's previously approved **11 Public UI mockups**. Every public feature has a separate URL, contextual service form / workspace, responsive navigation, and optimized preview artwork. There is **no login/signup**.

The package is intentionally lightweight: **plain HTML, CSS, JavaScript + a Cloudflare Worker**, with no React or npm frontend build required. It deploys directly to Cloudflare Workers Static Assets.

## 1. Run locally

Requires **Python 3.10+** for the included local preview server:

```bash
python3 scripts/dev_server.py
```

Open **http://127.0.0.1:4173/public**. The local preview server supports refreshing `/public/<feature-slug>` URLs.

No live backend API is connected to the local preview. All interactive form submit buttons correctly show a **not configured** message; nothing is sent.

## 2. Deploy to Cloudflare Workers

Requires **Node.js 20+**, a Cloudflare account and internet access.

```bash
npm install
npx wrangler login
npx wrangler deploy
```

Or run `npm run deploy` after `npm install`. The first deployment uses the name **lexglobalbd-public-foundation**; edit `name` in `wrangler.jsonc` to rename your Worker.

To bind a custom domain, go to **Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Domains & Routes**.

> Deploying will publish the interface and API placeholders only. No AI engines, official government service APIs, uploads, SMS, data storage or gesture alerts are activated by this starter.

## 3. Feature routes

| # | Public feature | Path |
|---|---|---|
| 1 | AI Legal Assistant | `/public/ai-legal-assistant` |
| 2 | Instant Legal Draft | `/public/instant-legal-draft` |
| 3 | AI Case Analysis | `/public/ai-case-analysis` |
| 4 | Smart Land Management | `/public/smart-land-management` |
| 5 | Smart Vehicle & BRTA Services | `/public/smart-vehicle-brta` |
| 6 | Smart Tax Management | `/public/smart-tax-management` |
| 7 | Passport Assistant | `/public/passport-assistant` |
| 8 | Expat & Documentation Help | `/public/expat-documentation` |
| 9 | NariSafe — Women's Safety | `/public/narisafe` |
| 10 | Emergency SOS Gesture | `/public/emergency-sos-gesture` |
| 11 | Emergency Call | `/public/emergency-call` |

`/` also displays the dashboard. Internal links navigate between these pages without full reloads. Direct navigation works through Wrangler's SPA fallback configuration.

## 4. Foundation API

After Cloudflare deployment:

- `GET /api/health` → `200`, `{ok:true, mode:"foundation", integrationsActive:false}`
- `GET /api/features` → `200`, lists all 11 feature slugs as `not_configured`
- `POST /api/workflows/:slug` → `501`, `PROVIDER_NOT_CONFIGURED`. Sensitive request bodies are **not read or stored**.

The frontend intentionally does not transmit any form fields to the Worker. A form submit displays a local status message only.

## 5. How to connect actual services later

- `site/app.js` — feature registry, UI templates, route handling, form placeholder behavior. Replace the form submit handler with authenticated and validated API calls once integrations are available.
- `site/styles.css` — theme tokens, responsive layout and accessibility styling.
- `worker/index.js` — Cloudflare API entry point. Integrate service providers here or proxy to approved backends using secure server-side bindings.
- `site/previews/*.webp` — optimized images derived from the earlier Public UI mockups, supplied as design placeholders.
- `wrangler.jsonc` — Worker configuration, static assets, SPA route fallback.
- `site/_headers` — security headers applied to static content.

**Secrets:** use `npx wrangler secret put YOUR_SECRET`, never embed credentials in `site/app.js`. Before accepting legal, medical or identity information, implement validation, privacy controls, consent, secure storage, retention/deletion, abuse/rate limiting, and legal advice guardrails.

**Safety:** SOS Gesture is **not** operational; never advertise automatic dispatch or geolocation sharing until a verified and consent-based implementation exists. The direct `tel:` links for **999**, **16699** and **109** can invoke a device's dialer but do not independently place a call or monitor an emergency. This site is not an emergency responder.

## 6. Verified helpline information

- Bangladesh National Emergency Service: **999** (source: Bangladesh Police and national portal).
- National Legal Aid (NLASO): **16699**. This replaced 16430 in November 2025.
- Women and Children Violence Prevention Helpline: **109** (source: Bangladesh National Portal).

Sources:
- https://telecom-police.portal.gov.bd/
- https://nlaso.gov.bd/
- https://bangladesh.gov.bd/

## 7. Suggested integration phases

1. Deploy UI on Workers (no AI or government APIs yet).
2. Connect a legal assistant to your approved model gateway and legal corpus with source citation and moderation.
3. Integrate legal drafts + case analysis through secure backend handling; do not send case documents without authorization.
4. Add public service adapters, only where official APIs and permissions exist.
5. Add explicit consent/permission-based safety workflows, then test with actual devices and emergency protocols.

## 8. Project structure

```text
LexGlobalBD_Public_Cloudflare_Foundation/
├── site/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   ├── _headers
│   ├── favicon.svg
│   └── previews/       # 11 optimized mockup images + 1 hero asset
├── worker/
│   └── index.js
├── scripts/
│   └── dev_server.py
├── wrangler.jsonc
├── package.json
└── README.md
```

Cloudflare reference: https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/
