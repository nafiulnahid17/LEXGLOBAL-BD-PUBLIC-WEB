# LexGlobal BD — Public Foundation (বাংলায় Deploy Guide)

এই ZIP-এ **For Public**-এর ১১টি আলাদা UI page, Premium Navy Blue + Gold theme, responsive navigation, optimized mockup images এবং Cloudflare Worker API placeholder আছে। **কোনো Login/Signup নেই।**

## কম্পিউটারে প্রিভিউ দেখার নিয়ম

1. ZIP Extract করুন।
2. Extract করা ফোল্ডারে Terminal খুলুন।
3. Python 3.10+ থাকলে চালান:

```bash
python3 scripts/dev_server.py
```

4. ব্রাউজারে যান: `http://127.0.0.1:4173/public`

## Cloudflare Workers-এ Deploy

Node.js 20+ ইনস্টল থাকতে হবে। তারপর:

```bash
npm install
npx wrangler login
npx wrangler deploy
```

Deploy সফল হলে Wrangler আপনার Worker URL দেখাবে। সেই URL-এর শেষে `/public` দিয়ে Public Dashboard পাবেন। Project-এর Cloudflare Worker নাম পরিবর্তনের জন্য `wrangler.jsonc`-এর `name` পরিবর্তন করুন।

## কোনগুলো এখন কাজ করবে?

- Public Dashboard এবং ১১টি সেবার আলাদা page
- Sidebar navigation, menu, feature search, responsive layout
- Service form-এর UI ও local input
- ৯৯৯, ১৬৬৯৯ এবং ১০৯ নম্বরে device-supported call link
- Worker-এর `/api/health` এবং `/api/features` endpoints

## কোনগুলো এখন কাজ করবে না?

- প্রকৃত AI legal answer বা case analysis
- লাইভ BRTA/ভূমি/পাসপোর্ট/ট্যাক্স সরকারি API
- ডকুমেন্ট upload, processing, storage বা user data persistence
- SOS gesture detection বা স্বয়ংক্রিয় emergency dispatch

এটি **Foundation**। Live service চালুর আগে backend, API key, security, privacy, legal data, consent এবং end-to-end testing যুক্ত করতে হবে।
