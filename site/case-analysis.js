// LexGlobal BD — case discussion UI, tab-memory only; never store legal case data.
export function caseAnalysisWorkspace(){return `
<section class="ca-studio" id="ca-studio" aria-label="AI Case Discussion and Analysis">
 <header class="ca-head"><span class="ca-kicker">LEXGLOBAL BD · CASE DISCUSSION</span><h3>AI Case Discussion & Analysis</h3>
 <p>এক লাইনে শুরু করুন। ঘটনাক্রম, আইন, প্রমাণ, নথি, পরবর্তী পদক্ষেপ ও ঝুঁকি বুঝে নিন।</p></header>
 <div class="ca-flow">ঘটনা <span>→</span> আইনি বিষয় <span>→</span> প্রমাণ ও নথি <span>→</span> পরবর্তী পদক্ষেপ <span>→</span> ঝুঁকি</div>
 <form id="ca-form" class="ca-form">
  <label for="ca-facts">আপনার ঘটনার বিবরণ <b>*</b></label>
  <textarea id="ca-facts" required rows="5" maxlength="2600" placeholder="উদাহরণ: amar jomi niye jhamela, ki korbo? অথবা: I paid for a product but it was not delivered."></textarea>
  <div class="ca-count"><span>বাংলা, English, Banglish বা মিশ্র ভাষা লিখতে পারবেন।</span><span id="ca-chars">0 / 2600</span></div>
  <div class="ca-options"><div><label for="ca-type">মামলার ধরন (ঐচ্ছিক)</label><select id="ca-type">
   <option value="">Auto</option><option value="land">Land / জমি</option><option value="criminal">Criminal / ফৌজদারি</option>
   <option value="family">Family / পারিবারিক</option><option value="contract">Contract / চুক্তি</option>
   <option value="consumer">Consumer / ভোক্তা</option><option value="other">Other / অন্যান্য</option></select></div>
  <div><label for="ca-language">উত্তরের ভাষা</label><select id="ca-language">
   <option value="auto">Auto — বাংলা ও Banglish → বাংলা</option><option value="bn">বাংলা</option><option value="en">English</option></select></div></div>
  <div class="ca-examples"><button type="button" data-ca-example="আমার জমির মালিকানা নিয়ে বিরোধ হচ্ছে।">🏠 Land</button>
  <button type="button" data-ca-example="amar mobile phone churi hoye geche ki korbo">📱 Banglish</button>
  <button type="button" data-ca-example="I paid in advance for a product but it was not delivered.">📦 English</button></div>
  <div class="ca-actions"><button id="ca-start" type="submit" class="ca-primary">✦ Analyze My Case →</button>
  <button id="ca-reset" type="button" class="ca-secondary">New Case</button></div>
  <p class="ca-privacy">NID, password, ব্যাংক তথ্য বা গোপন নথি লিখবেন না। এখানে কোনো ফাইল আপলোড বা server-side case storage নেই।</p>
  <p id="ca-error" class="ca-error" role="status" aria-live="polite" hidden></p>
 </form>
 <section class="ca-result" id="ca-result" hidden>
  <div class="ca-results-head"><div><span class="ca-kicker">PRELIMINARY ASSESSMENT</span><h3>Case Analysis Report</h3><p id="ca-provider"></p></div>
  <div class="ca-actions"><button id="ca-copy" type="button">Copy</button><button id="ca-save" type="button">Save TXT</button></div></div>
  <div class="ca-summary"><strong>01 · Case Overview</strong><p id="ca-summary"></p></div>
  <div class="ca-grid">
   <section class="ca-panel"><h4>02 · Known Facts / জানা তথ্য</h4><ul id="ca-knownFacts"></ul></section>
   <section class="ca-panel"><h4>03 · Missing Facts / অজানা তথ্য</h4><ul id="ca-missingFacts"></ul></section>
   <section class="ca-panel"><h4>04 · Legal Issues / সম্ভাব্য আইনি বিষয়</h4><ul id="ca-legalIssues"></ul></section>
   <section class="ca-panel"><h4>05 · Timeline / ঘটনাক্রম</h4><ul id="ca-timeline"></ul></section>
   <section class="ca-panel"><h4>06 · Preserve Evidence / প্রমাণ</h4><ul id="ca-evidenceToPreserve"></ul></section>
   <section class="ca-panel"><h4>07 · Documents / নথি</h4><ul id="ca-documentsNeeded"></ul></section>
   <section class="ca-panel"><h4>08 · Next Steps / করণীয়</h4><ul id="ca-nextSteps"></ul></section>
   <section class="ca-panel ca-risks"><h4>09 · Risks / ঝুঁকি</h4><ul id="ca-risks"></ul></section>
  </div>
  <section class="ca-references"><h4>10 · Applicable Law Candidates / সম্ভাব্য আইন ও ধারা</h4>
   <p>শুধু বিষয়ভিত্তিক সরকারি reference দেখানো হয়; আপনার ঘটনার ক্ষেত্রে প্রযোজ্যতা ও বর্তমান সংশোধন যাচাই করতে হবে।</p>
   <div id="ca-ref-list"></div></section>
  <section class="ca-panel ca-followups"><h4>11 · Case Discussion / পরবর্তী আলোচনা</h4><ul id="ca-questions"></ul>
   <form id="ca-followup-form"><label for="ca-followup">আরও তথ্য বা প্রশ্ন দিন</label>
   <textarea id="ca-followup" rows="3" maxlength="850" placeholder="যেমন: আমার কাছে WhatsApp screenshot আছে, এরপর কী করব?"></textarea>
   <button id="ca-continue" type="submit" class="ca-primary">Continue Discussion →</button></form>
   <div id="ca-turns" role="log" aria-label="Previous case discussion prompts"></div>
  </section>
  <div id="ca-emergency" class="ca-emergency" hidden>জীবন বা নিরাপত্তা নিয়ে তাৎক্ষণিক ঝুঁকি থাকলে <a href="tel:999">৯৯৯</a>-এ কল করুন।</div>
  <p class="ca-disclaimer" id="ca-disclaimer">AI can make mistakes. এটি পেশাদার আইনজীবীর বিকল্প নয়।</p>
 </section>
</section>`;}
const LIST_FIELDS=['knownFacts','missingFacts','legalIssues','timeline','evidenceToPreserve','documentsNeeded','nextSteps','risks','questions'];
const byId=id=>document.getElementById(id);
function appendBullet(root,text){const li=document.createElement('li');li.textContent=String(text);root.append(li);}
function safeUrl(value){try{const url=new URL(value);return url.protocol==='https:'&&
 ['bdlaws.minlaw.gov.bd','dncrp.gov.bd'].includes(url.hostname)?url.href:null;}catch{return null;}}
function reportText(r){
 const a=r.analysis,parts=['Case Overview\n'+a.summary];
 for(const key of LIST_FIELDS)parts.push('\n'+key+':\n'+(a[key]||[]).map((s,i)=>(i+1)+'. '+s).join('\n'));
 parts.push('\nPotential legal references:\n'+(r.references||[]).map(x=>x.lawEn+' — section '+x.section+' — '+x.url).join('\n'));
 return parts.join('\n')+'\n\n'+r.disclaimer;
}
export function bindCaseAnalysis(){
 if(!byId('ca-form'))return;
 let facts='',type='',language='auto',history=[],report=null,turns=0,busy=false;
 function error(text=''){const p=byId('ca-error');p.hidden=!text;p.textContent=text;}
 function loading(value){busy=value;byId('ca-start').disabled=value;byId('ca-continue').disabled=value;
  byId('ca-start').textContent=value?'Analyzing…':'✦ Analyze My Case →';
  byId('ca-continue').textContent=value?'Analyzing…':'Continue Discussion →';}
 function display(r){
  report=r;turns++;byId('ca-result').hidden=false;byId('ca-summary').textContent=r.analysis.summary;
  for(const key of LIST_FIELDS){
   const root=byId('ca-'+key);root.replaceChildren();
   const items=r.analysis[key]||[];
   if(!items.length)appendBullet(root,r.language==='bn'?'তথ্য এখনও পাওয়া যায়নি।':'Not enough information yet.');
   for(const item of items)appendBullet(root,item);
  }
  byId('ca-provider').textContent='Discussion '+turns+' · '+(r.language==='bn'?'বাংলা':'English')+
    ' · '+(r.providerUsed==='vercel-ai-gateway'?'Gemini':r.providerUsed==='cloudflare-workers-ai'?'Cloudflare':'AI Preview');
  const refs=byId('ca-ref-list');refs.replaceChildren();
  if(!r.references?.length){const p=document.createElement('p');p.textContent=r.language==='bn'?
   'দেওয়া তথ্য থেকে নির্দিষ্ট কোনো ধারা নিশ্চিত করা যাচ্ছে না।':'No provision can be suggested from the available facts.';refs.append(p);}
  for(const item of r.references||[]){
   const link=safeUrl(item.url);if(!link)continue;
   const card=document.createElement('div');card.className='ca-ref';
   const h=document.createElement('strong');h.textContent=
    (r.language==='bn'?item.lawBn:item.lawEn)+' · '+(r.language==='bn'?'ধারা ':'Section ')+item.section;
   const p=document.createElement('p');p.textContent=r.language==='bn'?item.bn:item.en;
   const a=document.createElement('a');a.href=link;a.target='_blank';a.rel='noopener noreferrer';
   a.textContent=r.language==='bn'?'মূল সরকারি উৎস দেখুন':'Read official source';
   card.append(h,p,a);refs.append(card);
  }
  byId('ca-disclaimer').textContent='AI can make mistakes. '+r.disclaimer;
  byId('ca-emergency').hidden=!r.emergency;
  byId('ca-result').scrollIntoView?.({block:'start',behavior:'smooth'});
 }
 async function ask(followUp=''){
  if(busy||!facts)return;
  loading(true);error('');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),44000);
  try{
   const response=await fetch('/api/workflows/ai-case-analysis',{method:'POST',
    headers:{'content-type':'application/json'},credentials:'same-origin',cache:'no-store',signal:controller.signal,
    body:JSON.stringify({facts,followUp,type,outputLanguage:language,history:history.slice(-8)})});
   const body=await response.json();
   if(!response.ok||!body.ok||body.mode!=='case_discussion')throw Error(body.message||'Analysis unavailable');
   display(body);
   history.push({role:'user',content:(followUp||facts).slice(0,1600)},
    {role:'assistant',content:[body.analysis.summary,...body.analysis.nextSteps.slice(0,2)].join(' ').slice(0,1600)});
   if(history.length>8)history=history.slice(-8);
   if(followUp){const note=document.createElement('p');note.className='ca-turn';
    note.textContent='Follow-up '+(turns-1)+': '+followUp;byId('ca-turns').prepend(note);}
   byId('ca-followup').value='';
  }catch(e){error(e.name==='AbortError'?'AI response timed out. আবার চেষ্টা করুন।':e.message||'সংযোগে সমস্যা হয়েছে।');}
  finally{clearTimeout(timer);loading(false);}
 }
 byId('ca-facts').addEventListener('input',()=>byId('ca-chars').textContent=byId('ca-facts').value.length+' / 2600');
 byId('ca-form').addEventListener('submit',e=>{
  e.preventDefault();facts=byId('ca-facts').value.trim();type=byId('ca-type').value;language=byId('ca-language').value;
  if(facts.length<2)return error('অন্তত একটি ছোট ঘটনা লিখুন।');
  history=[];turns=0;byId('ca-turns').replaceChildren();ask();
 });
 byId('ca-followup-form').addEventListener('submit',e=>{
  e.preventDefault();const next=byId('ca-followup').value.trim();
  if(!next)return error('একটি পরবর্তী প্রশ্ন লিখুন।');ask(next);
 });
 byId('ca-reset').addEventListener('click',()=>{
  if(busy)return;facts='';type='';language='auto';history=[];report=null;turns=0;
  byId('ca-facts').value='';byId('ca-type').value='';byId('ca-language').value='auto';
  byId('ca-chars').textContent='0 / 2600';byId('ca-turns').replaceChildren();
  byId('ca-result').hidden=true;error('');byId('ca-facts').focus();
 });
 document.querySelectorAll('[data-ca-example]').forEach(button=>button.addEventListener('click',()=>{
  if(busy)return;byId('ca-facts').value=button.dataset.caExample||'';
  byId('ca-facts').dispatchEvent(new Event('input',{bubbles:true}));byId('ca-facts').focus();
 }));
 byId('ca-copy').addEventListener('click',async()=>{
  if(!report)return;try{await navigator.clipboard.writeText(reportText(report));error('Analysis copied.');}
  catch{error('Copy unavailable. Save TXT ব্যবহার করুন।');}
 });
 byId('ca-save').addEventListener('click',()=>{
  if(!report)return;const file=new Blob([reportText(report)],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(file),a=document.createElement('a');
  a.href=url;a.download='lexglobal-case-analysis.txt';a.click();URL.revokeObjectURL(url);
 });
}
