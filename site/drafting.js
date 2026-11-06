import { DRAFT_CATEGORIES, DRAFT_TYPES, FEATURED_DRAFT_IDS, DRAFT_FORMAT_PROFILES, getDraftType } from './drafting-catalog.js';

const featured = FEATURED_DRAFT_IDS.map(getDraftType).filter(Boolean);
const icons = {general:'✍',criminal:'⚖',civil:'§',family:'♡',property:'⌂',business:'▣',employment:'♙',higher:'⚑',settlement:'◇'};
const state = {category:'all',selected:'legal-notice',search:'',generated:false,generatedType:null,generatedLanguage:'bn',incomplete:false,busy:false,outputLanguage:'auto'};
const el = id => document.getElementById(id);
const safe = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId = id => getDraftType(id) || getDraftType('legal-notice');

export function draftingWorkspace() {
  return [
    '<div class="draft-studio" id="draft-studio">',
      '<section class="ds-hero"><div><span class="ds-eyebrow">LEXGLOBAL BD · AI DRAFTING STUDIO</span>',
      '<h2>Instant Legal <em>Drafting</em></h2>',
      '<p>ডকুমেন্ট নির্বাচন করুন, ঘটনা লিখুন, AI দিয়ে একটি সম্পাদনাযোগ্য নমুনা খসড়া তৈরি করুন।</p></div>',
      '<span class="ds-total">', DRAFT_TYPES.length, ' Draft Types <small>9 Categories</small></span></section>',
      '<div class="ds-steps"><span><b>01</b> Draft Type</span><span><b>02</b> Incident</span><span><b>03</b> Generate & Export</span></div>',
      '<section class="ds-section"><div class="ds-heading"><div><small>QUICK START</small><h3>Featured Drafting</h3></div><span>Popular templates</span></div>',
      '<div id="ds-featured" class="ds-featured"></div></section>',
      '<section class="ds-section"><div class="ds-heading"><div><small>DOCUMENT LIBRARY</small><h3>All Drafting Types</h3></div>',
      '<span id="ds-count"></span></div><div class="ds-search-wrap"><label class="visually-hidden" for="ds-search">Search draft types</label>',
      '<input id="ds-search" type="search" placeholder="Search drafting types / খসড়া খুঁজুন" autocomplete="off"></div>',
      '<div id="ds-categories" class="ds-categories" aria-label="Draft categories"></div>',
      '<div id="ds-types" class="ds-cards"></div></section>',
      '<section class="ds-section ds-create" id="ds-create"><div class="ds-heading"><div><small>CREATE YOUR DRAFT</small>',
      '<h3>Write Your Incident</h3></div><span class="ds-tag">Cloudflare AI · Preview</span></div>',
      '<div class="ds-selected"><span class="ds-selected-symbol">✍</span><div><small>Selected Document</small>',
      '<strong id="ds-selected-name">Legal Notice</strong><span id="ds-selected-bn"></span></div>',
      '<span class="ds-profile-pill" id="ds-profile-pill">A4 working draft</span></div>',
      '<div class="ds-fields">',
      '<fieldset class="ds-parties"><legend>Document Parties & Place · পক্ষ ও স্থান</legend>',
      '<p class="ds-fields-note">যতটুকু তথ্য জানা আছে দিন। ফাঁকা থাকলে AI খসড়ায় [যাচাই প্রয়োজন] placeholder রাখবে।</p>',
      '<div class="ds-party-grid">',
      '<div class="ds-party-group"><h4>Sender / Applicant · প্রেরক / আবেদনকারী</h4>',
      '<label for="ds-sender-name">Name / নাম</label><input id="ds-sender-name" maxlength="160" autocomplete="off" placeholder="Sender / Applicant name">',
      '<label for="ds-sender-address">Address / ঠিকানা</label><textarea id="ds-sender-address" rows="2" maxlength="320" placeholder="Sender address (optional)"></textarea></div>',
      '<div class="ds-party-group"><h4>Receiver / Addressee · প্রাপক / অপর পক্ষ</h4>',
      '<label for="ds-receiver-name">Name / Office / নাম</label><input id="ds-receiver-name" maxlength="160" autocomplete="off" placeholder="Receiver / Authority name">',
      '<label for="ds-receiver-address">Address / ঠিকানা</label><textarea id="ds-receiver-address" rows="2" maxlength="320" placeholder="Receiver address (optional)"></textarea></div>',
      '</div><div class="ds-party-grid ds-location-grid">',
      '<div><label for="ds-location">Location / District / Thana · স্থান</label><input id="ds-location" maxlength="160" autocomplete="off" placeholder="City, district or relevant location"></div>',
      '<div><label for="ds-document-date">Document Date / তারিখ (optional)</label><input id="ds-document-date" type="date" aria-label="Document date"></div>',
      '</div></fieldset>',
      '<label for="ds-purpose">Purpose / কী করতে চান? <span>Optional</span></label>',
      '<input id="ds-purpose" maxlength="160" placeholder="e.g. Send a legal notice / আইনি নোটিশ পাঠাতে চাই">',
      '<label for="ds-incident">Incident Details / ঘটনার বিবরণ <b>*</b></label>',
      '<textarea id="ds-incident" rows="8" minlength="20" maxlength="2600" placeholder="বাংলা, English, Banglish বা অন্য ভাষায় ঘটনার বিবরণ লিখুন। উদাহরণ: amar jomi dokhol koreche..."></textarea>',
      '<div class="ds-input-foot"><span id="ds-detected">Language: Auto</span><span id="ds-chars">0 / 2600</span></div>',
      '<label for="ds-output-language">Draft Output Language</label>',
      '<select id="ds-output-language"><option value="auto">Auto — match incident language</option>',
      '<option value="bn">বাংলা — Formal Bangla</option><option value="en">English — Professional English</option></select>',
      '<div id="ds-format-note" class="ds-format-note"></div>',
      '<div id="ds-preparation-hints" class="ds-preparation-hints" role="note"></div>',
      '<div id="ds-review-note" class="ds-review-note" role="note" hidden></div>',
      '<div class="ds-warning">⚠ এটি AI-প্রস্তুত নমুনা খসড়া। সত্য তথ্য, সংশ্লিষ্ট আইন, আদালতের নিয়ম, স্বাক্ষর, ফি ও দলিলের ফরম্যাট পেশাদারভাবে যাচাই করুন। পরিচয়পত্র/পাসপোর্ট নম্বর বা গোপন নথি লিখবেন না।</div>',
      '<div class="ds-actions"><button type="button" id="ds-generate" class="ds-generate">✦ &nbsp; Generate Draft <span>→</span></button>',
      '<button type="button" id="ds-reset" class="ds-secondary">Clear Fields</button></div>',
      '<div id="ds-status" role="status" aria-live="polite" class="ds-status" hidden></div>',
      '</div></section>',
      '<section class="ds-section ds-result" id="ds-result" hidden><div class="ds-heading"><div><small>DOCUMENT WORKSPACE</small>',
      '<h3>Edit & Export Your Draft</h3></div><span class="ds-tag" id="ds-preview-status">AI Preview · Review Required</span></div>',
      '<div class="ds-editor-toolbar"><span id="ds-document-title"></span><span id="ds-document-profile"></span></div>',
      '<textarea id="ds-draft-text" aria-label="Editable draft text" spellcheck="true"></textarea>',
      '<p class="ds-ai-disclaimer" id="ds-ai-disclaimer" role="note">AI can make mistakes. খসড়ার তথ্য ও আইন যাচাই করুন; প্রয়োজন হলে আইনজীবীর পরামর্শ নিন। এই সতর্কতা ডকুমেন্টের অংশ নয় এবং export-এ যাবে না।</p>',
      '<div id="ds-output-sources" class="ds-sources"></div>',
      '<div class="ds-export"><button type="button" id="ds-copy">Copy Text</button>',
      '<button type="button" id="ds-docx">Download Word (.docx)</button>',
      '<button type="button" id="ds-txt">Download Text (.txt)</button>',
      '<button type="button" id="ds-pdf">Print / Save PDF</button></div>',
      '<div class="ds-print-only" id="ds-print-only"></div></section>',
    '</div>'
  ].join('');
}

function card(item, featuredCard=false) {
  return '<button type="button" class="'+(featuredCard?'ds-featured-card':'ds-type-card')+
    (state.selected===item.id?' selected':'')+'" data-draft-id="'+safe(item.id)+'" aria-pressed="'+(state.selected===item.id)+'">'+
    '<span class="ds-type-icon">'+safe(icons[item.category]||'✍')+'</span><strong>'+safe(item.en)+'</strong>'+
    '<small>'+safe(item.bn)+'</small></button>';
}
const DRAFT_PREPARATION_HINTS = {
  general:['ঘটনার তারিখ ও স্থান','কাকে নোটিশ বা আবেদন দেবেন [যাচাই প্রয়োজন]','আপনি কী ফলাফল চান'],
  criminal:['ঘটনা ও সম্ভাব্য প্রমাণের সময়ক্রম','সংশ্লিষ্ট থানা বা আদালতের তথ্য [যাচাই প্রয়োজন]','যে প্রতিকার চাইছেন'],
  civil:['ঘটনা, বিরোধের পক্ষ ও দাবির ভিত্তি','সম্পর্কিত নথির সংক্ষিপ্ত তালিকা','প্রার্থিত প্রতিকার ও আদালত [যাচাই প্রয়োজন]'],
  family:['প্রাসঙ্গিক ঘটনার সময়ক্রম','কাদের বিষয়ে আবেদন [নাম পরে যাচাই]','কী প্রতিকার বা সহায়তা প্রয়োজন'],
  property:['সম্পত্তির বিবরণ ও দলিল [যাচাই প্রয়োজন]','ঘটনার সময়ক্রম','সংশ্লিষ্ট অফিসের নির্ধারিত ফরম যাচাই'],
  business:['পক্ষ ও চুক্তির উদ্দেশ্য','দায়িত্ব, মেয়াদ ও অর্থনৈতিক শর্ত','বিশেষ বিধান ও স্বাক্ষরকারী [যাচাই প্রয়োজন]'],
  employment:['কাজ বা সেবার সম্পর্ক','তারিখ, দায়িত্ব ও বকেয়া দাবির সাধারণ বিবরণ','যে সমাধান চাইছেন'],
  higher:['বিষয়, ঘটনা ও আগের আদেশের বিবরণ','আদালত, এখতিয়ার ও সময়সীমা [যাচাই প্রয়োজন]','আইনজীবীর বাধ্যতামূলক বিশেষজ্ঞ রিভিউ'],
  settlement:['কাদের মধ্যে সমঝোতা','বিরোধের সংক্ষিপ্ত বিবরণ','সমঝোতার শর্ত ও দায়বদ্ধতা']
};
function invalidateGeneratedDraft(){
  if(!state.generated)return;
  state.generated=false;state.generatedType=null;state.incomplete=false;
  const result=el('ds-result');if(result)result.hidden=true;
  setStatus('তথ্য বা Draft Type পরিবর্তিত হয়েছে। পুরোনো ডকুমেন্ট export না করে নতুন Draft তৈরি করুন।','warning');
}

function renderCatalog(){
  if(!el('ds-types'))return;
  el('ds-featured').innerHTML=featured.map(item=>card(item,true)).join('');
  const selected=byId(state.selected);
  const list=DRAFT_TYPES.filter(item=>(state.category==='all'||item.category===state.category) &&
    (item.en+' '+item.bn+' '+item.id).toLowerCase().includes(state.search.toLowerCase()));
  el('ds-types').innerHTML=list.map(item=>card(item)).join('') ||
    '<p class="ds-no-results">কোনো খসড়া পাওয়া যায়নি। অন্যভাবে খুঁজুন।</p>';
  el('ds-count').textContent=list.length+' options';
  el('ds-categories').innerHTML=
    '<button class="'+(state.category==='all'?'active':'')+'" data-category="all" type="button">All ('+DRAFT_TYPES.length+')</button>'+
    DRAFT_CATEGORIES.map(c=>'<button type="button" data-category="'+safe(c.id)+'" class="'+
      (state.category===c.id?'active':'')+'">'+safe(c.en)+'</button>').join('');
  const profile=DRAFT_FORMAT_PROFILES[selected.profile];
  el('ds-selected-name').textContent=selected.en;
  el('ds-selected-bn').textContent=selected.bn;
  el('ds-profile-pill').textContent=profile.page+' · Working Draft';
  el('ds-format-note').textContent=
    'Format suggestion: '+profile.page+', '+profile.marginMm+'mm margin, Bengali '+profile.bnPt+
    'pt / English '+profile.enPt+'pt, line spacing '+profile.spacing+'. '+profile.note;
  el('ds-preparation-hints').textContent='তথ্য প্রস্তুতির চেকলিস্ট (পরামর্শ, বাধ্যতামূলক ফরম নয়): '+(DRAFT_PREPARATION_HINTS[selected.category]||DRAFT_PREPARATION_HINTS.general).join(' · ');
  const review=el('ds-review-note');
  review.hidden=!selected.review;
  review.textContent=selected.review?'⚠ উচ্চ ঝুঁকির আইনি ড্রাফট: আদালত বা রেজিস্ট্রি অফিসে ব্যবহারের আগে আইনজীবী ও সংশ্লিষ্ট কর্তৃপক্ষের বর্তমান নিয়ম যাচাই আবশ্যক।':'';
}
function detectIncidentLanguage(text){
  if(/[\u0980-\u09ff]/u.test(text))return 'Bangla → বাংলা';
  const tokens=(text.toLowerCase().match(/[a-z]+/g)||[]);
  const matches=tokens.filter(x=>['amar','ami','tumi','jomi','dokhol','korche','koreche','gese','geche','bari','mamla','bujhi','chai','korte','nibo','ki','kibhabe','sathe','bou'].includes(x));
  if(matches.length>=2)return 'Banglish → বাংলা';
  if(/[\u0900-\u097f]/u.test(text))return 'Hindi → Auto';
  if(/[\u0600-\u06ff]/u.test(text))return 'Arabic → Auto';
  return text.trim()?'English / Other → Auto':'Auto';
}
function setStatus(message,kind='info'){
  const node=el('ds-status');if(!node)return;
  node.hidden=false;node.dataset.kind=kind;node.textContent=message;
}
function setBusy(busy){
  state.busy=busy;const node=el('ds-generate');
  node.disabled=busy;node.textContent=busy?'Generating with Cloudflare AI…':'✦ Generate Draft →';
}
function syncPreview(){
  const printable=el('ds-print-only'),editor=el('ds-draft-text');
  if(!printable||!editor)return;
  printable.textContent=editor.value;
  const profile=DRAFT_FORMAT_PROFILES[byId(state.generatedType||state.selected).profile];
  printable.style.fontSize=(state.generatedLanguage==='en'?profile.enPt:profile.bnPt)+'pt';
  printable.style.lineHeight=String(profile.spacing);
}
function renderSources(sources){
  const container=el('ds-output-sources');container.replaceChildren();
  if(!sources||!sources.length)return;
  const caption=document.createElement('strong');caption.textContent='Referenced official sources';container.append(caption);
  for(const src of sources){
    try {
      const url=new URL(src.url);
      if(url.protocol!=='https:')continue;
      const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';
      a.textContent=src.title||url.hostname;container.append(a);
    }catch{/* ignore */}
  }
}
const PARTY_FIELDS = {
  senderName:'ds-sender-name',senderAddress:'ds-sender-address',
  receiverName:'ds-receiver-name',receiverAddress:'ds-receiver-address',
  location:'ds-location',documentDate:'ds-document-date'
};
function readPartyFields(){
  return Object.fromEntries(Object.entries(PARTY_FIELDS).map(([key,id])=>[key,el(id)?.value.trim()||'']));
}
function inputSignature(type,purpose,details,language,parties){
  return JSON.stringify([type,purpose,details,language,parties]);
}
// Remove ONLY distinct trailing AI disclaimers, not substantive clauses or placeholders.
export function cleanDraftDocument(raw){
  const paragraphs=String(raw||'').trim().replace(/\r\n?/g,'\n').split(/\n\s*\n/);
  const disclaimer=/^(?:\*{0,2})?(?:Disclaimer|Important note|AI can make mistakes|AI-generated|This is (?:an? )?(?:AI|sample) draft|Please (?:verify|consult)|দ্রষ্টব্য\s*[:：]|সতর্কতা\s*[:：]|এই খসড়া এআই[-\s]?(?:প্রস্তুত|তৈরি)|এটি এআই[-\s]?(?:প্রস্তুত|তৈরি)|আইনি পরামর্শ নয়)[\s\S]*$/iu;
  while(paragraphs.length>1&&disclaimer.test(paragraphs[paragraphs.length-1].trim()))paragraphs.pop();
  return paragraphs.join('\n\n').trim();
}
async function generateDraft(){
  if(state.busy)return;
  const details=el('ds-incident').value.trim(),purpose=el('ds-purpose').value.trim();
  if(details.length<20){setStatus('অন্তত ২০ অক্ষরে ঘটনার সাধারণ বিবরণ লিখুন।','error');el('ds-incident').focus();return;}
  const type=byId(state.selected);
  const submittedLanguage=el('ds-output-language').value;
  const parties=readPartyFields();
  const submittedSignature=inputSignature(type.id,purpose,details,submittedLanguage,parties);
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),45000);
  setBusy(true);setStatus('ড্রাফট প্রস্তুত করা হচ্ছে…');
  try{
    const response=await fetch('/api/workflows/instant-legal-draft',{
      method:'POST',headers:{'content-type':'application/json'},
      credentials:'same-origin',cache:'no-store',signal:controller.signal,
      body:JSON.stringify({draftTypeId:type.id,document:type.en,purpose,details,outputLanguage:submittedLanguage,...parties})
    });
    const result=await response.json();
    if(!response.ok || !result.ok)throw new Error(result.message||'Draft generation unavailable');
    const cleanedDraft=cleanDraftDocument(result.answer);
    if(cleanedDraft.length<15)throw new Error('No usable draft was generated');
    if(!el('ds-result'))return; // User navigated away while the AI was working.
    const currentSignature=inputSignature(state.selected,el('ds-purpose').value.trim(),el('ds-incident').value.trim(),el('ds-output-language').value,readPartyFields());
    if(currentSignature!==submittedSignature){setStatus('ইনপুট বদলেছে। নতুন তথ্য অনুযায়ী Generate করুন।','warning');return;}
    state.generated=true;state.generatedType=type.id;
    state.generatedLanguage=submittedLanguage==='auto'
      ? (/[\u0980-\u09ff]/u.test(cleanedDraft)?'bn':'en') : submittedLanguage;
    state.incomplete=Boolean(result.incomplete);
    el('ds-result').hidden=false;
    el('ds-document-title').textContent=type.en+' · '+type.bn;
    el('ds-document-profile').textContent=DRAFT_FORMAT_PROFILES[type.profile].page+' · Editable';
    el('ds-draft-text').value=cleanedDraft;
    el('ds-preview-status').textContent=result.mode==='grounded_ai'?'Source-linked · Lawyer Review':'AI Preview · Unverified';
    syncPreview();renderSources(result.sources);
    if(state.incomplete)setStatus('⚠ AI উত্তর অসম্পূর্ণ হতে পারে। Draft সম্পাদনা করুন এবং পুনরায় generate বা আইনজীবীর সঙ্গে যাচাই করুন।','warning');
    else setStatus('খসড়া তৈরি হয়েছে। সম্পাদনা, কপি এবং Export করতে পারবেন।','success');
    el('ds-result').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(error){setStatus(error.name==='AbortError'?'AI response time exceeded. Try again.':error.message,'error');}
  finally{clearTimeout(timeout);setBusy(false);}
}
function xmlEscape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function crc32(bytes){
  let crc=0xffffffff;
  for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1;}
  return (crc^0xffffffff)>>>0;
}
function zipStore(entries){
  const encoder=new TextEncoder(),chunks=[],directory=[];let offset=0;
  function u16(n){return [n&255,(n>>>8)&255];}
  function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
  for(const entry of entries){
    const name=encoder.encode(entry.name),body=encoder.encode(entry.text),crc=crc32(body);
    const local=new Uint8Array([80,75,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),
      ...u32(crc),...u32(body.length),...u32(body.length),...u16(name.length),...u16(0)]);
    chunks.push(local,name,body);
    directory.push({name,bodyLength:body.length,crc,offset});offset+=local.length+name.length+body.length;
  }
  const centralStart=offset;
  for(const entry of directory){
    const head=new Uint8Array([80,75,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),
      ...u32(entry.crc),...u32(entry.bodyLength),...u32(entry.bodyLength),...u16(entry.name.length),
      ...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(entry.offset)]);
    chunks.push(head,entry.name);offset+=head.length+entry.name.length;
  }
  const end=new Uint8Array([80,75,5,6,...u16(0),...u16(0),...u16(directory.length),...u16(directory.length),
    ...u32(offset-centralStart),...u32(centralStart),...u16(0)]);
  chunks.push(end);
  return new Blob(chunks,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
export function buildDraftDocx(title,text,profile,lang='bn'){
  const conf=DRAFT_FORMAT_PROFILES[profile]||DRAFT_FORMAT_PROFILES.standard;
  const effectiveLanguage=lang==='auto'?(/[\u0980-\u09ff]/u.test(text)?'bn':'en'):lang;
  const size=effectiveLanguage==='en'?conf.enPt:conf.bnPt;
  const margin=Math.round(conf.marginMm*1440/25.4); // twips per 25.4 mm (one inch)
  const lines=text.replace(/\r\n?/g,'\n').split('\n');
  const firstLine=lines.findIndex(line=>line.trim().length>0);
  const p=lines.map((line,index)=>{
    const heading=index===firstLine;
    const subject=/^\s*(?:বিষয়|বিষয়|subject|re\s*:|বরাবর\s*:|to\s*:|from\s*:)/iu.test(line);
    const party=/^\s*(?:তারিখ|স্থান|প্রেরক|প্রাপক|ঠিকানা|date|place|sender|receiver|applicant|respondent|address|বিনীত|স্বাক্ষর|signature)/iu.test(line);
    const alignment=heading?'center':subject||party||!line.trim()?'left':'both';
    const bold=heading||subject?'<w:b/>':'';
    return '<w:p><w:pPr><w:jc w:val="'+alignment+'"/><w:spacing w:line="'+Math.round(conf.spacing*240)+'" w:lineRule="auto"/></w:pPr>'+
      '<w:r><w:rPr>'+bold+'<w:rFonts w:ascii="'+xmlEscape(conf.enFont)+'" w:hAnsi="'+xmlEscape(conf.enFont)+'" w:eastAsia="'+xmlEscape(conf.bnFont)+'" w:cs="'+xmlEscape(effectiveLanguage==='en'?conf.enFont:conf.bnFont)+'"/>'+
      '<w:sz w:val="'+(size*2)+'"/><w:szCs w:val="'+(size*2)+'"/></w:rPr><w:t xml:space="preserve">'+xmlEscape(line)+'</w:t></w:r></w:p>';
  }).join('');
  const body=p+
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="'+margin+'" w:right="'+margin+'" w:bottom="'+margin+'" w:left="'+margin+'"/></w:sectPr>';
  const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'</w:body></w:document>';
  return zipStore([
    {name:'[Content_Types].xml',text:'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'},
    {name:'_rels/.rels',text:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'},
    {name:'word/document.xml',text:doc}
  ]);
}
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function exportDraft(type){
  if(!state.generated || state.generatedType!==state.selected){
    setStatus('এই Draft Type-এর জন্য নতুন ডকুমেন্ট Generate করুন; আগের draft export করা যাবে না।','warning');
    return;
  }
  const text=el('ds-draft-text')?.value.trim();
  if(!text){setStatus('আগে একটি draft তৈরি করুন।','error');return;}
  if(state.incomplete && !window.confirm('AI উত্তর অসম্পূর্ণ হতে পারে। নিজে যাচাই করে তবেই Export করবেন। চালিয়ে যাবেন?'))return;
  const kind=byId(state.generatedType),name='LexGlobalBD-'+kind.id;
  if(type==='copy'){navigator.clipboard.writeText(text).then(()=>setStatus('Text copied.','success')).catch(()=>setStatus('Copy unavailable; select the text manually.','error'));return;}
  if(type==='txt'){downloadBlob(new Blob([text],{type:'text/plain;charset=utf-8'}),name+'.txt');return;}
  if(type==='docx'){downloadBlob(buildDraftDocx(kind.en,text,kind.profile,state.generatedLanguage),name+'.docx');return;}
  if(type==='pdf'){syncPreview();window.print();}
}
export function bindDraftingStudio(){
  const root=el('draft-studio');if(!root)return;
  state.category='all';state.search='';state.selected='legal-notice';state.busy=false;state.generated=false;state.generatedType=null;state.generatedLanguage='bn';state.incomplete=false;
  renderCatalog();
  root.addEventListener('click',event=>{
    const cat=event.target.closest('[data-category]');
    if(cat){state.category=cat.dataset.category;renderCatalog();return;}
    const draft=event.target.closest('[data-draft-id]');
    if(draft){
      if(state.busy)return;
      if(state.selected!==draft.dataset.draftId)invalidateGeneratedDraft();
      state.selected=draft.dataset.draftId;renderCatalog();
      el('ds-create').scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
  el('ds-search').addEventListener('input',event=>{state.search=event.target.value.trim();renderCatalog();});
  for(const id of Object.values(PARTY_FIELDS))el(id).addEventListener('input',invalidateGeneratedDraft);
  el('ds-purpose').addEventListener('input',invalidateGeneratedDraft);
  el('ds-output-language').addEventListener('change',invalidateGeneratedDraft);
  el('ds-incident').addEventListener('input',event=>{
    invalidateGeneratedDraft();
    el('ds-chars').textContent=event.target.value.length+' / 2600';
    el('ds-detected').textContent='Detected: '+detectIncidentLanguage(event.target.value);
  });
  el('ds-generate').addEventListener('click',generateDraft);
  el('ds-reset').addEventListener('click',()=>{
    if(el('ds-incident').value && !window.confirm('বর্তমান ঘটনার বিবরণ মুছে ফেলবেন?'))return;
    el('ds-purpose').value='';el('ds-incident').value='';el('ds-output-language').value='auto';
    for(const id of Object.values(PARTY_FIELDS))el(id).value='';
    el('ds-result').hidden=true;el('ds-status').hidden=true;state.generated=false;state.generatedType=null;state.incomplete=false;
    el('ds-chars').textContent='0 / 2600';el('ds-detected').textContent='Language: Auto';
  });
  el('ds-draft-text').addEventListener('input',syncPreview);
  for(const [id,action] of [['ds-copy','copy'],['ds-docx','docx'],['ds-txt','txt'],['ds-pdf','pdf']])
    el(id).addEventListener('click',()=>exportDraft(action));
}
