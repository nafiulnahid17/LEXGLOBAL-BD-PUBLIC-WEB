/**
 * Small verified, editorially-curated source registry.
 * Never let a language model fabricate or supply section numbers/URLs.
 * Selection is preliminary topic matching, NOT a conclusion on applicability.
 */
const LAW_LIBRARY = Object.freeze([
  {
    id:'constitution31',section:'31',unitEn:'Article',unitBn:'অনুচ্ছেদ',
    lawEn:'Constitution of Bangladesh',lawBn:'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান',
    url:'https://bdlaws.minlaw.gov.bd/act-367/act-part-print-200.html',
    bn:'আইনের আশ্রয়লাভ ও আইন অনুযায়ী আচরণ পাওয়ার অধিকার। রাষ্ট্রীয় ব্যবস্থার বিরুদ্ধে নির্দিষ্ট অভিযোগে প্রযোজ্যতা যাচাই করতে হবে।',
    en:'Right to protection of law and treatment according to law; relevance to alleged state action needs assessment.',
    match:/আইনগত সুরক্ষা|আইনের আশ্রয়|আইনবহির্ভূত|আইন বহির্ভূত|বিনা কারণে গ্রেপ্তার|অবৈধ গ্রেপ্তার|fundamental rights|protection of law|due process|unlawful arrest|constitutional right/iu
  },
  {
    id:'constitution33',section:'33',unitEn:'Article',unitBn:'অনুচ্ছেদ',
    lawEn:'Constitution of Bangladesh',lawBn:'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান',
    url:'https://bdlaws.minlaw.gov.bd/act-367/act-part-print-200.html',
    bn:'গ্রেপ্তার ও আটক সম্পর্কে সাংবিধানিক সুরক্ষা; বিশেষ ব্যতিক্রম ও প্রাসঙ্গিক পরিস্থিতি যাচাই আবশ্যক।',
    en:'Constitutional safeguards concerning arrest and detention, subject to the applicable exceptions and circumstances.',
    match:/গ্রেপ্তার|গ্রেফতার|আটক করেছে|আটক করে|বন্দি করেছে|illegal detention|detained|arrested|arrest without|arrested by police|custodial/iu
  },
  {
    id:'crpc154', section:'154', lawEn:'Code of Criminal Procedure, 1898',lawBn:'ফৌজদারি কার্যবিধি, ১৮৯৮',
    url:'https://bdlaws.minlaw.gov.bd/act-75/section-20845.html?lang=en',
    bn:'আমলযোগ্য অপরাধের তথ্য থানার ভারপ্রাপ্ত কর্মকর্তার কাছে প্রদান ও লিখিতভাবে নথিভুক্তির বিধান। অপরাধটি আমলযোগ্য কি না আগে যাচাই করতে হবে।',
    en:'Concerns information about a cognizable offence given to the officer in charge. Whether the alleged offence is cognizable must first be checked.',
    match:/চুরি|ছিনতাই|হামলা|আক্রমণ|মারধর|ধর্ষণ|অপহরণ|অপরাধ|ফৌজদারি|থানায় মামলা|পুলিশ মামলা|stolen|theft|robbery|assault|kidnap|criminal offence|cognizable|churi|maradhor|hamla|opohoron/iu
  },
  {
    id:'evidence65b',section:'65B',lawEn:'Evidence Act, 1872',lawBn:'সাক্ষ্য আইন, ১৮৭২',
    url:'https://bdlaws.minlaw.gov.bd/act-print-24/section-print-51389.html',
    bn:'ডিজিটাল রেকর্ডের প্রমাণমূল্য ও গ্রহণযোগ্যতার শর্ত। শুধু স্ক্রিনশট থাকলেই সব শর্ত পূরণ হয় না।',
    en:'Sets conditions for admissibility of digital records. A screenshot alone does not necessarily satisfy all requirements.',
    match:/স্ক্রিনশট|স্ক্রীনশট|সিসিটিভি|ভিডিও|অডিও|রেকর্ডিং|চ্যাট|হোয়াটসঅ্যাপ|হোয়াটসঅ্যাপ|মেসেঞ্জার|ইমেইল|ই-মেইল|ডিজিটাল প্রমাণ|screenshot|cctv|video|recording|whatsapp|messenger|email|digital evidence|chat log|screeenshot/iu
  },
  {
    id:'contract73',section:'73',lawEn:'Contract Act, 1872',lawBn:'চুক্তি আইন, ১৮৭২',
    url:'https://bdlaws.minlaw.gov.bd/act-print-26/section-print-259.html',
    bn:'চুক্তিভঙ্গের ফলে স্বাভাবিকভাবে সৃষ্ট ক্ষতির ক্ষতিপূরণের সাধারণ নীতি; চুক্তির অস্তিত্ব, ভঙ্গ ও ক্ষতির প্রমাণ প্রয়োজন।',
    en:'General principle for compensation for loss from breach of contract. Contract, breach and resulting loss require proof.',
    match:/চুক্তিভঙ্গ|চুক্তি ভঙ্গ|চুক্তি অনুযায়ী|চুক্তি মোতাবেক|অগ্রিম টাকা|টাকা দিয়ে পণ্য|পণ্য দেয়নি|ফেরত দিচ্ছে না|ফেরত দেয়নি|বকেয়া চুক্তি|breach of contract|contract breach|contractual|advance payment|advance paid|failed to deliver|contract payment|chukti|taka diye|product delivery/iu
  },
  {
    id:'family5',section:'5',lawEn:'Family Courts Act, 2023',lawBn:'পারিবারিক আদালত আইন, ২০২৩',
    url:'https://bdlaws.minlaw.gov.bd/act-details-1444.html?lang=en',
    bn:'বিবাহবিচ্ছেদ, দেনমোহর, ভরণপোষণ এবং সন্তানের অভিভাবকত্ব/তত্ত্বাবধানসহ নির্দিষ্ট পারিবারিক বিষয়ে আদালতের এখতিয়ার।',
    en:'Family court jurisdiction over specified matters including divorce, dower, maintenance and child guardianship/custody.',
    match:/বিবাহবিচ্ছেদ|তালাক|বিচ্ছেদ|দেনমোহর|ভরণপোষণ|সন্তানের হেফাজত|সন্তানের অভিভাবকত্ব|শিশুর হেফাজত|divorce|dower|maintenance|custody|guardianship|talaq|denmohor|vhoronposhon/iu
  },
  {
    id:'limitation3',section:'3',lawEn:'Limitation Act, 1908',lawBn:'তামাদি আইন, ১৯০৮',
    url:'https://bdlaws.minlaw.gov.bd/act-print-88/section-print-6445.html',
    bn:'মামলা, আপিল বা আবেদনের তামাদির মেয়াদ অতিক্রান্ত হওয়ার সাধারণ প্রভাব। নির্দিষ্ট মেয়াদ মামলার ধরন ও প্রযোজ্য বিশেষ আইনের ওপর নির্ভরশীল।',
    en:'General consequence of instituting a suit, appeal or application beyond limitation. The applicable period depends on claim and special law.',
    match:/তামাদি|সময়(সীমা|সীমার)|মেয়াদ পেরিয়ে|মেয়াদ পেরিয়ে|দেরিতে মামলা|পুরোনো মামলা|limitation period|time barred|limitation act|late filing|filed late|appeal deadline|mamla deri/iu
  },
  {
    id:'land54',section:'54',lawEn:'Transfer of Property Act, 1882',lawBn:'সম্পত্তি হস্তান্তর আইন, ১৮৮২',
    url:'https://bdlaws.minlaw.gov.bd/act-48/section-16094.html',
    bn:'স্থাবর সম্পত্তির বিক্রয় ও মালিকানা হস্তান্তরের ধারণা; দলিল, রেজিস্ট্রেশন ও স্বত্বের অবস্থা আলাদাভাবে যাচাই করতে হবে।',
    en:'Defines sale of immovable property. Title, registration, deed and transaction details require separate verification.',
    match:/জমি বিক্রি|জমি ক্রয়|জমি কিনেছি|জমি কেনা|বায়না দলিল|বায়না দলিল|বিক্রয় দলিল|বিক্রয় দলিল|land sale|land purchase|property sale|purchase of land|sale deed|jomi kinsi|jomi bikri/iu
  },
  {
    id:'consumer60',section:'60',lawEn:'Consumer Rights Protection Act, 2009',lawBn:'ভোক্তা-অধিকার সংরক্ষণ আইন, ২০০৯',
    url:'https://dncrp.gov.bd/pages/static-pages/6922de13933eb65569e180a8',
    bn:'অভিযোগ দায়েরের সময়সীমা সম্পর্কে অধিদপ্তরের সরকারি ব্যাখ্যা। তাদের পৃষ্ঠায় ৩০ দিনের কথা আছে; বর্তমান নিয়ম ও গণনার শুরু কর্তৃপক্ষের কাছে যাচাই করুন।',
    en:'Official consumer authority guidance describes a 30-day complaint window under section 60; verify the current rule and start date with the authority.',
    match:/ভোক্তা|ক্রেতা|পণ্য কিনে|পণ্য কিনেছি|অনলাইন শপিং|দোকানদার|বিক্রেতা|অর্ডার দিয়েছি|অর্ডার দিয়েছি|consumer|defective product|online shopping|seller|shopping order|product not delivered|merchant|buyer rights|vokta/iu
  }
]);
export const LAW_REFERENCES=LAW_LIBRARY.map(({match,...row})=>({...row}));
export function candidateLawReferences(facts,followUp='',type=''){
  const text=[facts,followUp,type].filter(v=>typeof v==='string').join(' ');
  return LAW_LIBRARY.filter(x=>x.match.test(text))
    .slice(0,4).map(({match,...source})=>({...source,referenceStatus:'topic_match_not_legal_determination'}));
}
export const LAW_INDEX_URL='https://bdlaws.minlaw.gov.bd/';
export const LEGAL_AID_URL='https://natore.judiciary.gov.bd/bn/menu/page/legal-aid-helpline';
export const EMERGENCY_URL='https://www.police.gov.bd/en/hot_line_number';
