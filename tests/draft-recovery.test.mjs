import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker,{extractAnswer} from '../worker/index.js';
import {FEATURED_DRAFT_IDS,getDraftType} from '../site/drafting-catalog.js';

const apiUrl='https://lexglobalbd.test/api/workflows/instant-legal-draft';
const bangla='রাজশাহী শহরে আমার একটি মোবাইল ফোন হারিয়ে গেছে। ঘটনাটি স্থানীয় থানায় সাধারণ ডায়েরিতে লিপিবদ্ধ করার আবেদন করছি।';
const body=(override={})=>({
  draftTypeId:'gd-application',document:'GD Application',
  details:bangla,outputLanguage:'bn',senderName:'তরিকুল',receiverName:'রাজশাহী থানা',
  location:'রাজশাহী',...override
});
const post=(value)=>new Request(apiUrl,{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(value)
});
const env=(fn)=>({AI:{run:fn},LEGAL_SEARCH_INSTANCE:''});

test('model parser handles native text arrays, nested Cloudflare responses and ignores reasoning',()=>{
  assert.equal(extractAnswer({response:'' ,choices:[{message:{content:'সরাসরি বাংলা উত্তর।'}}]}),'সরাসরি বাংলা উত্তর।');
  assert.equal(extractAnswer({choices:[{message:{content:[{type:'text',text:'একটি '},{type:'text',text:'আবেদন।'}]}}]}),'একটি আবেদন।');
  assert.equal(extractAnswer({result:{response:'সুরক্ষিত উত্তর'}}),'সুরক্ষিত উত্তর');
  assert.equal(extractAnswer({reasoning:'private hidden thought',choices:[{message:{content:null}}]}),'');
});

test('empty first model reply retries once; recovered plain Bangla becomes real GD draft',async()=>{
  let calls=0,models=[],payloads=[];
  const res=await worker.fetch(post(body()),env(async(model,payload)=>{
    calls++;models.push(model);payloads.push(payload);
    return calls===1?{response:''}:{response:'রাজশাহী শহরে আমার একটি মোবাইল হারিয়ে গেছে। আমি ঘটনাটি থানায় লিপিবদ্ধ করতে চাই।'};
  }));
  const j=await res.json();
  assert.equal(res.status,200,JSON.stringify(j));
  assert.equal(calls,2);
  assert.equal(j.mode,'preview_ai');
  assert.equal(j.modelRecovered,true);
  assert.match(j.answer,/বরাবর\nঅফিসার ইনচার্জ\nরাজশাহী থানা/);
  assert.match(j.answer,/রাজশাহী শহরে আমার একটি মোবাইল হারিয়ে গেছে/);
  assert.match(j.answer,/বিনীত নিবেদক/);
  assert.equal(models[0],'@cf/google/gemma-4-26b-a4b-it');
  assert.equal(payloads[0].chat_template_kwargs.enable_thinking,false);
  assert.equal(payloads[1].chat_template_kwargs.enable_thinking,false);
  assert.equal(payloads[1].max_tokens,1100);
});

test('truncated JSON reply triggers plain text recovery, not malformed JSON on legal paper',async()=>{
  let calls=0;
  const res=await worker.fetch(post(body()),env(async()=>{
    calls++;
    return calls===1?{choices:[{finish_reason:'length',message:{content:'{"narrative":"রাজশাহীতে'}}]}
      :{response:'রাজশাহী শহরে আমি একটি মোবাইল ফোন হারিয়েছি। এ বিষয়ে সাধারণ ডায়েরিতে লিপিবদ্ধ করতে চাই।'};
  }));
  const j=await res.json();
  assert.equal(res.status,200,JSON.stringify(j));
  assert.equal(calls,2);
  assert.equal(j.modelRecovered,true);
  assert.doesNotMatch(j.answer,/\{"narrative"/);
  assert.match(j.answer,/রাজশাহী শহরে আমি একটি মোবাইল/);
});

test('both inference replies empty: truthful user-facts-only Bengali template, not fake AI claim',async()=>{
  let calls=0;
  const res=await worker.fetch(post(body()),env(async()=>{
    calls++;return {response:'',reasoning:'hidden chain'};
  }));
  const j=await res.json();
  assert.equal(res.status,200,JSON.stringify(j));
  assert.equal(calls,2);
  assert.equal(j.mode,'template_fallback');
  assert.equal(j.verified,false);
  assert.equal(j.stored,false);
  assert.match(j.answer,/রাজশাহী শহরে আমার একটি মোবাইল/);
  assert.doesNotMatch(j.answer,/AI can make mistakes|DRAFT — REVIEW BEFORE USE/);
});

test('AI first-call temporary error still gets one bounded recovery inference',async()=>{
  let calls=0;
  const res=await worker.fetch(post(body()),env(async()=>{
    calls++;if(calls===1)throw Error('Cloudflare internal transient');
    return {response:'রাজশাহীতে একটি মোবাইল ফোন হারিয়ে যাওয়ায় আমি বিষয়টি সাধারণ ডায়েরিতে লিপিবদ্ধ করতে চাই।'};
  }));
  assert.equal(res.status,200);
  assert.equal(calls,2);
  assert.equal((await res.json()).modelRecovered,true);
});

test('Banglish with two empty replies never fabricated as formal Bengali',async()=>{
  let calls=0;
  const res=await worker.fetch(post(body({
    details:'amar mobile rajshahi te harai gese ami police station e gd korte chai',
    senderName:'TORIKUL',receiverName:'RAJSHAHI POLICE STATION',outputLanguage:'bn'
  })),env(async()=>{calls++;return {response:''};}));
  const j=await res.json();
  assert.equal(res.status,503);
  assert.equal(calls,2);
  assert.equal(j.code,'AI_DRAFT_UNAVAILABLE');
  assert.match(j.message,/বাংলিশ/);
});

test('advanced court petitions are not silently generated from plain user facts after empty AI output',async()=>{
  let calls=0;
  const res=await worker.fetch(post(body({
    draftTypeId:'bail-petition',document:'Bail Petition'
  })),env(async()=>{calls++;return {response:''};}));
  const j=await res.json();
  assert.equal(calls,2);
  assert.equal(res.status,503);
  assert.equal(j.code,'AI_DRAFT_UNAVAILABLE');
});

test('successful first inference is one call only, not charged for unnecessary retry',async()=>{
  let calls=0;
  const res=await worker.fetch(post(body()),env(async()=>{
    calls++;return {response:'রাজশাহীতে একটি মোবাইল ফোন হারিয়ে গেছে। বিষয়টি সাধারণ ডায়েরিতে লিপিবদ্ধ করার আবেদন করছি।'};
  }));
  assert.equal(res.status,200);
  assert.equal(calls,1);
  assert.equal((await res.json()).modelRecovered,false);
});

test('public featured cards show 8 citizen-facing documents; advanced documents stay in catalog',()=>{
  assert.equal(FEATURED_DRAFT_IDS.length,8);
  for(const id of ['general-application','gd-application','complaint-letter','right-to-information','consumer-complaint','certificate-application','village-court-application','refund-notice']){
    assert.ok(FEATURED_DRAFT_IDS.includes(id),id);
    assert.ok(getDraftType(id),id);
  }
  for(const id of ['bail-petition','civil-plaint','land-sale-deed','higher-court-application','affidavit']){
    assert.ok(!FEATURED_DRAFT_IDS.includes(id),id);
    assert.ok(getDraftType(id),id);
  }
});

test('Wrangler model override points to documented current replacement',async()=>{
  const data=JSON.parse(await readFile(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
  assert.equal(data.vars.AI_MODEL,'@cf/google/gemma-4-26b-a4b-it');
  assert.equal(data.ai.binding,'AI');
});

test('missing native AI binding still returns configuration failure, not fake legal document',async()=>{
  const res=await worker.fetch(post(body()),{LEGAL_SEARCH_INSTANCE:''});
  const j=await res.json();
  assert.equal(res.status,503);
  assert.equal(j.code,'AI_BINDING_NOT_CONFIGURED');
});


test('screenshot trial: uppercase Banglish parties become structured Bengali GD through one Cloudflare call',async()=>{
  let calls=0;
  const incident='ami rajshahi te amar mobile phone haraychi ami thanay gd korte chai';
  const response=await worker.fetch(post(body({
    details:incident,senderName:'TORIKUL',
    receiverName:'RAJSHAHI POLICE STATION',
    location:'RAJSHAHI',outputLanguage:'bn'
  })),env(async(_model,payload)=>{
    calls++;
    assert.equal(payload.chat_template_kwargs.enable_thinking,false);
    return {choices:[{finish_reason:'stop',message:{content:JSON.stringify({
      narrative:'রাজশাহী এলাকায় আমার ব্যবহৃত মোবাইল ফোনটি হারিয়ে গেছে। বিষয়টি সংশ্লিষ্ট থানায় সাধারণ ডায়েরিতে লিপিবদ্ধ করার জন্য আবেদন করছি।',
      subject:'মোবাইল ফোন হারিয়ে যাওয়ার বিষয়ে সাধারণ ডায়েরির আবেদন',
      names:{senderName:'তরিকুল',receiverName:'রাজশাহী পুলিশ স্টেশন',location:'রাজশাহী'}
    })}}]};
  }));
  const j=await response.json();
  assert.equal(response.status,200,JSON.stringify(j));
  assert.equal(calls,1);
  assert.equal(j.mode,'preview_ai');
  assert.equal(j.modelRecovered,false);
  assert.match(j.answer,/বরাবর\nঅফিসার ইনচার্জ\nরাজশাহী পুলিশ স্টেশন/);
  assert.match(j.answer,/বিষয়: মোবাইল ফোন হারিয়ে যাওয়ার বিষয়ে সাধারণ ডায়েরির আবেদন/);
  assert.match(j.answer,/বিনীত নিবেদক\nনাম: তরিকুল/);
  assert.match(j.answer,/রাজশাহী এলাকায় আমার ব্যবহৃত মোবাইল ফোনটি হারিয়ে গেছে/);
  assert.doesNotMatch(j.answer,/TORIKUL|RAJSHAHI POLICE STATION|[\*]{2}/);
});
