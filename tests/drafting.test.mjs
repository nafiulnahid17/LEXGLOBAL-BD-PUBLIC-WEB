import test from 'node:test';
import assert from 'node:assert/strict';
import {DRAFT_CATEGORIES,DRAFT_TYPES,FEATURED_DRAFT_IDS,DRAFT_FORMAT_PROFILES,getDraftType} from '../site/drafting-catalog.js';
import {draftingWorkspace,buildDraftDocx} from '../site/drafting.js';
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
