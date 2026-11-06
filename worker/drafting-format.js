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
  const words=(String(data.details||'').toLowerCase().match(/[a-z]+/g)||[]);
  // Short colloquial Banglish often falls below the generic chatbot heuristic.
  // Keep detection conservative so ordinary English remains English.
  const romanBangla=new Set(['ami','amar','amader','tumi','tomar','apni','apnar','korte','korbo','kori','korse','korche','chai','chay','chaitesi','kase','kache','jinish','haraychi','hariye','gese','geche','ase','ache','jomi','dokhol','mamla','thana','shathe','sathe','jonno','eita','eta','ki','kivabe','bujhi','nai','bolen']);
  const matches=words.filter(word=>romanBangla.has(word));
  const distinctive=words.some(word=>['ami','amar','amader','korte','chai','haraychi','jomi','dokhol','bujhi','kase'].includes(word));
  const detected=detect(String(data.details||''));
  if(detected==='bn'||detected==='bn-Latn'||(matches.length>=2&&distinctive)||/[\u0980-\u09FF]/u.test(data.details||''))return 'bn';
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
export function draftTypeMismatch(type,data){
  if(!['legal-notice','demand-notice'].includes(type?.id))return null;
  const recipient=String(data.receiverName||'').toLowerCase();
  const purpose=(String(data.purpose||'')+' '+String(data.details||'')).toLowerCase();
  if(/police\s*(?:station|thana)|\bthana\b|officer.in.charge|থানা|পুলিশ স্টেশন|অফিসার ইনচার্জ/iu.test(recipient)
    ||/\bGD\b|general\s*diary|সাধারণ ডায়েরি|সাধারণ ডায়েরি/iu.test(purpose))
    return {suggestedDraftTypeId:'gd-application',message:'পুলিশ স্টেশনে GD করতে চাইলে “GD Application” নির্বাচন করুন। আইনি নোটিশ ও GD এক নয়।'};
  return null;
}
function unpack(raw) {
  let text=String(raw||'').trim();
  const tick=String.fromCharCode(96);
  if(text.startsWith(tick))text=text.replace(new RegExp('^'+tick+'{3}(?:json)?\\s*','i'),'').replace(new RegExp('\\s*'+tick+'{3}$'),'').trim();
  if(text.startsWith('{')){
    try{
      const obj=JSON.parse(text);
      if(obj&&!Array.isArray(obj)&&typeof obj.narrative==='string')
        return {narrative:obj.narrative,subject:typeof obj.subject==='string'?obj.subject:'',names:obj.names&&typeof obj.names==='object'?obj.names:{}};
    }catch{/* older plain text model supported */}
  }
  return {narrative:text,subject:'',names:{}};
}
function displayField(data,model,key,lang,placeholder){
  const original=cleanText(data[key]);
  if(!original)return placeholder||(lang==='bn'?'[যাচাই প্রয়োজন]':'[To be verified]');
  const suggested=cleanText(model.names?.[key]);
  if(lang==='bn'&&/[a-z]/i.test(original)&&suggested&&suggested.length<=160
    &&/[\u0980-\u09FF]/u.test(suggested)&&!/[a-z]/i.test(suggested))return suggested;
  return original;
}
function specificSubject(type,data,model,lang,notice){
  const generic=/^(?:আইনি নোটিশ|legal notice|আবেদন|application|দাবি|notice)$/iu;
  for(const item of [cleanText(data.purpose),cleanText(model.subject)]){
    if(item.length>9&&!generic.test(item)&&(lang==='bn'?/[\u0980-\u09FF]/u.test(item):! /[\u0980-\u09FF]/u.test(item)))return item;
  }
  return notice?(lang==='bn'?'[নোটিশের নির্দিষ্ট বিষয়]':'[Specific subject of notice]'):subject(type,data,lang);
}
function narrative(answer,data,lang){
  const model=unpack(answer),text=cleanText(model.narrative);
  const bad=/^\s*(?:বরাবর|বিষয়\s*[:：]|বিষয়\s*[:：]|মহোদয়|মহোদয়|বিনীত নিবেদক|অতএব|পাঠানো\s+হ|গ্রহণ\s+করা\s+হ|সাধারণ\s+ডায়েরির\s+আবেদন|আইনি\s+নোটিশ|To\s*:|Subject\s*:|Dear\s+Sir|Yours\s+(?:faithfully|sincerely)|Sender\s*:|Receiver\s*:|LEGAL NOTICE)/imu;
  const meta=/AI can make mistakes|I'm an AI|নমুনা ড্রাফট|Sample Draft\s*:/imu;
  const body=(!text||text.length<18||bad.test(text)||meta.test(text))?cleanText(data.details):text;
  if(lang==='bn'&&!/[\u0980-\u09FF]/u.test(body))throw new Error('DRAFT_TRANSLATION_UNVERIFIED');
  if(lang==='en'&&/[\u0980-\u09FF]/u.test(body))throw new Error('DRAFT_TRANSLATION_UNVERIFIED');
  if(body.length<15)throw new Error('DRAFT_NARRATIVE_MISSING');
  return {body,model};
}
function letter(type,data,parts,lang,notice){
  const bn=lang==='bn',gd=type.id==='gd-application',village=type.id==='village-court-application';
  const sender=displayField(data,parts.model,'senderName',lang),addr=displayField(data,parts.model,'senderAddress',lang);
  const receiver=displayField(data,parts.model,'receiverName',lang,gd?(bn?'[থানার নাম]':'[Police Station]'):village?(bn?'[ইউনিয়ন পরিষদের নাম]':'[Union Parishad Name]'):undefined);
  const recvAddr=displayField(data,parts.model,'receiverAddress',lang),date=field(data,'documentDate',lang);
  const title=specificSubject(type,data,parts.model,lang,notice);
  const addressLine=recvAddr===(bn?'[যাচাই প্রয়োজন]':'[To be verified]')?'':'\n'+recvAddr;
  if(bn){
    if(notice)return [
      type.id==='demand-notice'?'দাবির আইনি নোটিশ':'আইনি নোটিশ',
      'তারিখ: '+date,'প্রাপক: '+receiver+addressLine,'বিষয়: '+title+'।','মহোদয়,',
      'আপনার অবগতির জন্য জানানো যাচ্ছে যে, '+parts.body,
      'উল্লিখিত বিষয়ে প্রয়োজনীয় পদক্ষেপ ও লিখিত জবাব প্রদানের অনুরোধ জানাচ্ছি।',
      'প্রেরক: '+sender+'\nঠিকানা: '+addr+'\nস্বাক্ষর: __________________'
    ].join('\n\n');
    const authority=gd?'অফিসার ইনচার্জ\n':village?'চেয়ারম্যান\n':'';
    const prayer=gd?'অতএব, ঘটনাটি সাধারণ ডায়েরিতে লিপিবদ্ধ করে প্রয়োজনীয় আইনানুগ ব্যবস্থা গ্রহণের জন্য বিনীত আবেদন জানাচ্ছি।':
      village?'অতএব, প্রযোজ্য আইন ও এখতিয়ার যাচাই সাপেক্ষে বিষয়টি বিবেচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত আবেদন জানাচ্ছি।':
      'অতএব, বিষয়টি বিবেচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত আবেদন জানাচ্ছি।';
    return [
      'তারিখ: '+date,'বরাবর\n'+authority+receiver+addressLine,'বিষয়: '+title+'।',
      'মহোদয়,','বিনীত নিবেদন এই যে, '+parts.body,prayer,
      'বিনীত নিবেদক\nনাম: '+sender+'\nঠিকানা: '+addr+'\nস্বাক্ষর: __________________'
    ].join('\n\n');
  }
  if(notice)return [
    'LEGAL NOTICE','Date: '+date,'To: '+receiver+addressLine,'Subject: '+title,
    'Sir/Madam,','Please take notice of the following matter: '+parts.body,
    'You are requested to consider the matter and provide an appropriate written response.',
    'Sincerely,\n'+sender+'\nAddress: '+addr+'\nSignature: __________________'
  ].join('\n\n');
  const authority=gd?'Officer-in-Charge\n':village?'Chairperson\n':'';
  const prayer=gd?'I respectfully request that this incident be entered in the General Diary and appropriate lawful action considered.':
    village?'I respectfully request consideration under the applicable law and jurisdiction.':
    'I respectfully request consideration and appropriate action regarding this matter.';
  return [
    'Date: '+date,'To\n'+authority+receiver+addressLine,'Subject: '+title,
    'Sir/Madam,','I respectfully submit that '+parts.body,prayer,
    'Yours faithfully,\n'+sender+'\nAddress: '+addr+'\nSignature: __________________'
  ].join('\n\n');
}
export function formatDirective(type){
  const kind=kindOf(type);
  if(['gd','application','village','notice'].includes(kind))return 'Return ONLY JSON with keys: narrative (2-4 coherent official-style sentences focused on user-supplied event, where/when if known, real impact and desired remedy), subject (specific short subject from actual incident, not a generic document title), names (optional object with senderName, senderAddress, receiverName, receiverAddress and location transliterated into the draft language without changing identities). This is a single AI call. For Banglish incident, use natural formal Bengali script. Do not invent facts, courts, dates, laws or money. The server supplies headers, parties and signature. No Markdown, no AI disclaimers, no extra chat, no pseudo-headings such as Sent by or Received by. Do not fill sparse facts with irrelevant prose.';
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
    const parts=narrative(raw,data,lang);
    return letter(type,data,parts,lang,kind==='notice');
  }
  return cleanText(raw);
}
