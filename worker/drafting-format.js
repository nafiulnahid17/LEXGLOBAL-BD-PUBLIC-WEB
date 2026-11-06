/* Editable Bangladesh-style draft prototypes; NOT official filing forms. */
const APPS=new Set(['gd-application','general-application','complaint-letter','certificate-application','right-to-information','village-court-application']);
const NOTICES=new Set(['legal-notice','demand-notice']);
export function kindOf(type){
  if(type?.id==='gd-application')return 'gd';
  if(type?.id==='village-court-application')return 'village';
  if(APPS.has(type?.id))return 'application';
  if(NOTICES.has(type?.id))return 'notice';
  if(type?.profile==='deed')return 'deed';
  if(type?.category==='business'||type?.category==='settlement')return 'agreement';
  if(type?.id==='affidavit')return 'affidavit';
  if(type?.profile==='court'||type?.profile==='high-court')return 'court';
  return 'other';
}
export function cleanText(raw){
  const tick=String.fromCharCode(96);
  const cleaned=String(raw||'').replace(/\r\n?/g,'\n')
    .replace(/<think>[\s\S]*?<\/think>/giu,'')
    .replace(new RegExp('^\\s*'+tick+'{3}[^\\n]*$','gm'),'')
    .replace(/\*\*([^*]+)\*\*/gs,'$1').replace(/__([^_]+)__/gs,'$1')
    .replace(/^\s*#{1,6}\s+/gm,'').replace(/^\s*>\s?/gm,'')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/\n{3,}/g,'\n\n').trim();
  const blocks=cleaned.split(/\n\s*\n/);
  const note=/^(?:AI can make mistakes|Disclaimer\b|Important note\b|AI-generated\b|Please (?:verify|consult)\b|দ্রষ্টব্য\s*[:：]|সতর্কতা\s*[:：]|আইনি পরামর্শ নয়)[\s\S]*$/iu;
  while(blocks.length>1&&note.test(blocks[blocks.length-1].trim()))blocks.pop();
  return blocks.join('\n\n').trim();
}
function outputLanguage(data,detect){
  if(data.outputLanguage==='bn'||data.outputLanguage==='en')return data.outputLanguage;
  const detected=detect(String(data.details||''));
  if(detected==='bn'||detected==='bn-Latn'||/[\u0980-\u09FF]/u.test(data.details||''))return 'bn';
  if(/[a-z]/i.test(data.details||''))return 'en';
  return 'other';
}
function field(data,key,lang,placeholder){
  return cleanText(data[key])||placeholder||(lang==='bn'?'[যাচাই প্রয়োজন]':'[To be verified]');
}
function subject(type,data,lang){
  const bn={'gd-application':'সাধারণ ডায়েরিতে ঘটনা লিপিবদ্ধকরণের আবেদন','village-court-application':'গ্রাম আদালতে বিরোধ নিষ্পত্তির আবেদন','complaint-letter':'অভিযোগ বিষয়ে ব্যবস্থা গ্রহণের আবেদন','certificate-application':'প্রত্যয়নপত্র প্রদানের আবেদন','right-to-information':'তথ্য প্রাপ্তির আবেদন','legal-notice':'আইনি নোটিশ','demand-notice':'দাবি নিষ্পত্তির বিষয়ে আইনি নোটিশ'};
  const en={'gd-application':'Request to Record a General Diary (GD)','village-court-application':'Application to the Village Court','complaint-letter':'Application Concerning a Complaint','certificate-application':'Application for a Certificate','right-to-information':'Request for Information','legal-notice':'Legal Notice','demand-notice':'Legal Demand Notice'};
  if(type.id==='general-application')return field(data,'purpose',lang,lang==='bn'?'প্রয়োজনীয় ব্যবস্থা গ্রহণের আবেদন':'Application for Appropriate Action');
  return (lang==='bn'?bn[type.id]:en[type.id])||(lang==='bn'?type.bn:type.en);
}
function narrative(answer,data,lang){
  const draft=cleanText(answer);
  const bad=/^\s*(?:বরাবর|বিষয়\s*[:：]|বিষয়\s*[:：]|মহোদয়|মহোদয়|বিনীত নিবেদক|অতএব|পাঠানো\s+হ|গ্রহণ\s+করা\s+হ|সাধারণ\s+ডায়েরির\s+আবেদন|আইনি\s+নোটিশ|To\s*:|Subject\s*:|Dear\s+Sir|Yours\s+(?:faithfully|sincerely)|Sender\s*:|Receiver\s*:)/imu;
  const meta=/AI can make mistakes|I'm an AI|নমুনা ড্রাফট|Sample Draft\s*:/imu;
  const body=(!draft||draft.length<18||bad.test(draft)||meta.test(draft))?cleanText(data.details):draft;
  if(lang==='bn'&&!/[\u0980-\u09FF]/u.test(body))throw new Error('DRAFT_TRANSLATION_UNVERIFIED');
  if(body.length<15)throw new Error('DRAFT_NARRATIVE_MISSING');
  return body;
}
function letter(type,data,body,lang,notice){
  const gd=type.id==='gd-application',village=type.id==='village-court-application',bn=lang==='bn';
  const sender=field(data,'senderName',lang),address=field(data,'senderAddress',lang),place=field(data,'location',lang),date=field(data,'documentDate',lang);
  const target=field(data,'receiverName',lang,gd?(bn?'[থানার নাম]':'[Police Station]'):village?(bn?'[ইউনিয়ন পরিষদের নাম]':'[Union Parishad Name]'):undefined);
  const targetAddress=field(data,'receiverAddress',lang);
  const title=subject(type,data,lang);
  if(bn){
    if(notice)return ['আইনি নোটিশ','তারিখ: '+date+'\nস্থান: '+place,'প্রেরক: '+sender+'\nঠিকানা: '+address,'প্রাপক: '+target+'\nঠিকানা: '+targetAddress,'বিষয়: '+title+'।',
      'মহোদয়,','আপনার অবগতির জন্য নিম্নবর্ণিত বিষয় উপস্থাপন করা হচ্ছে।','ঘটনার বিবরণ:\n'+body,'উল্লিখিত বিষয়ে উপযুক্ত নিষ্পত্তি ও লিখিত বক্তব্য প্রদানের অনুরোধ জানানো হচ্ছে।',
      'প্রেরক\n'+sender+'\nস্বাক্ষর: __________________'].join('\n\n');
    const role=gd?'অফিসার ইনচার্জ\n':village?'চেয়ারম্যান\n':'';
    const prayer=gd?'অতএব, উল্লিখিত ঘটনাটি সাধারণ ডায়েরিতে লিপিবদ্ধ করে প্রয়োজনীয় আইনানুগ ব্যবস্থা গ্রহণের জন্য বিনীত আবেদন জানাচ্ছি।':
      village?'অতএব, বিষয়টি প্রযোজ্য আইন ও এখতিয়ার যাচাই সাপেক্ষে বিবেচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত আবেদন জানাচ্ছি।':
      'অতএব, বিষয়টি বিবেচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত আবেদন জানাচ্ছি।';
    return ['তারিখ: '+date,'বরাবর\n'+role+target+'\n'+targetAddress,'বিষয়: '+title+'।','মহোদয়,',
      'বিনীত নিবেদন এই যে, নিম্নবর্ণিত ঘটনার বিষয়ে আবেদন পেশ করছি।','ঘটনার বিবরণ:\n'+body,prayer,
      'বিনীত নিবেদক\nনাম: '+sender+'\nঠিকানা: '+address+'\nস্থান: '+place+'\nস্বাক্ষর: __________________'].join('\n\n');
  }
  if(notice)return ['LEGAL NOTICE','Date: '+date+'\nPlace: '+place,'Sender: '+sender+'\nAddress: '+address,'Addressee: '+target+'\nAddress: '+targetAddress,
    'Subject: '+title,'Sir/Madam,','The following facts are brought to your attention:','Statement of facts:\n'+body,
    'A written response or appropriate resolution of the stated matter is requested.','Sender: '+sender+'\nSignature: __________________'].join('\n\n');
  const role=gd?'Officer-in-Charge\n':village?'Chairperson\n':'';
  const request=gd?'I respectfully request that this incident be recorded in the General Diary and appropriate lawful action considered.':
    village?'I respectfully request consideration subject to applicable law and jurisdiction.':
    'I respectfully request consideration and appropriate action regarding the stated matter.';
  return ['Date: '+date,'To\n'+role+target+'\n'+targetAddress,'Subject: '+title,'Sir/Madam,',
    'I respectfully submit the following matter for your consideration.','Statement of facts:\n'+body,request,
    'Yours faithfully,\nName: '+sender+'\nAddress: '+address+'\nPlace: '+place+'\nSignature: __________________'].join('\n\n');
}
export function formatDirective(type){
  const kind=kindOf(type);
  if(['gd','application','village','notice'].includes(kind))return 'NARRATIVE ONLY: Provide 1-3 formal paragraphs with ONLY facts supplied in the incident description. Do not include the title, subject, addressee, greetings, closing, signatures, case numbers, legal sections, fictional dates, markdown or AI warnings. The server assembles the correct document structure. NEVER use pseudo-headings "পাঠানো হয়েছে" or "গ্রহণ করা হয়েছে". Translate Banglish to formal Bangla without inventing facts.';
  if(kind==='court')return 'COURT PLEADING: court/party caption, numbered known facts, prayer, verification/signature placeholders. Do not invent court, suit number, legal sections or jurisdiction.';
  if(kind==='deed')return 'PROPERTY DEED: parties, property schedule, terms, signatures. Never invent dag/khatian, price or registration status; do not use "বরাবর".';
  if(kind==='agreement')return 'AGREEMENT: parties, purpose, agreed terms and signatures; not an application to an authority. Never invent contractual consent or obligations.';
  if(kind==='affidavit')return 'AFFIDAVIT: declarant, numbered facts, signature and attestation placeholders; do not claim notarization or oath occurred.';
  return 'Use conventional document-specific formal drafting, no generic "Sent by" or "Received by" labels, never invent facts.';
}
export function formatDraft(type,data,raw,detect){
  const lang=outputLanguage(data,detect),kind=kindOf(type);
  if(lang==='other')return cleanText(raw);
  if(['gd','application','village','notice'].includes(kind)){
    const facts=narrative(raw,data,lang);
    return letter(type,data,facts,lang,kind==='notice');
  }
  return cleanText(raw);
}
