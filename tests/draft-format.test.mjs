import test from 'node:test';
import assert from 'node:assert/strict';
import {getDraftType,DRAFT_TYPES} from '../site/drafting-catalog.js';
import {kindOf as draftKind,cleanText,formatDirective,formatDraft} from '../worker/drafting-format.js';
import {detectResponseLanguage} from '../worker/index.js';
import worker from '../worker/index.js';

const facts='চাঁপাইনবাবগঞ্জ স্টেশনের কাছে একটি ব্যক্তিগত জিনিস হারিয়ে যাওয়ার বিষয়টি আমি লিখিতভাবে জানাতে চাই।';
const data=(extra={})=>({
  details:facts,outputLanguage:'bn',senderName:'রাইহান',
  senderAddress:'চাঁপাইনবাবগঞ্জ সদর',receiverName:'চাঁপাইনবাবগঞ্জ সদর মডেল থানা',
  receiverAddress:'চাঁপাইনবাবগঞ্জ',location:'চাঁপাইনবাবগঞ্জ স্টেশন',
  documentDate:'2026-11-05',...extra
});
const type=(id)=>getDraftType(id);

test('GD screenshot regression: fabricated translated sender/receiver headings never appear',()=>{
  const badModel='সাধারণ ডায়েরির আবেদন\n\n**পাঠানো হয়েছে:**\n[নাম]: রাইহান\n\n**গ্রহণ করা হয়েছে:**\n[নাম]: চাঁপাইনবাবগঞ্জ সদর মডেল থানা\n\n**স্থান:** চাঁপাইনবাবগঞ্জ স্টেশন';
  const draft=formatDraft(type('gd-application'),data(),badModel,detectResponseLanguage);
  assert.ok(draft.startsWith('তারিখ: 2026-11-05'));
  assert.match(draft,/বরাবর\nঅফিসার ইনচার্জ\nচাঁপাইনবাবগঞ্জ সদর মডেল থানা/);
  assert.match(draft,/বিষয়: সাধারণ ডায়েরিতে ঘটনা লিপিবদ্ধকরণের আবেদন/);
  assert.match(draft,/মহোদয়,/);
  assert.match(draft,/বিনীত নিবেদন এই যে/);
  assert.match(draft,/বিনীত নিবেদন এই যে, চাঁপাইনবাবগঞ্জ স্টেশনের কাছে/);
  assert.match(draft,/অতএব, ঘটনাটি সাধারণ ডায়েরিতে লিপিবদ্ধ/);
  assert.match(draft,/বিনীত নিবেদক\nনাম: রাইহান/);
  assert.doesNotMatch(draft,/পাঠানো\s+হ[য়য়]েছে|গ্রহণ\s+করা\s+হ[য়য়]েছে|\*\*|গ্রাম ডিভিশন আবেদন/u);
});

test('government Village Court form is different from GD, with chairman not OC',()=>{
  const village=formatDraft(type('village-court-application'),data({
    receiverName:'[সংশ্লিষ্ট ইউনিয়ন পরিষদের নাম]',
    receiverAddress:'[উপজেলা, জেলা]'
  }),'ঘটনাটির বিষয়ে দুই পক্ষের মধ্যে জমি-সংক্রান্ত একটি বিরোধ রয়েছে।',detectResponseLanguage);
  assert.match(village,/বরাবর\nচেয়ারম্যান/);
  assert.match(village,/গ্রাম আদালতে বিরোধ নিষ্পত্তির আবেদন/);
  assert.doesNotMatch(village,/অফিসার ইনচার্জ|সাধারণ ডায়েরিতে লিপিবদ্ধ/);
  assert.equal(type('village-court-application').review,true);
});

test('general application has respectful salutation, no fabricated recipient and placeholders',()=>{
  const draft=formatDraft(type('general-application'),data({receiverName:'',receiverAddress:'',documentDate:''}),
    'আমার পূর্বে বর্ণিত বিষয়টি বিবেচনা করার জন্য আবেদন জানাচ্ছি।',detectResponseLanguage);
  assert.match(draft,/বরাবর\n\[যাচাই প্রয়োজন\]/);
  assert.match(draft,/তারিখ: \[যাচাই প্রয়োজন\]/);
  assert.match(draft,/বিনীত নিবেদক/);
});

test('Legal Notice has sender and receiver, never police application greeting',()=>{
  const draft=formatDraft(type('legal-notice'),data(),
    'একটি সাধারণ দাবি নিষ্পত্তির জন্য সংশ্লিষ্ট ব্যক্তিকে অবহিত করতে চাই।',detectResponseLanguage);
  assert.match(draft,/^আইনি নোটিশ/m);
  assert.match(draft,/প্রেরক: রাইহান/);
  assert.match(draft,/প্রাপক: চাঁপাইনবাবগঞ্জ সদর মডেল থানা/);
  assert.doesNotMatch(draft,/বরাবর\nঅফিসার ইনচার্জ|বিনীত নিবেদক/);
});

test('English application remains formal English and does not switch to Bengali',()=>{
  const englishData=data({
    details:'I lost a personal item near the railway station and wish to report this incident.',
    outputLanguage:'en',senderName:'Raihan',receiverName:'Sadar Police Station',
    receiverAddress:'District Office',senderAddress:'Rajshahi',location:'Railway Station'
  });
  const result=formatDraft(type('gd-application'),englishData,
    'I lost a personal item near a railway station and want this incident to be recorded.',detectResponseLanguage);
  assert.match(result,/To\nOfficer-in-Charge\nSadar Police Station/);
  assert.match(result,/Subject: Request to Record a General Diary/);
  assert.match(result,/I respectfully submit that/);
  assert.match(result,/Signature: /);
  assert.doesNotMatch(result,/বরাবর|বিনীত নিবেদক/);
});

test('Banglish requires Bengali conversion and rejects unverified unconverted output',()=>{
  const banglish=data({
    details:'ami chapainawabganj station er kase ekta jinish haraychi kintu GD korte chai',
    outputLanguage:'auto'
  });
  assert.throws(()=>formatDraft(type('gd-application'),banglish,
    '**পাঠানো হয়েছে:**\namar nam Raihan',detectResponseLanguage),/DRAFT_TRANSLATION_UNVERIFIED/);
  const good=formatDraft(type('gd-application'),banglish,
    'চাঁপাইনবাবগঞ্জ স্টেশনের কাছে আমার একটি জিনিস হারিয়ে গেছে।',detectResponseLanguage);
  assert.match(good,/বিষয়: সাধারণ ডায়েরিতে ঘটনা লিপিবদ্ধকরণের আবেদন/);
  assert.match(good,/চাঁপাইনবাবগঞ্জ স্টেশনের কাছে/);
});

test('Markdown formatting and trailing AI warning are removed without changing factual placeholders',()=>{
  const cleaned=cleanText('## আবেদনপত্র\n\n**বিষয়:** [যাচাই প্রয়োজন]\n\nAI can make mistakes. Please consult a lawyer.');
  assert.match(cleaned,/বিষয়: \[যাচাই প্রয়োজন\]/);
  assert.doesNotMatch(cleaned,/#|\*\*|AI can make mistakes/);
});

test('agreements, deeds and court petitions use different prompt structures',()=>{
  const kinds=['nda','land-sale-deed','bail-petition'].map(id=>draftKind(type(id)));
  assert.deepEqual(kinds,['agreement','deed','court']);
  assert.match(formatDirective(type('nda')),/AGREEMENT/);
  assert.match(formatDirective(type('land-sale-deed')),/PROPERTY DEED/);
  assert.match(formatDirective(type('bail-petition')),/COURT PLEADING/);
  assert.doesNotMatch(formatDirective(type('nda')),/FACTUAL NARRATIVE ONLY/);
});

test('new village-court draft is in catalog without duplicate IDs',()=>{
  assert.ok(DRAFT_TYPES.length>=79);
  assert.equal(DRAFT_TYPES.filter(x=>x.id==='village-court-application').length,1);
});

test('native Workers AI API returns completed GD paper after malformed model draft',async()=>{
  let modelPrompt;
  const request=new Request('https://lexglobalbd.test/api/workflows/instant-legal-draft',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({...data(),draftTypeId:'gd-application',document:'GD Application'})
  });
  const response=await worker.fetch(request,{AI:{run:async(_model,payload)=>{
    modelPrompt=payload.messages[0].content;
    return {response:'**পাঠানো হয়েছে:**\n[নাম]: রাইহান\n\n**গ্রহণ করা হয়েছে:**\n[নাম]: থানা'};
  }},LEGAL_SEARCH_INSTANCE:''});
  const json=await response.json();
  assert.equal(response.status,200,JSON.stringify(json));
  assert.equal(json.ok,true);
  assert.match(json.answer,/বরাবর\nঅফিসার ইনচার্জ/);
  assert.match(json.answer,/বিনীত নিবেদন এই যে, চাঁপাইনবাবগঞ্জ স্টেশনের কাছে/);
  assert.doesNotMatch(json.answer,/পাঠানো\s+হ[য়য়]েছে|\*\*/);
  assert.match(modelPrompt,/Return ONLY JSON/);
});

test('missing language translation fails safely rather than issuing a formal-looking mixed-language paper',async()=>{
  const request=new Request('https://lexglobalbd.test/api/workflows/instant-legal-draft',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({...data({
      details:'amar jinish chapainawabganj station e hariye gese ar ami GD korte chai',
      outputLanguage:'bn'
    }),draftTypeId:'gd-application',document:'GD Application'})
  });
  const response=await worker.fetch(request,{AI:{run:async()=>({response:'**পাঠানো হয়েছে:** amar nam'})},LEGAL_SEARCH_INSTANCE:''});
  assert.equal(response.status,422);
  assert.equal((await response.json()).code,'DRAFT_FORMAT_UNVERIFIED');
});
