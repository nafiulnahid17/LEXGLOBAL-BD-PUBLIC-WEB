// Shared browser/Worker catalog. Entries identify draft *types*, not filing-ready templates.
export const DRAFT_CATEGORIES = [
  {
    "id": "general",
    "en": "Applications & Notices",
    "bn": "আবেদন ও নোটিশ",
    "icon": "file",
    "note": "সাধারণ আবেদন, নোটিশ ও বিবৃতি"
  },
  {
    "id": "criminal",
    "en": "Criminal Law",
    "bn": "ফৌজদারি আইন",
    "icon": "shield",
    "note": "অভিযোগ, জামিন ও ফৌজদারি আবেদন"
  },
  {
    "id": "civil",
    "en": "Civil Law",
    "bn": "দেওয়ানি আইন",
    "icon": "scale",
    "note": "আরজি, জবাব ও দেওয়ানি প্রতিকার"
  },
  {
    "id": "family",
    "en": "Family Law",
    "bn": "পারিবারিক আইন",
    "icon": "heart",
    "note": "বিবাহ, ভরণপোষণ, হেফাজত"
  },
  {
    "id": "property",
    "en": "Land & Property",
    "bn": "ভূমি ও সম্পত্তি",
    "icon": "home",
    "note": "দলিল, চুক্তি ও ভূমি আবেদন"
  },
  {
    "id": "business",
    "en": "Business & Corporate",
    "bn": "ব্যবসা ও করপোরেট",
    "icon": "briefcase",
    "note": "চুক্তি, শেয়ার ও গোপনীয়তা"
  },
  {
    "id": "employment",
    "en": "Employment & Consumer",
    "bn": "চাকরি ও ভোক্তা",
    "icon": "users",
    "note": "চাকরির দলিল, বকেয়া, অভিযোগ"
  },
  {
    "id": "higher",
    "en": "Constitutional & Higher Courts",
    "bn": "উচ্চ আদালত ও সাংবিধানিক",
    "icon": "gavel",
    "note": "উচ্চ আদালতের পেশাদার খসড়া"
  },
  {
    "id": "settlement",
    "en": "Settlement & Other",
    "bn": "মীমাংসা ও অন্যান্য",
    "icon": "handshake",
    "note": "মধ্যস্থতা, সালিশ ও আপস"
  }
];
export const DRAFT_TYPES = [
  {
    "id": "legal-notice",
    "en": "Legal Notice",
    "bn": "আইনি নোটিশ",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "general-application",
    "en": "General Application",
    "bn": "সাধারণ আবেদন",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "gd-application",
    "en": "GD Application",
    "bn": "সাধারণ ডায়েরির আবেদন",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "complaint-letter",
    "en": "Complaint Letter",
    "bn": "অভিযোগপত্র",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "demand-notice",
    "en": "Demand Notice",
    "bn": "দাবির নোটিশ",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "affidavit",
    "en": "Affidavit",
    "bn": "হলফনামা",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "undertaking",
    "en": "Undertaking",
    "bn": "অঙ্গীকারনামা",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "right-to-information",
    "en": "Right to Information Application",
    "bn": "তথ্য অধিকার আবেদন",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "certificate-application",
    "en": "Certificate Application",
    "bn": "প্রত্যয়নপত্রের আবেদন",
    "category": "general",
    "profile": "standard",
    "review": false
  },
  {
    "id": "criminal-complaint",
    "en": "Criminal Complaint",
    "bn": "ফৌজদারি অভিযোগ",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "bail-petition",
    "en": "Bail Petition",
    "bn": "জামিনের আবেদন",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "anticipatory-bail",
    "en": "Anticipatory Bail Application",
    "bn": "আগাম জামিন আবেদন",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "naraji-petition",
    "en": "Naraji Petition",
    "bn": "নারাজি আবেদন",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "discharge-petition",
    "en": "Discharge Petition",
    "bn": "অব্যাহতির আবেদন",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "criminal-appeal",
    "en": "Criminal Appeal",
    "bn": "ফৌজদারি আপিল",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "criminal-revision",
    "en": "Criminal Revision",
    "bn": "ফৌজদারি রিভিশন",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "cheque-dishonour",
    "en": "Cheque Dishonour Notice",
    "bn": "চেক ডিজঅনার নোটিশ",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "cybercrime-complaint",
    "en": "Cybercrime Complaint",
    "bn": "সাইবার অপরাধ অভিযোগ",
    "category": "criminal",
    "profile": "court",
    "review": true
  },
  {
    "id": "civil-plaint",
    "en": "Civil Plaint",
    "bn": "দেওয়ানি আরজি",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "written-statement",
    "en": "Written Statement",
    "bn": "লিখিত জবাব",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "temporary-injunction",
    "en": "Temporary Injunction Application",
    "bn": "অস্থায়ী নিষেধাজ্ঞার আবেদন",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "declaration-suit",
    "en": "Declaratory Suit Draft",
    "bn": "ঘোষণামূলক মোকদ্দমা",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "money-recovery",
    "en": "Money Recovery Plaint",
    "bn": "অর্থ আদায়ের আরজি",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "execution-petition",
    "en": "Execution Petition",
    "bn": "ডিক্রি জারির আবেদন",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "pleading-amendment",
    "en": "Pleading Amendment",
    "bn": "আরজি বা জবাব সংশোধন",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "case-transfer",
    "en": "Case Transfer Application",
    "bn": "মামলা স্থানান্তরের আবেদন",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "civil-appeal",
    "en": "Civil Appeal",
    "bn": "দেওয়ানি আপিল",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "civil-revision",
    "en": "Civil Revision",
    "bn": "দেওয়ানি রিভিশন",
    "category": "civil",
    "profile": "court",
    "review": true
  },
  {
    "id": "divorce-notice",
    "en": "Divorce Notice",
    "bn": "তালাকের নোটিশ",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "dower-recovery",
    "en": "Dower Recovery",
    "bn": "দেনমোহর আদায়ের আবেদন",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "maintenance-petition",
    "en": "Maintenance Petition",
    "bn": "ভরণপোষণের আবেদন",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "child-custody",
    "en": "Child Custody Application",
    "bn": "সন্তানের হেফাজতের আবেদন",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "guardianship",
    "en": "Guardianship Application",
    "bn": "অভিভাবকত্ব আবেদন",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "restitution-rights",
    "en": "Restitution of Conjugal Rights",
    "bn": "দাম্পত্য অধিকার পুনঃপ্রতিষ্ঠা",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "domestic-violence-protection",
    "en": "Domestic Violence Protection Application",
    "bn": "পারিবারিক সহিংসতা প্রতিরোধ আবেদন",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "family-settlement",
    "en": "Family Settlement Agreement",
    "bn": "পারিবারিক আপস চুক্তি",
    "category": "family",
    "profile": "court",
    "review": true
  },
  {
    "id": "land-sale-deed",
    "en": "Land Sale Deed",
    "bn": "জমি বিক্রয় দলিল",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "gift-deed",
    "en": "Gift / Heba Deed",
    "bn": "হেবা বা দানপত্র",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "partition-deed",
    "en": "Partition Deed",
    "bn": "বণ্টননামা দলিল",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "property-lease",
    "en": "Property Lease Agreement",
    "bn": "ভাড়াচুক্তি",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "mortgage-deed",
    "en": "Mortgage Deed",
    "bn": "বন্ধকী দলিল",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "agreement-for-sale",
    "en": "Agreement for Sale",
    "bn": "বায়নাপত্র",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "property-poa",
    "en": "Property Power of Attorney",
    "bn": "সম্পত্তির পাওয়ার অব অ্যাটর্নি",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "deed-rectification",
    "en": "Deed Rectification",
    "bn": "দলিল সংশোধন",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "mutation-application",
    "en": "Mutation Application",
    "bn": "নামজারি আবেদন",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "possession-notice",
    "en": "Possession Notice",
    "bn": "দখল সংক্রান্ত নোটিশ",
    "category": "property",
    "profile": "deed",
    "review": true
  },
  {
    "id": "business-agreement",
    "en": "Business Agreement",
    "bn": "ব্যবসায়িক চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "partnership-agreement",
    "en": "Partnership Agreement",
    "bn": "অংশীদারত্ব চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "founders-agreement",
    "en": "Founders Agreement",
    "bn": "প্রতিষ্ঠাতা চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "shareholders-agreement",
    "en": "Shareholders Agreement",
    "bn": "শেয়ারহোল্ডার চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "nda",
    "en": "Non-Disclosure Agreement",
    "bn": "গোপনীয়তা চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "memorandum-of-understanding",
    "en": "Memorandum of Understanding",
    "bn": "সমঝোতা স্মারক",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "service-contract",
    "en": "Service Agreement",
    "bn": "সেবা চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "agency-agreement",
    "en": "Agency Agreement",
    "bn": "এজেন্সি চুক্তি",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "authorization-letter",
    "en": "Authorization Letter",
    "bn": "ক্ষমতাপত্র",
    "category": "business",
    "profile": "standard",
    "review": false
  },
  {
    "id": "employment-contract",
    "en": "Employment Contract",
    "bn": "চাকরির চুক্তি",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "appointment-letter",
    "en": "Appointment Letter",
    "bn": "নিয়োগপত্র",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "show-cause-notice",
    "en": "Show Cause Notice",
    "bn": "কারণ দর্শানোর নোটিশ",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "termination-notice",
    "en": "Termination Notice",
    "bn": "চাকরি অবসানের নোটিশ",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "salary-dues-demand",
    "en": "Salary Dues Demand",
    "bn": "বকেয়া বেতনের দাবি",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "consumer-complaint",
    "en": "Consumer Complaint",
    "bn": "ভোক্তা অভিযোগ",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "refund-notice",
    "en": "Refund / Return Notice",
    "bn": "অর্থ ফেরতের নোটিশ",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "workplace-grievance",
    "en": "Workplace Grievance",
    "bn": "কর্মস্থলের অভিযোগ",
    "category": "employment",
    "profile": "standard",
    "review": false
  },
  {
    "id": "writ-petition",
    "en": "Writ Petition",
    "bn": "রিট পিটিশন",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "high-court-review",
    "en": "Review Petition",
    "bn": "রিভিউ আবেদন",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "high-court-revision",
    "en": "High Court Revision",
    "bn": "হাইকোর্ট রিভিশন",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "leave-to-appeal",
    "en": "Leave to Appeal",
    "bn": "লিভ টু আপিল",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "affidavit-in-opposition",
    "en": "Affidavit in Opposition",
    "bn": "আপত্তির হলফনামা",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "pil-petition",
    "en": "Public Interest Litigation",
    "bn": "জনস্বার্থ মামলা",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "higher-court-application",
    "en": "High Court Application",
    "bn": "উচ্চ আদালতের আবেদন",
    "category": "higher",
    "profile": "high-court",
    "review": true
  },
  {
    "id": "settlement-agreement",
    "en": "Settlement Agreement",
    "bn": "আপস চুক্তি",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "mediation-application",
    "en": "Mediation Application",
    "bn": "মধ্যস্থতা আবেদন",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "arbitration-request",
    "en": "Arbitration Request",
    "bn": "সালিশ আবেদন",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "compromise-petition",
    "en": "Compromise Petition",
    "bn": "আপসনামা আবেদন",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "debt-settlement",
    "en": "Debt Settlement",
    "bn": "ঋণ নিষ্পত্তি চুক্তি",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "succession-application",
    "en": "Succession Application",
    "bn": "উত্তরাধিকার সংক্রান্ত আবেদন",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "consent-letter",
    "en": "Consent Letter",
    "bn": "সম্মতিপত্র",
    "category": "settlement",
    "profile": "standard",
    "review": false
  },
  {
    "id": "declaration-letter",
    "en": "Declaration Letter",
    "bn": "ঘোষণাপত্র",
    "category": "settlement",
    "profile": "standard",
    "review": false
  }
];
export const FEATURED_DRAFT_IDS = ["legal-notice","gd-application","civil-plaint","bail-petition","divorce-notice","land-sale-deed","business-agreement","affidavit"];
export const DRAFT_FORMAT_PROFILES = {
  "standard": {
    "page": "A4",
    "marginMm": 25.4,
    "bnFont": "Noto Serif Bengali",
    "enFont": "Times New Roman",
    "bnPt": 14,
    "enPt": 12,
    "spacing": 1.5,
    "note": "Editable recommended default only; no universal statutory font size."
  },
  "court": {
    "page": "A4",
    "marginMm": 25.4,
    "bnFont": "Noto Serif Bengali",
    "enFont": "Times New Roman",
    "bnPt": 14,
    "enPt": 12,
    "spacing": 1.5,
    "note": "Working draft only. Court-specific rules, stamps, annexures, affidavits and margins must be verified."
  },
  "deed": {
    "page": "A4",
    "marginMm": 25.4,
    "bnFont": "Noto Serif Bengali",
    "enFont": "Times New Roman",
    "bnPt": 14,
    "enPt": 12,
    "spacing": 1.5,
    "note": "Preview layout only. Registration requires prescribed deed formats and registrar verification."
  },
  "high-court": {
    "page": "A4",
    "marginMm": 25.4,
    "bnFont": "Noto Serif Bengali",
    "enFont": "Times New Roman",
    "bnPt": 14,
    "enPt": 12,
    "spacing": 1.5,
    "note": "NOT a court filing layout. Relevant High Court Rules may require specific foolscap and margins."
  }
};
export const getDraftType = id => DRAFT_TYPES.find(item=>item.id===id) || null;
