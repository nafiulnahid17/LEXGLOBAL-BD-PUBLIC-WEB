// LexGlobal BD — Public Cloudflare Workers AI frontend.
// Only minimal non-document form fields are sent over same-origin POST; no browser storage.
const ROOT = '/public';
const link = (slug) => `${ROOT}/${slug}`;
const features = [
  {slug:'ai-legal-assistant', title:'AI Legal Assistant', bn:'এআই আইনি সহকারী', group:'ai', icon:'bot', summary:'সহজ ভাষায় আইনি প্রশ্ন ও প্রাথমিক দিকনির্দেশনার workspace।', action:'প্রশ্ন পাঠান', fields:[['question','আপনার সাধারণ প্রশ্ন','textarea','উদাহরণ: ভাড়াটিয়ার অধিকার কী?']], examples:['ভাড়াটিয়ার অধিকার','আইনি নোটিশ','জমি সংক্রান্ত আইন']},
  {slug:'instant-legal-draft', title:'Instant Legal Draft', bn:'আইনি খসড়া তৈরি', group:'ai', icon:'file', summary:'চিঠি, আবেদন ও নোটিশের খসড়া তৈরির জন্য প্রস্তুত ফর্ম।', action:'খসড়া প্রস্তুত করুন', fields:[['document','ডকুমেন্টের ধরন','select','আইনি নোটিশ|আবেদনপত্র|চুক্তিপত্র|অভিযোগ'],['purpose','উদ্দেশ্য','text','সংক্ষেপে উদ্দেশ্য লিখুন'],['details','সাধারণ বর্ণনা','textarea','শুধু নমুনা তথ্য লিখুন']],examples:['আইনি নোটিশ','আবেদনপত্র','চুক্তিপত্র']},
  {slug:'ai-case-analysis', title:'AI Case Analysis', bn:'মামলা বিশ্লেষণ', group:'ai', icon:'scale', summary:'মামলার মূল বিষয় ও পরবর্তী পদক্ষেপের সম্ভাব্য কাঠামো তৈরির workspace।', action:'বিশ্লেষণ শুরু করুন',fields:[['type','মামলার ধরন','select','দেওয়ানি|ফৌজদারি|পারিবারিক|অন্যান্য'],['facts','মামলার সাধারণ ঘটনা','textarea','আসল কেস ডাটা নয়, শুধু নমুনা লিখুন'],['attachment','ডকুমেন্ট নির্বাচন (লোকাল প্রিভিউ)','file','']],examples:['মূল সমস্যা শনাক্ত','আইনি প্রশ্ন','প্রস্তুতির তালিকা']},
  {slug:'smart-land-management', title:'Smart Land Management', bn:'স্মার্ট ভূমি ব্যবস্থাপনা', group:'government',icon:'pin', summary:'খতিয়ান, নামজারি, ভূমি কর এবং জমির তথ্যের সেবা গাইড।',action:'সেবার নির্দেশনা দেখুন',fields:[['service','সেবা নির্বাচন','select','খতিয়ান/পর্চা|নামজারি|ভূমি উন্নয়ন কর|জমি পরিমাপ'],['district','এলাকা (ঐচ্ছিক)','text','জেলা বা উপজেলা']],examples:['খতিয়ান','নামজারি','ভূমি কর']},
  {slug:'smart-vehicle-brta', title:'Smart Vehicle & BRTA Services', bn:'যানবাহন ও বিআরটিএ সেবা',group:'government',icon:'car',summary:'ড্রাইভিং লাইসেন্স, নিবন্ধন ও ফিটনেস সেবার নির্দেশনা।',action:'সেবার নির্দেশনা দেখুন',fields:[['service','BRTA সেবা','select','ড্রাইভিং লাইসেন্স|যানবাহন নিবন্ধন|ফিটনেস|মালিকানা পরিবর্তন']],examples:['লাইসেন্স','নিবন্ধন','ফিটনেস']},
  {slug:'smart-tax-management', title:'Smart Tax Management', bn:'স্মার্ট ট্যাক্স ব্যবস্থাপনা',group:'government',icon:'tax',summary:'ই-টিআইএন, কর রিটার্ন এবং ট্যাক্স নথির গাইড।',action:'ট্যাক্স গাইড দেখুন',fields:[['service','কর সেবা','select','e-TIN|রিটার্ন প্রস্তুতি|কর সংক্রান্ত ডকুমেন্ট|সাধারণ তথ্য']],examples:['e-TIN','রিটার্ন','ডকুমেন্ট']},
  {slug:'passport-assistant', title:'Passport Assistant', bn:'পাসপোর্ট সহকারী',group:'government',icon:'passport',summary:'ই-পাসপোর্ট আবেদন, নবায়ন ও প্রয়োজনীয় কাগজপত্রের নির্দেশনা।',action:'পাসপোর্ট গাইড দেখুন',fields:[['service','পাসপোর্ট সেবা','select','নতুন পাসপোর্ট|নবায়ন|আবেদন ট্র্যাকিং|ডকুমেন্ট চেকলিস্ট']],examples:['নতুন আবেদন','নবায়ন','চেকলিস্ট']},
  {slug:'expat-documentation', title:'Expat & Documentation Help',bn:'প্রবাসী ও ডকুমেন্ট সহায়তা',group:'government',icon:'plane',summary:'ভিসা, প্রবাসী আইনি সহায়তা এবং বিদেশের নথিপত্রের গাইড।',action:'সহায়তার গাইড দেখুন',fields:[['service','সহায়তার ধরন','select','ভিসা ও ডকুমেন্ট|প্রবাসী আইনি সহায়তা|দূতাবাসের তথ্য|বিদেশে কাজ'],['country','দেশ (ঐচ্ছিক)','text','দেশের নাম']],examples:['ভিসা','ডকুমেন্ট','দূতাবাস']},
  {slug:'narisafe',title:'NariSafe — Women’s Safety',bn:'নারী নিরাপত্তা ও সহায়তা',group:'safety',icon:'shield',summary:'নারীর অধিকার, নিরাপত্তা ও সরকারি জরুরি সহায়তা খুঁজুন।',action:'সহায়তার পথ দেখুন',fields:[],examples:['নারীর অধিকার','হয়রানির অভিযোগ','নিরাপত্তা']},
  {slug:'emergency-sos-gesture',title:'Emergency SOS Gesture',bn:'জরুরি SOS Gesture',group:'safety',icon:'siren',summary:'ভবিষ্যৎ gesture-triggered SOS-এর পরিকল্পিত ইন্টারফেস।',action:'জরুরি যোগাযোগ দেখুন',fields:[],examples:['Gesture ফিচার পরীক্ষাধীন','জরুরি কল','সাহায্যের নম্বর']},
  {slug:'emergency-call',title:'Emergency Call',bn:'জরুরি যোগাযোগ',group:'safety',icon:'phone',summary:'সরকারি জরুরি ও আইনি সহায়তার নম্বরে সরাসরি কল করুন।',action:'জরুরি যোগাযোগ দেখুন',fields:[],examples:['৯৯৯ জরুরি সেবা','১৬৬৯৯ আইনি সহায়তা','১০৯ নারী ও শিশু সহায়তা']},
];
const groups = [
  {key:'ai', title:'AI Legal Tools', desc:'প্রশ্ন, খসড়া ও মামলা বিশ্লেষণ'},
  {key:'government',title:'Public Service Guides', desc:'জমি, যানবাহন, কর, পাসপোর্ট ও প্রবাসী'},
  {key:'safety',title:'Safety & Emergency',desc:'নিরাপত্তা, জরুরি নম্বর ও SOS'}
];
const svgPaths = {
  scale:'<path d="M12 3v18M4 7h16M7 7 3 14h8L7 7ZM17 7l-4 7h8l-4-7ZM8 21h8"/>',
  person:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-6 16-6 16 0"/>',
  home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
  arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>',
  left:'<path d="M20 12H4m7-7-7 7 7 7"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  shield:'<path d="M12 2 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6L12 2Z"/><path d="m9 12 2 2 4-4"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  alert:'<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 4h.01"/>',
  sparkle:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
  phone:'<path d="M6 3h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4c0 2-1 3-3 3C10 21 3 14 3 6c0-2 1-3 3-3Z"/>',
  bot:'<rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M9 3h6M8 13h.01M16 13h.01M8 17h8"/>',
  file:'<path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h5M8 13h7M8 17h5"/>',
  pin:'<path d="M12 22s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/>',
  car:'<path d="m5 11 2-6h10l2 6M3 12h18v7H3v-7ZM5 19v2m14-2v2M7 15h.01M17 15h.01"/>',
  tax:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 7h8M8 11h8M8 15h3M15 15h1"/>',
  passport:'<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="11" r="4"/><path d="M8 18h8M8 11h8"/>',
  plane:'<path d="m21 3-7 18-3-8-8-3 18-7ZM11 13l10-10"/>',
  siren:'<path d="M7 17V9a5 5 0 0 1 10 0v8M4 17h16M3 21h18M12 1v2M2 8h2M20 8h2"/>',
  book:'<path d="M12 6c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1ZM12 6v15"/>',
  grid:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v4h16v-4"/>',
  zoom:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6M7 10h6"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1-2 3M12 18h.01"/>',
  external:'<path d="M15 3h6v6M10 14 21 3M21 13v8H3V3h8"/>'
};
function icon(name, size=19) {return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name]||svgPaths.sparkle}</svg>`;}
const brand = (full=false) => `<a href="${ROOT}" class="brand" aria-label="LexGlobal BD Public Dashboard"><span class="brand-emblem">⚖</span><span class="brand-copy"><strong>Lex<span>Global</span> BD</strong>${full ? '<small>AI-POWERED LEGAL ECOSYSTEM</small>':''}</span></a>`;
const badge = (text, tone='gold') => `<span class="badge badge-${tone}">${text}</span>`;
let enlarged=false, menuOpen=false;
// Ephemeral in-tab conversation: no cookies, localStorage or server-side persistence.
const chatMessages=[];
let chatBusy=false;
let chatController=null;
let chatGeneration=0;
const app=document.getElementById('app');

function sidebar() {
 return `<aside class="sidebar ${menuOpen?'mobile-open':''}" aria-label="Public feature navigation"><div class="sidebar-logo">${brand(true)}</div><div class="sidebar-inner"><div class="sidebar-caption">FOR PUBLIC</div>
 <a href="${ROOT}" class="nav-dashboard ${isHome()?'active':''}">${icon('grid',20)}<span>Public Dashboard</span>${icon('chevron',17)}</a>
 ${groups.map(group=>`<div class="nav-group"><div class="nav-group-title">${group.title}</div>${features.filter(f=>f.group===group.key).map(f=>`<a class="nav-feature ${featureSlug()===f.slug?'active':''}" href="${link(f.slug)}">${icon(f.icon)}<span>${f.title}</span></a>`).join('')}</div>`).join('')}
 <div class="sidebar-help">${icon('shield',22)}<strong>আপনার নিরাপত্তা গুরুত্বপূর্ণ</strong><p>এটি UI foundation। এখনই ব্যক্তিগত নথি জমা দেবেন না।</p><a href="tel:999">জরুরি কল ৯৯৯ ${icon('arrow',14)}</a></div>
 </div></aside>`;
}
function featureSlug(){const p=location.pathname.replace(/\/$/,''); return p.startsWith(ROOT+'/')?p.slice(ROOT.length+1):'';}
function currentFeature(){return features.find(f=>f.slug===featureSlug());}
function isHome(){return ['/',ROOT,''].includes(location.pathname.replace(/\/$/,'')||'/');}
function header(){return `<header class="topbar"><div class="topbar-left"><button type="button" class="icon-button menu-trigger" data-menu aria-label="মেনু খুলুন">${icon('menu',22)}</button><div class="topbar-breadcrumb"><span class="small-glow"></span><span>LEXGLOBAL BD</span>${icon('chevron',15)}<strong>For Public</strong></div></div><div class="topbar-actions"><span class="header-status"><span class="status-pulse"></span> Public Web</span><button class="size-button" type="button" data-size aria-label="টেক্সটের আকার পরিবর্তন">${icon('zoom',16)}${enlarged?'A−':'A+'}</button><a class="header-emergency" href="tel:999">${icon('phone',16)} জরুরি ৯৯৯</a></div></header>`;}
function footer(){return `<footer class="footer"><div class="footer-brand"><span class="footer-mark">⚖</span><div><strong>Lex<span>Global</span> BD</strong><small>আইন হোক সহজ, সবার জন্য</small></div></div><div class="footer-links"><a href="${ROOT}">Public Home</a><a href="${link('ai-legal-assistant')}">AI Assistant</a><a href="${link('emergency-call')}">Emergency</a></div><p>© 2026 LexGlobal BD · Atherious Labs</p><small class="footer-disclaimer">AI উত্তরের জন্য যাচাইকৃত সরকারি আইনি উৎস আবশ্যক; সরকারি আবেদন এখানে গ্রহণ করা হয় না।</small></footer>`;}
function dashboard(){return `
 <section class="hero"><div class="hero-visual" role="img" aria-label="স্বর্ণালি ন্যায়বিচারের প্রতীক ও আইন বই"></div><div class="hero-copy">${badge(`${icon('sparkle',14)} BANGLADESH'S SMART LEGAL PLATFORM`)}<h1>আইন হোক সহজ,<br><em>সবার জন্য।</em></h1><p>AI-powered legal support, public service guides and emergency help — সবকিছু এক জায়গায়।</p><div class="hero-buttons"><a class="btn btn-gold" href="#public-features">Explore Public Tools ${icon('arrow',18)}</a><a class="btn btn-outline" href="${link('emergency-call')}">${icon('phone',16)} Emergency Help</a></div><div class="hero-tags"><span>${icon('check',14)} সহজ নেভিগেশন</span><span>${icon('check',14)} বাংলা ও ইংরেজি</span><span>${icon('check',14)} লগইন ছাড়াই</span></div></div></section>
 <div class="intro-strip"><div class="intro-icon">${icon('shield',25)}</div><div><strong>Public Service Foundation</strong><p>১১টি সেবার workflow; সরকারি লেনদেনের জন্য মূল সরকারি পোর্টালের লিংক।</p></div>${badge('UI FOUNDATION','blue')}</div>
 <section class="get-started"><div class="get-icon">${icon('sparkle',27)}</div><div><h2>Get Started with <span>LexGlobal BD</span></h2><p>আপনার প্রয়োজন অনুযায়ী সেবা নির্বাচন করুন।</p></div><a class="btn btn-gold" href="#public-features">Get Started ${icon('arrow',17)}</a></section>
 <section class="features-section" id="public-features"><div class="section-heading"><div><span class="eyebrow">OUR PUBLIC ECOSYSTEM</span><h2>Explore Public Features</h2><p>সহজ, পরিপাটি এবং প্রয়োজন অনুযায়ী সাজানো টুলস।</p></div><span class="feature-count">11 Features</span></div><label class="search-box">${icon('search',20)}<span class="visually-hidden">ফিচার খুঁজুন</span><input id="feature-search" placeholder="Search public features... / সেবা খুঁজুন" autocomplete="off"><span class="search-hint">⌘ K</span></label>
 ${groups.map(g=>`<div class="category" data-group="${g.key}"><div class="category-heading"><div class="category-rule"></div><div><h3>${g.title}</h3><p>${g.desc}</p></div><span class="group-count">${String(features.filter(f=>f.group===g.key).length).padStart(2,'0')}</span></div><div class="feature-grid">${features.filter(f=>f.group===g.key).map(f=>`<a class="feature-card" data-search="${(f.title+' '+f.bn+' '+f.summary).toLocaleLowerCase()}" href="${link(f.slug)}"><div class="feature-image" style="background-image:linear-gradient(to bottom, transparent 18%,rgba(3,14,32,.85) 100%),url('/previews/${f.slug}.webp')"><span class="card-overlay-icon">${icon(f.icon,22)}</span></div><div class="feature-card-body"><h4>${f.title}</h4><p>${f.bn}</p><span class="card-arrow">${icon('arrow',18)}</span></div></a>`).join('')}</div></div>`).join('')}
 <div class="empty-state" id="empty-search" hidden>${icon('search',30)}<h3>কোনো সেবা পাওয়া যায়নি</h3><p>অন্য শব্দ দিয়ে খুঁজুন।</p></div>
 </section>`;}
function formField(field){const [id,label,kind,extra]=field;const safeId=id.replace(/[^a-z]/g,'');let control='';if(kind==='textarea')control=`<textarea id="${safeId}" name="${safeId}" rows="5" maxlength="2500" placeholder="${extra}"></textarea>`;
 else if(kind==='select')control=`<select id="${safeId}" name="${safeId}"><option value="">নির্বাচন করুন</option>${extra.split('|').map(o=>`<option>${o}</option>`).join('')}</select>`;
 else if(kind==='file')control=`<div class="upload-field">${icon('upload',25)}<span id="file-label">শুধু লোকাল ফাইল নির্বাচন — সার্ভারে আপলোড হবে না</span><input id="${safeId}" name="${safeId}" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" aria-label="ফাইল নির্বাচন (আপলোড নয়)"></div>`;
 else control=`<input id="${safeId}" name="${safeId}" maxlength="160" placeholder="${extra}">`;
 return `<div class="field"><label for="${safeId}">${label}</label>${control}</div>`;}
function contacts(f){const women=f.slug==='narisafe';const details=(no,label,subtitle,emergency=false)=>`<a class="contact-card ${emergency?'emergency':''}" href="tel:${no}"><span class="number">${no}</span><span><strong>${label}</strong><small>${subtitle}</small></span>${icon('phone',20)}</a>`;
 return `<div class="safety-contacts"><div class="alert-soft">${icon('alert',20)}<div><strong>জরুরি পরিস্থিতিতে অপেক্ষা করবেন না</strong><p>এই ওয়েবসাইট কোনো জরুরি কল সেন্টার নয়। কল করতে নিচের নম্বর ব্যবহার করুন।</p></div></div><div class="contact-cards">${details('999','জাতীয় জরুরি সেবা','পুলিশ · ফায়ার · অ্যাম্বুলেন্স',true)}${details('16699','সরকারি আইনি সহায়তা','National Legal Aid')}${women?details('109','নারী ও শিশু সহায়তা','সহিংসতা প্রতিরোধ হেল্পলাইন'):''}</div>
 ${f.slug==='emergency-sos-gesture'?`<div class="gesture-message">${icon('lock',20)}<span>Gesture-based SOS এখন সক্রিয় নয়। ফোনের permission, service integration ও নিরাপত্তা যাচাইয়ের পর এটি যোগ করা যাবে।</span></div>`:''}
 <p class="source-line">সূত্র: <a target="_blank" rel="noopener noreferrer" href="https://bangladesh.gov.bd/">Bangladesh National Portal ${icon('external',13)}</a> · <a target="_blank" rel="noopener noreferrer" href="https://nlaso.gov.bd/">National Legal Aid ${icon('external',13)}</a></p></div>`;}
function chatWorkspace(){return `<section class="chat-shell" aria-label="AI Legal Assistant conversation">
  <header class="chat-header"><span class="chat-avatar">${icon('bot',24)}</span><span class="chat-assistant-info"><strong>LexGlobal AI Assistant</strong><small><span class="chat-online-dot"></span> Cloudflare AI · Preview mode</small></span><button id="chat-new" class="chat-reset" type="button" title="বর্তমান কথোপকথন মুছে নতুন চ্যাট" aria-label="New conversation">${icon('sparkle',17)} <span>New Chat</span></button></header>
  <div class="chat-feed" id="chat-feed" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
    <div class="chat-intro" id="chat-intro"><span class="chat-intro-icon">${icon('bot',25)}</span><strong>স্বাগতম! 👋</strong><p>আইন সম্পর্কে সাধারণ প্রশ্ন করুন, অথবা স্বাভাবিকভাবে কথা বলুন।</p><small>এই কথোপকথন শুধু বর্তমান ট্যাবে থাকবে।</small></div>
  </div>
  <div class="chat-bottom"><div class="chat-suggestions" id="chat-suggestions"><button type="button" data-chat-prompt="হ্যালো, কেমন আছো?">👋 হ্যালো</button><button type="button" data-chat-prompt="ভাড়াটিয়ার অধিকার সম্পর্কে সাধারণ তথ্য দাও">🏠 ভাড়াটিয়ার অধিকার</button><button type="button" data-chat-prompt="আইনি নোটিশ কী?">📄 আইনি নোটিশ</button></div>
    <form class="chat-composer" id="chat-form" aria-label="Send a message"><label class="visually-hidden" for="chat-input">আপনার মেসেজ</label><textarea id="chat-input" rows="1" maxlength="950" placeholder="এখানে মেসেজ লিখুন..." enterkeyhint="send" aria-label="আপনার মেসেজ"></textarea><button type="submit" id="chat-send" class="chat-send" aria-label="Send message" title="Send (Enter)">${icon('arrow',21)}</button></form>
    <p class="chat-hint">Enter = Send · Shift + Enter = নতুন লাইন · <span>AI উত্তর যাচাই করুন; ব্যক্তিগত তথ্য লিখবেন না।</span></p>
  </div>
</section>`;}
function featurePage(f){const safety=f.group==='safety';return `<div class="page-back"><a href="${ROOT}">${icon('left',17)} Back to Public Dashboard</a><span><span class="status-dot"></span> PUBLIC TESTING · VERIFY LEGAL DETAILS</span></div>
 <section class="feature-hero ${f.slug==='ai-legal-assistant'?'feature-hero--chat':''}"><div class="feature-hero-copy">${badge(`${icon(f.icon,15)} FOR PUBLIC`,safety?'rose':'gold')}<h1>${f.title}</h1><h2>${f.bn}</h2><p>${f.summary}</p><div class="feature-hero-points"><span>${icon('check',14)} সহজ ব্যবহার</span><span>${icon('check',14)} Responsive UI</span></div></div><img src="/previews/${f.slug}.webp" alt="${f.title} design preview" class="feature-hero-preview"/></section>
 <div class="page-section-title"><div><span class="eyebrow">FEATURE WORKSPACE</span><h2>${safety?'Safety & Support':'Service Workspace'}</h2></div><span class="chip-outline">AI Preview · No Login</span></div>
 <div class="detail-grid"><main class="glass-card main-workspace">${safety ? contacts(f) : f.slug==='ai-legal-assistant' ? chatWorkspace() : `<div class="panel-heading"><span class="panel-icon">${icon(f.icon,23)}</span><div><h3>${f.title}</h3><p>প্রয়োজনীয় তথ্য নির্বাচন বা লিখুন</p></div></div><div class="privacy-banner">${icon('lock',18)}<span>পরীক্ষামূলক AI এখন সাধারণ প্রশ্নের উত্তর দেবে। কোনো ব্যক্তিগত মামলা, NID, পাসপোর্ট বা গোপন তথ্য লিখবেন না। নির্দিষ্ট আইনি তথ্য মূল উৎসে যাচাই করুন।</span></div><form class="service-form" id="service-form">${f.fields.map(formField).join('')}<button type="submit" class="btn btn-gold form-action">${icon('sparkle',18)} ${f.action} ${icon('arrow',18)}</button><div role="status" aria-live="polite" class="submission-note" id="submission-message" hidden></div></form>`}</main>
 <aside class="detail-aside"><div class="glass-card steps-card"><div class="panel-heading"><span class="panel-icon small">${icon('book',21)}</span><div><h3>${safety?'সহায়তার পথ':'কীভাবে ব্যবহার করবেন'}</h3><p>Quick guide</p></div></div><div class="steps-list">${(safety?['প্রয়োজনীয় নম্বর নির্বাচন করুন','মোবাইল থেকে কল করুন','দ্রুত সংশ্লিষ্ট কর্তৃপক্ষের সহায়তা নিন']:['প্রয়োজন অনুযায়ী সেবা নির্বাচন করুন','উদাহরণ বা সাধারণ তথ্য লিখুন','AI Preview উত্তর দেখুন; আইনি তথ্য নিজে যাচাই করুন']).map((s,i)=>`<div><span>0${i+1}</span><p>${s}</p></div>`).join('')}</div></div>
 <div class="glass-card example-card"><div class="panel-heading"><span class="panel-icon small">${icon('help',21)}</span><div><h3>Popular Topics</h3><p>দ্রুত ধারণা নিন</p></div></div><div class="topic-list">${f.examples.map(s=>`<div>${icon('check',15)}${s}</div>`).join('')}</div></div>
 <a class="aside-action" href="${link('emergency-call')}">${icon('phone',20)}<div><strong>জরুরি যোগাযোগ</strong><p>999 · 16699</p></div>${icon('arrow',18)}</a></aside></div>`;}
function notFound(){return `<div class="not-found">${icon('file',45)}<h1>পেজটি পাওয়া যায়নি</h1><p>এটি Public foundation-এর বৈধ রুট নয়।</p><a class="btn btn-gold" href="${ROOT}">Public Dashboard ${icon('arrow',17)}</a></div>`;}
function render(){const f=currentFeature();document.title=f?`${f.title} — LexGlobal BD`:'For Public — LexGlobal BD';app.innerHTML=`<div class="app-shell ${enlarged?'large-text':''}"><a href="#main-content" class="skip-link">সরাসরি মূল অংশে যান</a>${sidebar()}${menuOpen?'<button class="mobile-scrim" type="button" data-close-menu aria-label="মেনু বন্ধ করুন"></button>':''}<div class="content-column">${header()}<div class="content-wrapper" id="main-content">${isHome()?dashboard():f?featurePage(f):notFound()}</div>${footer()}</div></div>`;bindControls();}
function navigate(href){if(href!==location.pathname)cancelChatPending();history.pushState({},'',href);menuOpen=false;render();scrollTo({top:0,behavior:'auto'});}
function bindControls(){
  document.querySelectorAll('a[href^="/public"]').forEach(a=>a.addEventListener('click',e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate(a.getAttribute('href'));}));
  document.querySelector('[data-menu]')?.addEventListener('click',()=>{menuOpen=!menuOpen;render();});
  document.querySelector('[data-close-menu]')?.addEventListener('click',()=>{menuOpen=false;render();});
  document.querySelector('[data-size]')?.addEventListener('click',()=>{enlarged=!enlarged;render();});
  const search=document.getElementById('feature-search'); if(search) search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let visible=0;document.querySelectorAll('.feature-card').forEach(card=>{const shown=card.dataset.search.includes(q);card.hidden=!shown;if(shown)visible++;});document.querySelectorAll('.category').forEach(g=>{const count=g.querySelectorAll('.feature-card:not([hidden])').length;g.hidden=!count;g.querySelector('.group-count').textContent=String(count).padStart(2,'0');});document.getElementById('empty-search').hidden=visible>0;});
  document.getElementById('service-form')?.addEventListener('submit', handleWorkflowSubmit);
  initChatControls();
  const fileInput=document.querySelector('input[type=file]');if(fileInput)fileInput.addEventListener('change',()=>{const label=document.getElementById('file-label');if(label)label.textContent=fileInput.files?.[0]?.name||'কোনো ফাইল নির্বাচন করা হয়নি';});
}
window.addEventListener('popstate',()=>{cancelChatPending();menuOpen=false;render();});
render();

// Never add API tokens or other secrets to site/app.js. Only the backend sees them.
async function handleWorkflowSubmit(event) {
  event.preventDefault();
  const f=currentFeature(), form=event.currentTarget;
  const result=document.getElementById('submission-message');
  const button=form.querySelector('[type=submit]');
  if (!f||!result||!button)return;
  result.hidden=false;
  result.replaceChildren();
  if (form.querySelector('input[type=file]')?.files?.length) {
    writeResult(result,'ফাইল আপলোড এখনো চালু হয়নি।','দয়া করে কোনো ব্যক্তিগত দলিল পাঠাবেন না।',[],false);
    return;
  }
  const values={};
  for (const [key,value] of new FormData(form).entries()) {
    if (typeof value==='string' && value.trim()) values[key]=value.trim();
  }
  if (Object.keys(values).length===0 && f.group==='ai') {
    writeResult(result,'ইনপুট প্রয়োজন','প্রথমে আপনার সাধারণ প্রশ্ন বা বিবরণ লিখুন।',[],false);
    return;
  }
  button.disabled=true;
  const old=button.innerHTML;
  button.textContent='AI উত্তর তৈরি হচ্ছে…';
  let timeout;
  try {
    const controller=new AbortController();
    timeout=setTimeout(()=>controller.abort(),26000);
    const response=await fetch(`/api/workflows/${f.slug}`,{
      method:'POST', headers:{'content-type':'application/json'},
      body:JSON.stringify(values),signal:controller.signal,credentials:'same-origin',cache:'no-store'
    });
    const output=await response.json();
    const title=output.ok?(output.mode==='preview_ai'?'AI পরীক্ষামূলক উত্তর':output.mode==='grounded_ai'?'উৎসসহ AI উত্তর':output.title||'সেবা নির্দেশনা'):'এখন ফলাফল দেওয়া যাচ্ছে না';
    writeResult(result,title,output.answer||output.message||'অনুগ্রহ করে পরে চেষ্টা করুন।',output.sources||[],Boolean(output.ok));
    if (output.disclaimer) addText(result,output.disclaimer,'workflow-disclaimer');
  } catch {
    writeResult(result,'সংযোগে সমস্যা হয়েছে','ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',[],false);
  } finally {
    clearTimeout(timeout);
    button.disabled=false;
    button.innerHTML=old;
  }
}
function addText(parent,value,className='') {
  const el=document.createElement('p');
  if(className)el.className=className;
  el.textContent=String(value);
  parent.append(el);
  return el;
}
function writeResult(parent,title,message,sources,success) {
  parent.replaceChildren();
  parent.classList.toggle('result-success',success);
  const h=document.createElement('strong');h.textContent=title;parent.append(h);
  const p=addText(parent,message,'workflow-answer');p.style.whiteSpace='pre-wrap';
  if (!sources.length) return;
  const heading=document.createElement('h4');heading.textContent='সূত্র / Official Sources';parent.append(heading);
  const list=document.createElement('ul');list.className='workflow-sources';
  for (const source of sources) {
    if (!source.url || !/^https:\/\/[^\s]+$/.test(source.url)) continue;
    const item=document.createElement('li'),anchor=document.createElement('a');
    anchor.href=source.url;anchor.target='_blank';anchor.rel='noopener noreferrer';
    anchor.textContent=source.title||source.url;item.append(anchor);list.append(item);
  }
  parent.append(list);
}

function cancelChatPending(){
  if(chatController){chatGeneration++;chatController.abort();chatController=null;}
  chatBusy=false;
}
function getRecentChatHistory(){
  // Keep actual preceding turns, especially the most recent assistant explanation.
  // Budget UTF-8 bytes so Bangla conversation stays within the Worker request limit.
  const completed=[];
  for(let i=0;i<chatMessages.length-1;i++){
    if(chatMessages[i].role==='user' && chatMessages[i+1].role==='assistant'){
      completed.push({role:'user',content:chatMessages[i].content.slice(0,1100)});
      completed.push({role:'assistant',content:chatMessages[i+1].content.slice(0,1800)});
      i++;
    }
  }
  const recent=completed.slice(-12);
  const encoder=new TextEncoder();
  while(recent.length>2 && encoder.encode(JSON.stringify(recent)).byteLength>12500)recent.splice(0,2);
  return recent;
}
function chatScrollToEnd(){
  const feed=document.getElementById('chat-feed');
  if(feed)feed.scrollTop=feed.scrollHeight;
}
function addChatBubble(message){
  const feed=document.getElementById('chat-feed');
  if(!feed)return;
  const row=document.createElement('div');
  const role=message.role==='user'?'user':message.role==='error'?'error':'assistant';
  row.className=`chat-row chat-row-${role}`;
  const avatar=document.createElement('span');avatar.className='chat-bubble-avatar';
  avatar.innerHTML=icon(role==='user'?'person':role==='error'?'alert':'bot',17);
  const body=document.createElement('div');body.className='chat-bubble-body';
  const bubble=document.createElement('div');bubble.className='chat-bubble';
  bubble.textContent=message.content;
  body.append(bubble);
  if(Array.isArray(message.sources)&&message.sources.length){
    const sources=document.createElement('div');sources.className='chat-sources';
    for(const src of message.sources){
      try {const url=new URL(src.url);if(url.protocol!=='https:')continue;
        const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=src.title||url.hostname;sources.append(a);
      }catch{/* ignore malformed citations */}
    }
    if(sources.children.length)body.append(sources);
  }
  if(message.role==='assistant'&&message.preview){
    const mark=document.createElement('small');mark.className='chat-preview-mark';
    mark.textContent='AI Preview · তথ্য যাচাই করুন';body.append(mark);
  }
  const stamp=document.createElement('small');stamp.className='chat-time';
  stamp.textContent=new Intl.DateTimeFormat('bn-BD',{hour:'2-digit',minute:'2-digit'}).format(new Date(message.at||Date.now()));
  body.append(stamp);
  row.append(avatar,body);feed.append(row);
  message.row=row;
  if(message.incomplete)showChatContinue(message);
  chatScrollToEnd();
}
function showChatTyping(){
  const feed=document.getElementById('chat-feed');if(!feed)return;
  const row=document.createElement('div');row.id='chat-typing';row.className='chat-row chat-row-assistant chat-typing-row';
  row.setAttribute('aria-label','AI উত্তর লিখছে');
  const avatar=document.createElement('span');avatar.className='chat-bubble-avatar';avatar.innerHTML=icon('bot',17);
  const bubble=document.createElement('div');bubble.className='chat-typing-bubble';bubble.innerHTML='<span></span><span></span><span></span>';
  row.append(avatar,bubble);feed.append(row);chatScrollToEnd();
}
function setChatWaiting(waiting){
  const btn=document.getElementById('chat-send');
  const input=document.getElementById('chat-input');
  if(btn){btn.disabled=waiting;btn.setAttribute('aria-busy',String(waiting));}
  if(input){input.disabled=waiting;}
}
function initChatControls(){
  const form=document.getElementById('chat-form');
  if(!form)return;
  const feed=document.getElementById('chat-feed');
  for(const message of chatMessages)addChatBubble(message);
  document.getElementById('chat-intro').hidden=chatMessages.length>0;
  document.getElementById('chat-suggestions').hidden=chatMessages.length>0;
  if(chatBusy)showChatTyping();
  setChatWaiting(chatBusy);
  form.addEventListener('submit',submitChatMessage);
  const input=document.getElementById('chat-input');
  input.addEventListener('keydown',(event)=>{
    if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();form.requestSubmit();}
  });
  input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,130)+'px';});
  document.getElementById('chat-new').addEventListener('click',()=>{
    cancelChatPending();chatMessages.length=0;
    feed.replaceChildren();
    // Reinitialize the welcome and form while staying on this page.
    render();document.getElementById('chat-input')?.focus();
  });
  document.querySelectorAll('[data-chat-prompt]').forEach(b=>b.addEventListener('click',()=>{
    input.value=b.dataset.chatPrompt;input.dispatchEvent(new Event('input'));input.focus();
  }));
  chatScrollToEnd();
}
// A full response requires a terminal [DONE] event. Preserve finish_reason when the model
// explicitly reports hitting the output-token limit; do not silently accept truncated text.
async function consumeAiStream(response,onUpdate){
  if(!response.body)throw new Error('STREAM_UNAVAILABLE');
  const reader=response.body.getReader(),decoder=new TextDecoder();
  let buffer='',assembled='',doneSeen=false,finishReason=null;
  const clean=(value)=>value.replace(/<think>[\s\S]*?<\/think>/gi,'').replace(/<think>[\s\S]*$/gi,'').replace(/\[(?:\d{1,3})\]/g,'').trimStart();
  const apply=(block)=>{
    const data=block.split(/\r?\n/).filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n').trim();
    if(!data)return;
    if(data==='[DONE]'){doneSeen=true;return;}
    let value;
    try {value=JSON.parse(data);}catch{return;}
    if(value?.error)throw new Error('AI_STREAM_ERROR');
    const status=value.choices?.[0]?.finish_reason??value.finish_reason??value.stop_reason;
    if(typeof status==='string'&&status)finishReason=status;
    const delta=value.response??value.choices?.[0]?.delta?.content??value.choices?.[0]?.message?.content??'';
    if(typeof delta!=='string'||!delta)return;
    assembled=delta.startsWith(assembled)?delta:assembled+delta;
    if(assembled.length>8500)throw new Error('STREAM_LIMIT');
    const visible=clean(assembled);
    if(visible)onUpdate(visible);
  };
  try{
    while(!doneSeen){
      const {done,value}=await reader.read();
      if(done)break;
      buffer+=decoder.decode(value,{stream:true}).replace(/\r\n/g,'\n');
      let end;
      while((end=buffer.indexOf('\n\n'))!==-1){
        const block=buffer.slice(0,end);buffer=buffer.slice(end+2);apply(block);
        if(doneSeen)break;
      }
      if(buffer.length>16000)throw new Error('STREAM_LIMIT');
    }
    if(!doneSeen){buffer+=decoder.decode();if(buffer.trim())apply(buffer);}
  }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
  const final=clean(assembled).trim();
  if(!final)throw new Error('EMPTY_AI_STREAM');
  onUpdate(final);
  // When the model does not expose finish_reason, long replies ending without sentence
  // punctuation are treated as possibly cut off. Short greetings need no continuation.
  const abrupt=final.length>90 && !/[.!?।॥…][”"'\])}*]*$/u.test(final);
  const complete=doneSeen && !['length','max_tokens','token_limit'].includes(finishReason) && !(finishReason===null&&abrupt);
  return {text:final,complete,finishReason,doneSeen};
}
function joinChatContinuation(before,addition){
  const tail=before||'',next=(addition||'').trimStart();
  if(!tail)return next;
  if(!next)return tail;
  if(next.startsWith(tail))return next;
  let overlap=0;
  for(let n=Math.min(180,tail.length,next.length);n>3;n--){
    if(tail.slice(-n)===next.slice(0,n)){overlap=n;break;}
  }
  if(overlap)return tail+next.slice(overlap);
  // A one-letter final syllable (e.g. “আপনি ক”) may need the continuation
  // joined directly; otherwise retain natural spacing.
  const dangling=/\s[\u0980-\u09ff]$/u.test(tail);
  const space=/\s$/.test(tail)||/^[,.;!?।\s]/.test(next)||dangling?'': ' ';
  return tail+space+next;
}
function showChatContinue(message){
  const body=message.row?.querySelector('.chat-bubble-body');
  if(!body || body.querySelector('.chat-continue'))return;
  const box=document.createElement('div');box.className='chat-continue';
  const notice=document.createElement('small');notice.textContent='উত্তরটি অসম্পূর্ণ হতে পারে।';
  const button=document.createElement('button');button.type='button';button.textContent='↻ উত্তর চালিয়ে যান';
  button.addEventListener('click',()=>resumeChatAnswer(message));
  box.append(notice,button);body.append(box);
}
function setReplyText(reply,value){
  const bubble=reply.row?.querySelector('.chat-bubble');
  reply.content=value;
  if(bubble)bubble.textContent=value;
  chatScrollToEnd();
}
async function runChatReply(question,history,reply,controller,generation,manual=false){
  let collected=reply?.content||'',complete=false;
  const calls=manual?1:2;
  for(let attempt=0;attempt<calls;attempt++){
    const continuing=manual||attempt>0;
    const before=collected;
    const params={question,history,stream:true};
    if(continuing)params.continuation=before.slice(-2200);
    const response=await fetch('/api/workflows/ai-legal-assistant',{
      method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(params),
      credentials:'same-origin',cache:'no-store',signal:controller.signal
    });
    const write=(value)=>{
      if(generation!==chatGeneration)return;
      document.getElementById('chat-typing')?.remove();
      const merged=continuing?joinChatContinuation(before,value):value;
      if(!reply){
        reply={role:'assistant',content:merged,at:Date.now(),preview:true,sources:[],originalQuestion:question,originalHistory:history,incomplete:false};
        chatMessages.push(reply);addChatBubble(reply);
      }else setReplyText(reply,merged);
    };
    if(response.ok&&response.headers.get('content-type')?.includes('text/event-stream')){
      const info=await consumeAiStream(response,write);
      collected=continuing?joinChatContinuation(before,info.text):info.text;
      complete=info.complete;
    }else{
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.code||'AI_REQUEST_FAILED');
      write(String(data.answer||''));
      collected=reply?.content||'';
      complete=data.incomplete!==true;
    }
    if(generation!==chatGeneration)return reply;
    if(complete)break;
  }
  if(reply){
    reply.incomplete=!complete;
    if(reply.incomplete)showChatContinue(reply);
  }
  return reply;
}
async function resumeChatAnswer(message){
  if(chatBusy || !message.incomplete || chatMessages.at(-1)!==message)return;
  const generation=++chatGeneration, controller=new AbortController();
  chatController=controller;chatBusy=true;setChatWaiting(true);
  const button=message.row?.querySelector('.chat-continue');if(button)button.remove();
  showChatTyping();
  let timeout;
  try{
    timeout=setTimeout(()=>controller.abort(),28000);
    await runChatReply(message.originalQuestion,message.originalHistory,message,controller,generation,true);
  }catch{
    message.incomplete=true;
    showChatContinue(message);
  }finally{
    clearTimeout(timeout);document.getElementById('chat-typing')?.remove();
    if(generation===chatGeneration){chatBusy=false;chatController=null;setChatWaiting(false);}
  }
}
async function submitChatMessage(event){
  event.preventDefault();
  if(chatBusy)return;
  const input=document.getElementById('chat-input');
  const content=input?.value.trim();
  if(!content||content.length>950)return;
  const history=getRecentChatHistory();
  const generation=++chatGeneration;
  const controller=new AbortController();chatController=controller;chatBusy=true;
  const message={role:'user',content,at:Date.now()};
  chatMessages.push(message);addChatBubble(message);
  input.value='';input.style.height='auto';
  document.getElementById('chat-intro')?.setAttribute('hidden','');
  document.getElementById('chat-suggestions')?.setAttribute('hidden','');
  setChatWaiting(true);showChatTyping();
  let timeout;
  try{
    // Two bounded streaming generations can run only if the first is incomplete.
    timeout=setTimeout(()=>controller.abort(),55000);
    await runChatReply(content,history,null,controller,generation);
  }catch(error){
    if(generation!==chatGeneration)return;
    document.getElementById('chat-typing')?.remove();
    const partial=chatMessages.at(-1);
    if(partial?.role==='assistant'){
      partial.incomplete=true;showChatContinue(partial);
    }else{
      const reply={role:'error',content:'সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।',at:Date.now()};
      chatMessages.push(reply);addChatBubble(reply);
    }
  }finally{
    clearTimeout(timeout);
    document.getElementById('chat-typing')?.remove();
    if(generation===chatGeneration){chatBusy=false;chatController=null;setChatWaiting(false);document.getElementById('chat-input')?.focus();}
  }
}
