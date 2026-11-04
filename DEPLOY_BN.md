# LexGlobal BD Public — Cloudflare Workers AI Binding Only

## কী পরিবর্তন হলো

- `wrangler.jsonc` ফাইলে `ai: { binding: "AI" }` আছে।
- `worker/index.js`-এ AI inference-এর **একমাত্র** পদ্ধতি `env.AI.run(model, payload)`।
- REST API, account ID, bearer-token inference, manual AI key এবং AI Gateway forwarding নেই।
- Binding অনুপস্থিত হলে backend `AI_BINDING_NOT_CONFIGURED` দেখায়; অনুমান করে উত্তর দেয় না।

## GitHub থেকে Cloudflare-এ deploy

Cloudflare account-এ Workers AI ও Workers ব্যবহার করার অনুমতি থাকতে হবে। Node.js 20+ এবং Wrangler 4.68.1+ ব্যবহার করুন।

```bash
npm install
npm test
npx wrangler login
npx wrangler deploy
```

`wrangler login` শুধু deploy করার জন্য Cloudflare CLI authentication; AI inference-এর জন্য কোনো API token লাগবে না।

## আইনগত তথ্যের AI Search binding

1. Cloudflare Dashboard-এ AI Search instance তৈরি করুন। এতে সর্বশেষ সরকারি `*.gov.bd` মূল আইনের নির্ভরযোগ্য ডকুমেন্ট index করুন; `source_url` metadata-তে আসল HTTPS সরকারি URL রাখুন।
2. `wrangler.jsonc`-এর `vars.LEGAL_SEARCH_INSTANCE`-এ instance-এর **name/ID** বসান। `AI_SEARCH` namespace binding ইতিমধ্যে কনফিগার করা।
3. `npx wrangler deploy` দিয়ে Worker প্রকাশ করুন।
4. `GET /api/health`-এ `aiProvider: "cloudflare_workers_ai_binding"`, `aiBindingConfigured: true` এবং `legalSourceIndexConfigured: true` দেখুন। এগুলো কেবল configuration readiness; **যাচাইকৃত source content, output accuracy বা model latency প্রমাণ করে না**।
5. নিরাপদ test questions দিয়ে AI Assistant, Draft এবং Case Analysis চালিয়ে আসল আইন ও citations আলাদাভাবে যাচাই করুন।

**আইনি index না থাকলে AI output ইচ্ছাকৃতভাবে বন্ধ থাকবে** (`LEGAL_SOURCES_NOT_CONFIGURED`)। কোনো real legal documents, NID, passport, ব্যক্তিগত মামলা বা গোপন তথ্য privacy review ছাড়া পাঠাবেন না।

## UI/API এবং সীমাবদ্ধতা

- `site/` এ আগের Premium Navy+Gold ১১টি Public UI page অক্ষত আছে; login/signup নেই।
- সরকারি গাইডের ৮টি route দ্রুত curated official links দেয়; সরকারি API-তে আবেদন জমা দেয় না।
- AI response-এর citation যাচাই এবং rate limit আছে, কিন্তু আইনি ভুল ১০০% ঠেকানোর গ্যারান্টি নেই।
- Emergency SOS Gesture সত্যিকারের জরুরি বার্তা/লোকেশন পাঠায় না।
- Live deployment এবং বাস্তব Cloudflare Workers AI result এই প্যাকেজ থেকে verify করা হয়নি।

Cloudflare official docs:
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/ai-search/api/migration/workers-binding/
