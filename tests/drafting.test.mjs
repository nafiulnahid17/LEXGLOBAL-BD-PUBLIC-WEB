import test from 'node:test';
import assert from 'node:assert/strict';
import {DRAFT_CATEGORIES,DRAFT_TYPES,FEATURED_DRAFT_IDS,DRAFT_FORMAT_PROFILES,getDraftType} from '../site/drafting-catalog.js';
import {draftingWorkspace,buildDraftDocx,bindDraftingStudio,cleanDraftDocument} from '../site/drafting.js';
import api from '../worker/index.js';

const origin='https://lexglobal.example';
const env=(override={})=>({
  ASSETS:{fetch:()=>new Response('site')},
  AI:{run:async(_model,payload)=>({response:'নমুনা আইনি নোটিশ\n\nবিষয়: জমি সংক্রান্ত সাধারণ বিবরণ।\n\n[নাম], [তারিখ], [স্বাক্ষর] প্রয়োজন।'})},
  LEGAL_SEARCH_INSTANCE:'',...override
});
const post=(body)=>new Request(origin+'/api/workflows/instant-legal-draft',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)
});
const facts='আমার জমি নিয়ে একটি সাধারণ বিরোধ হয়েছে। কোনো ব্যক্তিগত পরিচয় এখানে উল্লেখ করিনি।';

test('catalog includes 9 named categories and at least 70 unique document types',()=>{
  assert.equal(DRAFT_CATEGORIES.length,9);
  assert.ok(DRAFT_TYPES.length>=70);
  assert.equal(new Set(DRAFT_TYPES.map(d=>d.id)).size,DRAFT_TYPES.length);
  for(const item of DRAFT_TYPES){
    assert.ok(item.en&&item.bn&&item.category&&item.profile);
    assert.ok(DRAFT_CATEGORIES.some(c=>c.id===item.category),item.id);
    assert.ok(DRAFT_FORMAT_PROFILES[item.profile],item.id);
    assert.equal(getDraftType(item.id)?.id,item.id);
  }
  assert.equal(FEATURED_DRAFT_IDS.length,8);
  assert.ok(FEATURED_DRAFT_IDS.every(id=>getDraftType(id)));
});

test('drafting UI exposes accessible featured cards, searchable library, incident input and exports',()=>{
  const html=draftingWorkspace();
  for(const id of ['ds-featured','ds-search','ds-types','ds-categories','ds-incident','ds-purpose','ds-output-language',
    'ds-generate','ds-draft-text','ds-copy','ds-docx','ds-txt','ds-pdf','ds-print-only']){
      assert.match(html,new RegExp('id="'+id+'"'));
    }
  assert.match(html,/Auto — match incident language/);
  assert.match(html,/Word/);
  assert.match(html,/PDF/);
});

test('selected type, Bengali output and review-safe instructions reach native Workers AI',async()=>{
  let captured;
  const response=await api.fetch(post({
    draftTypeId:'legal-notice',document:'Legal Notice',purpose:'নমুনা নোটিশ',
    details:facts,outputLanguage:'bn'
  }),env({AI:{run:async(_m,payload)=>{captured=payload;return {response:'নমুনা আইনি নোটিশ। পর্যালোচনা করুন।'};}}}));
  assert.equal(response.status,200);
  const result=await response.json();
  assert.equal(result.ok,true);
  assert.equal(result.mode,'preview_ai');
  assert.equal(result.verified,false);
  assert.equal(result.stored,false);
  assert.match(captured.messages[0].content,/Legal Notice/);
  assert.match(captured.messages[0].content,/complete document in formal, clear Bengali/i);
  assert.match(captured.messages[0].content,/Never fabricate courts/i);
  assert.ok(captured.max_tokens>=2000);
});

test('full English incident and outputLanguage en override draft language',async()=>{
  let prompt='';
  const response=await api.fetch(post({
    draftTypeId:'nda',document:'Non-Disclosure Agreement',
    purpose:'Confidentiality',details:'We want to write a general NDA without identifying the actual parties or sensitive company records.',
    outputLanguage:'en'
  }),env({AI:{run:async(_m,p)=>{prompt=p.messages[0].content;return {response:'SAMPLE NDA: Parties [To verify], date [To verify].'};}}}));
  assert.equal(response.status,200);
  assert.match(prompt,/only in professional English/);
  assert.match(prompt,/Non-Disclosure Agreement/);
});

test('auto language rule instructs Banglish to be rendered in Bangla script',async()=>{
  let prompt='';
  const response=await api.fetch(post({
    draftTypeId:'land-sale-deed',document:'Land Sale Deed',
    purpose:'ami application korte chai',
    details:'amar jomi dokhol korse. ami ekta aini draft chai. ami kono ashol NID dicchi na.',
    outputLanguage:'auto'
  }),env({AI:{run:async(_m,p)=>{prompt=p.messages[0].content;return {response:'নমুনা দলিলের বিষয়। রেজিস্ট্রি অফিসের অনুমোদিত ফরম যাচাই করুন।'};}}}));
  assert.equal(response.status,200);
  assert.match(prompt,/Banglish -> formal Bengali script/);
  assert.match(prompt,/registration/i);
});

test('unknown draftTypeId is rejected without AI inference',async()=>{
  let invoked=false;
  const response=await api.fetch(post({draftTypeId:'invented-type',document:'Writ',details:facts,outputLanguage:'bn'}),
    env({AI:{run:async()=>{invoked=true;return {response:'unreachable'};}}}));
  assert.equal(response.status,422);
  assert.equal((await response.json()).code,'INVALID_DRAFT_TYPE');
  assert.equal(invoked,false);
});

test('short incident and invalid output language are rejected',async()=>{
  for(const [body,code] of [
    [{draftTypeId:'legal-notice',document:'Legal Notice',details:'hi',outputLanguage:'auto'},'MISSING_INCIDENT'],
    [{draftTypeId:'legal-notice',document:'Legal Notice',details:facts,outputLanguage:'xx'},'INVALID_DRAFT_LANGUAGE']
  ]){
    const response=await api.fetch(post(body),env());
    assert.equal(response.status,422);assert.equal((await response.json()).code,code);
  }
});

function readZipEntries(arrayBuffer){
  const data=new Uint8Array(arrayBuffer),view=new DataView(arrayBuffer);
  let at=0;const list=new Map(),decoder=new TextDecoder();
  while(at+30<data.length&&view.getUint32(at,true)===0x04034b50){
    const size=view.getUint32(at+18,true),nameLength=view.getUint16(at+26,true),extraLength=view.getUint16(at+28,true);
    const name=decoder.decode(data.slice(at+30,at+30+nameLength));
    const begin=at+30+nameLength+extraLength;
    list.set(name,decoder.decode(data.slice(begin,begin+size)));
    at=begin+size;
  }
  return list;
}
test('DOCX export is a valid ZIP structure with Word XML and safe escaped content',async()=>{
  const blob=buildDraftDocx('Legal Notice','নমুনা <টেক্সট> & legal\n\n[নাম]', 'standard','bn');
  assert.equal(blob.type,'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  const zip=readZipEntries(await blob.arrayBuffer());
  assert.ok(zip.has('[Content_Types].xml'));
  assert.ok(zip.has('_rels/.rels'));
  assert.ok(zip.has('word/document.xml'));
  const xml=zip.get('word/document.xml');
  assert.match(xml,/&lt;টেক্সট&gt; &amp; legal/);
  assert.match(xml,/Noto Serif Bengali/);
  assert.match(xml,/11906/); // A4 page size in twips
  assert.ok(!xml.includes('<টেক্সট>'));
});


test('preparation guidance and lawyer review notice are present in drafting workspace',()=>{
  const html=draftingWorkspace();
  assert.match(html,/id="ds-preparation-hints"/);
  assert.match(html,/id="ds-review-note"/);
});

test('DOCX uses page-profile margins and Bengali complex-script font settings',async()=>{
  const conf=DRAFT_FORMAT_PROFILES.standard;
  const original=conf.marginMm;
  try {
    conf.marginMm=30;
    const blob=buildDraftDocx('Legal Notice','ঘটনার বিবরণ পরীক্ষা করছি।','standard','auto');
    const files=readZipEntries(await blob.arrayBuffer());
    const xml=files.get('word/document.xml');
    const margin=Math.round(30*1440/25.4);
    assert.match(xml,new RegExp('w:pgMar w:top="'+margin+'" w:right="'+margin+'"'));
    assert.match(xml,/w:cs="Noto Serif Bengali"/);
    assert.match(xml,/w:szCs w:val="28"/);
  } finally {conf.marginMm=original;}
});

test('auto DOCX language chooses English font size for English-only draft',async()=>{
  const blob=buildDraftDocx('Legal Notice','This is an English legal drafting sample.','standard','auto');
  const files=readZipEntries(await blob.arrayBuffer());
  const xml=files.get('word/document.xml');
  assert.match(xml,/w:sz w:val="24"/);
  assert.match(xml,/w:cs="Times New Roman"/);
});

test('selecting a new drafting type invalidates older generated output instead of mislabelled export',async()=>{
  const originalDocument=globalThis.document;
  const originalWindow=globalThis.window;
  const originalFetch=globalThis.fetch;
  const elements=new Map();
  const ensure=(id)=>{
    if(!elements.has(id)) elements.set(id,{
      value:'',hidden:false,style:{},dataset:{},listeners:{},
      addEventListener(event,callback){this.listeners[event]=callback;},
      replaceChildren(){},append(){},scrollIntoView(){},focus(){}
    });
    return elements.get(id);
  };
  globalThis.document={getElementById:ensure};
  globalThis.window={confirm:()=>true};
  globalThis.fetch=async()=>new Response(JSON.stringify({
    ok:true,answer:'SAMPLE LEGAL NOTICE\nParties: [Names to verify]\nRelevant facts will be checked.',
    incomplete:false,mode:'preview_ai',sources:[]
  }),{status:200,headers:{'content-type':'application/json'}});
  try {
    ensure('ds-incident').value='একটি কাল্পনিক ভূমি সংক্রান্ত সমস্যার সাধারণ বিবরণ এখানে লিখেছি।';
    ensure('ds-output-language').value='auto';
    bindDraftingStudio();
    await ensure('ds-generate').listeners.click();
    assert.equal(ensure('ds-result').hidden,false);
    assert.match(ensure('ds-document-title').textContent,/Legal Notice/);
    const target={
      closest(selector){return selector==='[data-draft-id]'?{dataset:{draftId:'bail-petition'}}:null;}
    };
    ensure('draft-studio').listeners.click({target});
    assert.equal(ensure('ds-result').hidden,true,'stale draft preview must disappear');
    assert.equal(ensure('ds-selected-name').textContent,'Bail Petition');
    assert.match(ensure('ds-status').textContent,/নতুন Draft তৈরি করুন/);
  } finally {
    if(originalDocument===undefined) delete globalThis.document; else globalThis.document=originalDocument;
    if(originalWindow===undefined) delete globalThis.window; else globalThis.window=originalWindow;
    globalThis.fetch=originalFetch;
  }
});


test('new sender, receiver, place and date fields appear before editable document; disclaimer stays outside paper',()=>{
  const html=draftingWorkspace();
  for(const id of ['ds-sender-name','ds-sender-address','ds-receiver-name','ds-receiver-address','ds-location','ds-document-date','ds-ai-disclaimer']){
    assert.match(html,new RegExp('id="'+id+'"'),id);
  }
  assert.ok(html.indexOf('id="ds-ai-disclaimer"')>html.indexOf('id="ds-draft-text"'));
  assert.ok(html.indexOf('id="ds-ai-disclaimer"')<html.indexOf('id="ds-print-only"'));
  assert.match(html,/AI can make mistakes/);
});

test('party and location fields reach native Workers AI as user-supplied data',async()=>{
  let payload;
  const response=await api.fetch(post({
    draftTypeId:'legal-notice',document:'Legal Notice',details:facts,outputLanguage:'bn',
    senderName:'মোঃ আলী',senderAddress:'রাজশাহী শহর',receiverName:'ABC Limited',
    receiverAddress:'ঢাকা অফিস',location:'রাজশাহী',documentDate:'2026-11-07',
  }),env({AI:{run:async(_model,p)=>{payload=p;return {response:'আইনি নোটিশ\nবিষয়: তথ্য যাচাই সাপেক্ষে\nপ্রেরক: মোঃ আলী\nপ্রাপক: ABC Limited'};}}}));
  assert.equal(response.status,200);
  const latest=payload.messages.at(-1).content;
  for(const expected of ['senderName: মোঃ আলী','senderAddress: রাজশাহী শহর','receiverName: ABC Limited','receiverAddress: ঢাকা অফিস','location: রাজশাহী','documentDate: 2026-11-07']){
    assert.ok(latest.includes(expected),expected);
  }
  const policy=payload.messages[0].content;
  assert.match(policy,/professionally formatted legal DOCUMENT BODY/);
  assert.match(policy,/UI shows cautions separately BELOW the paper/);
  assert.match(policy,/formal and respectful drafting style/);
});

test('malformed or oversized party/location fields are rejected before inference',async()=>{
  let calls=0;
  for(const bad of [{senderName:4},{senderAddress:'x'.repeat(321)},{receiverName:'x'.repeat(161)},{location:'x'.repeat(161)},{documentDate:'2026/11/07'}]){
    const response=await api.fetch(post({draftTypeId:'legal-notice',document:'Legal Notice',details:facts,outputLanguage:'en',...bad}),
      env({AI:{run:async()=>{calls++;return {response:'never'};}}}));
    assert.equal(response.status,422);
    assert.equal((await response.json()).code,'INVALID_INPUT');
  }
  assert.equal(calls,0);
});

test('DOCX export has professional title, subject and paragraphs but no AI warning watermark',async()=>{
  const text='LEGAL NOTICE\nTo: ABC Limited\nSubject: Request for records\nThe recipient is requested to review these records.';
  const zip=readZipEntries(await buildDraftDocx('Legal Notice',text,'standard','en').arrayBuffer());
  const xml=zip.get('word/document.xml');
  assert.match(xml,/w:jc w:val="center"/);
  assert.match(xml,/w:b\//);
  assert.match(xml,/w:jc w:val="both"/);
  assert.ok(!xml.includes('DRAFT — REVIEW BEFORE USE'));
  assert.ok(!xml.includes('AI can make mistakes'));
});

test('trailing model disclaimer is removed while important factual placeholders stay',()=>{
  const text='আইনি নোটিশ\n\nপ্রেরক: [যাচাই প্রয়োজন]\nপ্রাপক: [যাচাই প্রয়োজন]\n\nবিষয়: নথিপত্র চেয়ে আবেদন।\n\nAI can make mistakes. Consult a lawyer.';
  const cleaned=cleanDraftDocument(text);
  assert.match(cleaned,/প্রেরক: \[যাচাই প্রয়োজন\]/);
  assert.match(cleaned,/বিষয়: নথিপত্র চেয়ে আবেদন/);
  assert.doesNotMatch(cleaned,/AI can make mistakes/);
});
