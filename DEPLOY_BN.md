# LexGlobal BD — Public AI Testing (Cloudflare Binding Only)

## এখনই ব্যবহার করার পদ্ধতি

`main` ব্রাঞ্চে আপডেটের পর Cloudflare Workers-এ redeploy করুন (Git auto-deploy থাকলে deploy trigger হবে)। AI-এর জন্য আলাদা API token, REST URL, external engine বা AI Search instance লাগবে না। `wrangler.jsonc`-তে `ai.binding` = `AI` থাকতে হবে।

```bash
npm install
npm test
npx wrangler deploy
```

## Deploy-এর পর যাচাই

1. `https://<your-worker>/api/health` খুলে `aiBindingConfigured: true` এবং `legalAnsweringEnabled: true` দেখুন। `answerMode: preview_ai` থাকলে source index ছাড়া AI ব্যবহারযোগ্য।
2. `/public/ai-legal-assistant`-এ `hi` লিখে Submit করুন। Network-এ POST `/api/workflows/ai-legal-assistant` → HTTP 200; JSON-এ `mode: preview_ai`, `answer` ও `verified: false` দেখাবে।
3. `Instant Legal Draft` ও `AI Case Analysis`-এর নমুনা ফর্মও চেক করুন।
4. অন্য ৮টি সেবার পেজে প্রয়োজনীয় নির্দেশনা ও সরকারি link দেখা যাবে; কোনো বাস্তব সরকারি আবেদন সম্পন্ন হবে না। SOS gesture এখন বাস্তবে কাজ করে না।

## জরুরি সতর্কতা

AI-এর অনিরীক্ষিত আউটপুটকে আদালতে ব্যবহারযোগ্য বা নির্ভুল তথ্য হিসেবে দেখাবেন না। এই Preview Mode-এ আইন, ধারা বা মামলা সংক্রান্ত তথ্য মূল উৎস ও আইনজীবীর মাধ্যমে যাচাই করতে হবে। সাইটের নিজস্ব database নেই, কিন্তু AI provider-এ সাধারণ প্রশ্ন পাঠানো হয়; গোপন তথ্য দেবেন না।

## ভবিষ্যতে

Verified legal documents index এবং প্রয়োজনীয় official government service API সংযুক্ত হলে আলাদা production upgrade করা যাবে। Preview Mode এখন engine ছাড়াই শুধু Cloudflare `env.AI.run()` দিয়ে AI response তৈরি করে।


## v5 — Chat Streaming & Language

GitHub থেকে নতুন commit deploy করুন। Native `AI` binding অপরিবর্তিত; API Token/REST দরকার নেই।

- Chat UI এখন `stream:true` পাঠায়। Preview mode-এ Workers AI SSE stream দিয়ে chat bubble আপডেট করে।
- অন্য API client-রা `stream` বাদ দিলে আগের মতো JSON পাবে। Verified-source mode citation যাচাইয়ের জন্য JSON-ই রাখে।
- ইংরেজি প্রশ্নে ইংরেজি, বাংলা প্রশ্নে বাংলা এবং সাধারণ Banglish-এ বাংলা script-এ উত্তর দেওয়ার instruction যোগ হয়েছে।
- Live পরীক্ষা: `hi`, `kemon acho`, `amar bou palai gese onno cheler sathe`, `Can you help me?`, `Hola, necesito ayuda`, `मुझे मदद चाहिए`, `أريد المساعدة`। Model অপ্রাসঙ্গিক ভাষা বা ভুল সম্পর্ক ধরে নিলে issue report করুন।

`npm test` ও `npx wrangler deploy` রান করুন। AI-এর response speed বাস্তবে network ও model load-এর উপর নির্ভর করে।
