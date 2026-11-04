# LexGlobal BD Public — Cloudflare Deploy ও AI Configuration

## ১. GitHub থেকে চালু

```bash
npm install
npm test
npx wrangler login
npx wrangler deploy
```

Worker name: `lexglobalbd-public-foundation` (প্রয়োজনে `wrangler.jsonc`-এ পরিবর্তন করুন)। Deploy করার পর `/api/health` ও `/api/features` খুলে পরীক্ষা করুন। `site/` হলো frontend এবং `worker/index.js` হলো API।

## ২. Cloudflare AI মডেল

`wrangler.jsonc`-এ `AI` binding যোগ করা হয়েছে। Native Worker binding-এর জন্য আলাদা AI API token দরকার নেই। সর্বনিম্ন overhead-এর জন্য এটিই default; মডেল `@cf/qwen/qwen3-30b-a3b-fp8`। Gateway `default` যুক্ত এবং আইনগত query-এর log collection/cache বন্ধ রাখার চেষ্টা করা হয়। Cloudflare-এর নিজের privacy/billing settings আলাদা করে review করুন।

## ৩. Cloudflare token mode (ঐচ্ছিক)

Cloudflare Dashboard → Workers AI → Use REST API → Create Workers AI API Token. এই token যদি ব্যবহার করতে চান:

```bash
npx wrangler secret put CF_AI_API_TOKEN
```

`wrangler.jsonc` এর `vars`-এ নিজস্ব `CF_ACCOUNT_ID` দিন এবং `CF_AI_USE_REST` = `"true"` করুন। Token কখনো repo, frontend বা screenshot-এ রাখবেন না। শুধু 'deployment token' দিয়ে Workers AI model call হবে **এমন নিশ্চয়তা নেই** — Workers AI read/edit permissions দরকার।

## ৪. ভুল উত্তর কমানোর জন্য আইনি উৎস বাধ্যতামূলক

1. Cloudflare Dashboard থেকে **AI Search** instance তৈরি করুন।
2. সরকারি `*.gov.bd` থেকে মূল আইনের আপডেটেড ও যাচাইকৃত ডকুমেন্ট index করুন। Source metadata-তে `source_url` হিসেবে মূল সরকারি HTTPS URL রাখুন।
3. `wrangler.jsonc`-এ `LEGAL_SEARCH_INSTANCE`-এর খালি value বদলে instance ID দিন।
4. Deploy-এর পর `/api/health`-এ `legalAnsweringEnabled: true` দেখুন এবং বাস্তব কেসের আইনগত উত্তর মানুষ দিয়ে যাচাই করুন। **শুধু এই flag দেখানো মানে data/index/accuracy পরীক্ষা পাস করেছে নয়।**

আইনি উৎস না থাকলে AI Assistant, Draft ও Case Analysis সচেতনভাবে error দেখাবে, বানানো আইন বলবে না। এই তিনটি AI feature-এ ব্যক্তিগত মামলা/কাগজ/NID ইনপুট দেবেন না যতক্ষণ না security/privacy review সম্পন্ন হয়েছে। ফাইল আপলোড বন্ধ।

## ৫. বাস্তব QA

```bash
npm test
```

তারপর browser-এ ১১টি `/public/<feature>` route, ৩টি AI workflow, ৮টি direct guidance route, এবং Cloudflare rate limiting পরীক্ষা করুন। কোনো official BRTA/passport/tax API linked নয়; এই পেজগুলো কেবল সরকারি পোর্টালের link দেখায়। Emergency Gesture এখনো real SOS পাঠায় না।

## ৬. Security ও Costs

- Frontend-এ Login/Signup নেই। Public API-এর জন্য Cloudflare WAF/Turnstile এবং strict global quota বিবেচনা করুন। Rate limit best effort; পুরো পৃথিবীজুড়ে hard global limit নয়।
- Workers AI-তে usage/cost plan অনুযায়ী হবে। Turn off AI Gateway logging and review actual Cloudflare data retention settings.
- কখনো confidential legal data AI backend-এ পাঠাবেন না privacy/consent policy ছাড়া।
