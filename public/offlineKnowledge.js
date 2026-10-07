// STAGE 14: a large, fixed, pre-written reference used ONLY in Offline mode,
// covering common conditions/emergencies (consolidated from a 270-item list
// into 60 grouped topics, since many of those 270 names are
// duplicates/severity-variants of the same underlying condition).
//
// IMPORTANT — this is NOT an AI. It is a keyword search (English, Hinglish,
// Hindi script) over this fixed list. If the question contains Devanagari
// (Hindi script), the answer is returned in Hindi; otherwise English. NOT a
// replacement for real medical care, NOT a substitute for the real AI chat
// (which needs internet). Other Indian languages beyond Hindi aren't
// supported offline yet.

const OFFLINE_ENTRIES = [
  {
    keywords: ["cpr", "not breathing", "heart stopped", "cardiac arrest", "saans nahi aa rahi", "dil dhadakna band", "dil ruk gaya", "सांस नहीं आ रही", "दिल रुक गया", "कार्डियक अरेस्ट"],
    en: "CPR (adult, basic steps) — OFFLINE REFERENCE, not a substitute for emergency services:\n1. Call for emergency help immediately.\n2. Lay the person flat on a firm surface.\n3. Heel of one hand on center of chest, other hand on top, push hard & fast (100-120/min, 5-6cm deep).\n4. Continue until help arrives or they respond. Hands-only CPR is fine if untrained.",
    hi: "CPR (वयस्क, बेसिक स्टेप्स) — ऑफलाइन रेफरेंस, इमरजेंसी सेवाओं का विकल्प नहीं:\n1. तुरंत इमरजेंसी मदद के लिए कॉल करें।\n2. व्यक्ति को सख्त सतह पर सीधा लिटाएं।\n3. एक हाथ की एड़ी छाती के बीच में रखें, दूसरा हाथ ऊपर, तेज़ और जोर से दबाएं (100-120/मिनट, 5-6 सेमी गहरा)।\n4. मदद आने या व्यक्ति के प्रतिक्रिया देने तक जारी रखें।"
  },
  {
    keywords: ["chest pain", "heart attack", "angina", "cardiac", "dil ka daura", "seene me dard", "chest me dard", "दिल का दौरा", "सीने में दर्द", "एनजाइना"],
    en: "Chest pain / possible heart attack / angina — OFFLINE REFERENCE:\nThis can be a medical emergency. Signs: chest pain/pressure, pain spreading to arm/jaw/back, breathlessness, cold sweat, nausea.\n1. Call emergency services immediately.\n2. Sit them down, stay calm, loosen tight clothing.\n3. Don't give medication that isn't theirs.\n4. Be ready to start CPR if they stop responding/breathing normally.",
    hi: "सीने में दर्द / संभावित हार्ट अटैक / एनजाइना — ऑफलाइन रेफरेंस:\nयह एक मेडिकल इमरजेंसी हो सकती है। लक्षण: सीने में दर्द/दबाव, हाथ/जबड़े/पीठ में फैलता दर्द, सांस फूलना, ठंडा पसीना, जी मिचलाना।\n1. तुरंत इमरजेंसी सेवाओं को कॉल करें।\n2. उन्हें बिठाएं, शांत रहें, तंग कपड़े ढीले करें।\n3. उनकी खुद की दवा के अलावा कोई दवा न दें।\n4. अगर वे प्रतिक्रिया देना बंद कर दें तो CPR शुरू करने के लिए तैयार रहें।"
  },
  {
    keywords: ["stroke", "face drooping", "slurred speech", "tia", "transient ischemic attack", "lakwa", "chehra tedha", "लकवा", "चेहरा टेढ़ा", "स्ट्रोक"],
    en: "Stroke — OFFLINE REFERENCE — use the FAST test:\nF: Face drooping on one side?  A: Arm weakness, can't raise one arm?  S: Speech slurred or strange?  T: Time to call emergency services NOW if any sign is present.\nNote the time symptoms started — this matters for treatment. Do not give food/water. Even brief symptoms (TIA) need urgent medical evaluation.",
    hi: "स्ट्रोक — ऑफलाइन रेफरेंस — FAST टेस्ट इस्तेमाल करें:\nF: चेहरा एक तरफ झुका हुआ? A: एक हाथ कमज़ोर, उठा नहीं पा रहे? S: बोली लड़खड़ा रही है या अजीब है? T: इनमें से कोई भी लक्षण हो तो तुरंत (Time) इमरजेंसी सेवाओं को कॉल करें।\nलक्षण शुरू होने का समय नोट करें — इलाज के लिए यह ज़रूरी है। खाना/पानी न दें।"
  },
  {
    keywords: ["choking", "can't breathe", "something stuck in throat", "airway obstruction", "gale me kuch atak gaya", "gala ruk gaya", "khana gale me phas gaya", "गले में कुछ अटक गया"],
    en: "Choking (conscious adult) — OFFLINE REFERENCE:\n1. Ask \"Are you choking?\" If they can't speak/cough/breathe, act fast.\n2. Give 5 back blows between the shoulder blades.\n3. If that fails, give 5 abdominal thrusts (Heimlich maneuver): stand behind, fist above navel, pull sharply in & up.\n4. Alternate until it clears or they become unresponsive. Call emergency services if it doesn't clear quickly.",
    hi: "दम घुटना (होश में वयस्क) — ऑफलाइन रेफरेंस:\n1. पूछें \"क्या आपका दम घुट रहा है?\" अगर वे बोल/खांस/सांस नहीं ले पा रहे तो तुरंत एक्शन लें।\n2. कंधों के बीच 5 बार पीठ पर ज़ोर से थपकी दें।\n3. अगर काम न करे तो 5 बार पेट पर थ्रस्ट दें (हाइमलिक मैन्युवर): पीछे खड़े होकर, मुट्ठी नाभि के ऊपर, तेज़ी से अंदर-ऊपर खींचें।\n4. जब तक चीज़ न निकले, बारी-बारी करते रहें। जल्दी ठीक न हो तो इमरजेंसी सेवाओं को कॉल करें।"
  },
  {
    keywords: ["asthma attack", "severe asthma", "copd", "shortness of breath", "dyspnea", "wheezing", "breathing difficulty", "dama ka daura", "saans phool rahi", "दमा का दौरा", "सांस फूल रही", "सांस लेने में तकलीफ"],
    en: "Asthma attack / breathing difficulty — OFFLINE REFERENCE:\n1. Help them sit upright, stay calm.\n2. Help them use their prescribed inhaler (usually 4 puffs, spaced out).\n3. Loosen tight clothing, ensure fresh air.\n4. Call emergency services if the inhaler doesn't help in a few minutes, lips/face turn blue, or they can't speak full sentences.",
    hi: "दमे का दौरा / सांस लेने में तकलीफ — ऑफलाइन रेफरेंस:\n1. उन्हें सीधा बिठाएं, शांत रहें।\n2. उनका प्रिस्क्राइब्ड इनहेलर इस्तेमाल करने में मदद करें (आमतौर पर 4 पफ, थोड़े-थोड़े अंतराल पर)।\n3. तंग कपड़े ढीले करें, ताज़ी हवा दें।\n4. अगर कुछ मिनट में इनहेलर से आराम न मिले, होंठ/चेहरा नीला पड़ जाए, या वे पूरा वाक्य न बोल पाएं तो इमरजेंसी सेवाओं को कॉल करें।"
  },
  {
    keywords: ["anaphylaxis", "severe allergic reaction", "allergic breathing reaction", "facial swelling", "tongue swelling", "angioedema", "severe food allergy", "drug allergy", "insect sting allergy", "allergy ho gayi", "gale me soojan", "एलर्जी हो गयी", "गले में सूजन"],
    en: "Severe allergic reaction (anaphylaxis) — OFFLINE REFERENCE:\nSigns: difficulty breathing, swelling of face/throat/tongue, widespread hives, dizziness.\n1. Call emergency services immediately — this can be life-threatening.\n2. If they have a prescribed epinephrine auto-injector, help them use it.\n3. Have them lie flat with legs raised (unless breathing is easier sitting up).\n4. Monitor breathing until help arrives.",
    hi: "गंभीर एलर्जी रिएक्शन (एनाफाइलैक्सिस) — ऑफलाइन रेफरेंस:\nलक्षण: सांस लेने में तकलीफ, चेहरे/गले/जीभ में सूजन, पूरे शरीर पर दाने, चक्कर।\n1. तुरंत इमरजेंसी सेवाओं को कॉल करें — यह जानलेवा हो सकता है।\n2. अगर उनके पास प्रिस्क्राइब्ड एपिनेफ्रिन इंजेक्टर है तो इस्तेमाल करने में मदद करें।\n3. उन्हें पैर ऊपर करके लिटाएं (अगर बैठने में सांस आसान हो तो बैठाएं)।\n4. मदद आने तक सांस पर नज़र रखें।"
  },
  {
    keywords: ["seizure", "status epilepticus", "epilepsy", "fits", "convulsions", "mirgi ka daura", "jhatke aa rahe", "daura pad gaya", "मिर्गी का दौरा", "झटके आ रहे"],
    en: "Seizure — OFFLINE REFERENCE:\n1. Stay calm, time it, clear hard/sharp objects nearby.\n2. Do NOT hold them down or put anything in their mouth.\n3. Once shaking stops, gently turn them onto their side.\n4. Call emergency services if it lasts over 5 minutes, they don't regain consciousness, or another seizure follows immediately.",
    hi: "दौरा (सीज़र) — ऑफलाइन रेफरेंस:\n1. शांत रहें, समय नोट करें, आसपास की सख्त/नुकीली चीज़ें हटाएं।\n2. उन्हें पकड़ कर न रोकें, मुंह में कुछ न डालें।\n3. कंपन रुकने के बाद धीरे से एक तरफ करवट दिलाएं।\n4. अगर 5 मिनट से ज़्यादा चले, होश न आए, या तुरंत दूसरा दौरा आए तो इमरजेंसी सेवाओं को कॉल करें।"
  },
  {
    keywords: ["loss of consciousness", "altered mental status", "sudden confusion", "meningitis", "encephalitis", "stiff neck fever", "behosh ho gaya ulti confusion", "अचानक भ्रम", "मेनिनजाइटिस"],
    en: "Sudden confusion / suspected meningitis — OFFLINE REFERENCE:\nWarning signs: sudden severe confusion, stiff neck, high fever, severe headache, light sensitivity, or unresponsiveness.\n1. Call emergency services immediately — these can indicate a serious brain/spinal infection.\n2. Keep them safe and monitored while waiting for help. Don't give food/drink if very confused.",
    hi: "अचानक भ्रम / संभावित मेनिनजाइटिस — ऑफलाइन रेफरेंस:\nचेतावनी संकेत: अचानक गंभीर भ्रम, गर्दन में अकड़न, तेज़ बुखार, तेज़ सिरदर्द, रोशनी से परेशानी, या बेहोशी।\n1. तुरंत इमरजेंसी सेवाओं को कॉल करें — यह गंभीर संक्रमण का संकेत हो सकता है।\n2. मदद आने तक उन्हें सुरक्षित रखें और नज़र रखें। बहुत भ्रमित हों तो खाना-पानी न दें।"
  },
  {
    keywords: ["brain bleeding", "severe head injury", "concussion", "head injury", "sar me chot", "sar par chot lagi", "सर में चोट", "सिर की चोट"],
    en: "Head injury / concussion — OFFLINE REFERENCE:\n1. Keep them still, apply a cold pack wrapped in cloth to any swelling.\n2. Watch for: repeated vomiting, confusion, unequal pupils, worsening headache, drowsiness, loss of consciousness.\n3. Any of those, or a severe injury — get emergency care immediately. Even mild head injuries should be checked.",
    hi: "सिर की चोट / कंकशन — ऑफलाइन रेफरेंस:\n1. उन्हें स्थिर रखें, सूजन पर कपड़े में लपेटा हुआ ठंडा पैक लगाएं।\n2. इन पर नज़र रखें: बार-बार उल्टी, भ्रम, असमान पुतलियां, बढ़ता सिरदर्द, नींद आना, बेहोशी।\n3. इनमें से कोई भी दिखे तो तुरंत इमरजेंसी देखभाल लें। हल्की चोट भी डॉक्टर को दिखानी चाहिए।"
  },
  {
    keywords: ["spinal cord injury", "suspected spinal injury", "neck injury", "रीढ़ की चोट", "गर्दन की चोट"],
    en: "Suspected spinal/neck injury — OFFLINE REFERENCE:\n1. Do NOT move the person unless there's immediate danger (fire, traffic).\n2. Keep their head, neck, and back still — support in the position found.\n3. Call emergency services immediately and wait for trained help to move them safely.",
    hi: "संभावित रीढ़/गर्दन की चोट — ऑफलाइन रेफरेंस:\n1. व्यक्ति को तब तक न हिलाएं जब तक तुरंत खतरा न हो (आग, ट्रैफिक)।\n2. सिर, गर्दन और पीठ को स्थिर रखें — जिस स्थिति में हैं उसी में सहारा दें।\n3. तुरंत इमरजेंसी सेवाओं को कॉल करें और प्रशिक्षित मदद का इंतज़ार करें।"
  },
  {
    keywords: ["major trauma", "road traffic accident", "fall injury", "workplace accident", "sports injury", "crush injury", "accident", "एक्सीडेंट", "दुर्घटना"],
    en: "Major accident / trauma — OFFLINE REFERENCE:\n1. Call emergency services first.\n2. Don't move the person unless in immediate danger (possible spinal injury).\n3. Control any major bleeding with firm pressure.\n4. Keep them warm and still, reassure them, monitor breathing until help arrives.",
    hi: "बड़ी दुर्घटना / चोट — ऑफलाइन रेफरेंस:\n1. पहले इमरजेंसी सेवाओं को कॉल करें।\n2. तुरंत खतरा न हो तो व्यक्ति को न हिलाएं (रीढ़ की चोट हो सकती है)।\n3. ज़्यादा खून बहने पर मज़बूती से दबाव डालें।\n4. उन्हें गर्म और स्थिर रखें, ढांढस बंधाएं, सांस पर नज़र रखें।"
  },
  {
    keywords: ["anaphylactic shock", "shock", "septic shock", "severe low blood pressure", "hypertensive crisis", "झटका लगना", "शॉक"],
    en: "Shock / severe low blood pressure — OFFLINE REFERENCE:\nSigns: pale cold clammy skin, rapid weak pulse, confusion, weakness.\n1. Call emergency services.\n2. Lay them flat, raise legs slightly (unless injury prevents it).\n3. Keep them warm, loosen tight clothing, don't give food/drink. Monitor breathing closely.",
    hi: "शॉक / गंभीर लो ब्लड प्रेशर — ऑफलाइन रेफरेंस:\nलक्षण: पीली ठंडी चिपचिपी त्वचा, तेज़ कमज़ोर नब्ज़, भ्रम, कमज़ोरी।\n1. इमरजेंसी सेवाओं को कॉल करें।\n2. उन्हें लिटाएं, पैर थोड़े ऊपर करें (अगर चोट न रोके)।\n3. गर्म रखें, तंग कपड़े ढीले करें, खाना-पानी न दें। सांस पर ध्यान से नज़र रखें।"
  },
  {
    keywords: ["fever", "high fever", "mild fever with chills", "night sweats", "body aches", "mild shivering", "high temperature", "bukhar", "tez bukhar", "बुखार", "तेज़ बुखार"],
    en: "Fever — OFFLINE REFERENCE:\n1. Rest and drink plenty of fluids.\n2. Wear light clothing, keep the room comfortably cool.\n3. A lukewarm sponge bath can help.\n4. Seek medical care for fever above 103°F (39.4°C), or with stiff neck, confusion, breathing trouble, or in a young infant.",
    hi: "बुखार — ऑफलाइन रेफरेंस:\n1. आराम करें और खूब तरल पदार्थ पिएं।\n2. हल्के कपड़े पहनें, कमरा आरामदायक ठंडा रखें।\n3. गुनगुने पानी से स्पंज बाथ राहत दे सकता है।\n4. 103°F (39.4°C) से ज़्यादा बुखार, या गर्दन में अकड़न, भ्रम, सांस की तकलीफ, या छोटे बच्चे में बुखार पर डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["cough", "cold", "common cold", "flu", "influenza", "severe influenza", "acute bronchitis", "croup", "whooping cough", "pertussis", "pneumonia", "copd exacerbation", "khasi", "zukam", "सर्दी", "खांसी", "फ्लू"],
    en: "Cough, cold & flu — OFFLINE REFERENCE:\n1. Rest, drink warm fluids, use steam inhalation for congestion.\n2. Honey and warm water can soothe a sore throat/cough (not for infants under 1 year).\n3. Seek medical care if: breathing becomes difficult, fever is very high, cough brings up blood, symptoms last more than 10 days, or there's chest pain with breathing.",
    hi: "खांसी, सर्दी और फ्लू — ऑफलाइन रेफरेंस:\n1. आराम करें, गर्म तरल पदार्थ पिएं, बंद नाक के लिए भाप लें।\n2. शहद और गुनगुना पानी गले को आराम दे सकता है (1 साल से कम उम्र के बच्चों को न दें)।\n3. अगर सांस लेने में तकलीफ हो, तेज़ बुखार हो, खांसी में खून आए, लक्षण 10 दिन से ज़्यादा रहें, या सांस लेते समय सीने में दर्द हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["sore throat", "hoarse voice", "loss of voice", "gale me kharash", "गले में खराश"],
    en: "Sore throat / hoarse voice — OFFLINE REFERENCE:\n1. Gargle with warm salt water a few times a day.\n2. Drink warm fluids, suck on throat lozenges if available.\n3. Rest your voice.\n4. See a doctor if it lasts more than a week, you have trouble swallowing/breathing, or high fever.",
    hi: "गले में खराश / आवाज़ बैठना — ऑफलाइन रेफरेंस:\n1. दिन में कई बार गुनगुने नमक के पानी से गरारे करें।\n2. गर्म तरल पदार्थ पिएं, उपलब्ध हो तो थ्रोट लोज़ेंज चूसें।\n3. आवाज़ को आराम दें।\n4. अगर एक हफ्ते से ज़्यादा रहे, निगलने/सांस लेने में तकलीफ हो, या तेज़ बुखार हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["vomiting", "nausea", "throwing up", "ulti", "ulti aa rahi", "जी मिचलाना", "उल्टी"],
    en: "Vomiting / nausea — OFFLINE REFERENCE:\n1. Let the stomach settle — avoid food/drink for 15-20 minutes.\n2. Then sip small amounts of water or ORS slowly.\n3. Rest, avoid strong smells and heavy food.\n4. Seek care if: vomiting blood, severe abdominal pain, dehydration signs, or it continues more than a day.",
    hi: "उल्टी / जी मिचलाना — ऑफलाइन रेफरेंस:\n1. पेट को शांत होने दें — 15-20 मिनट तक कुछ न खाएं-पिएं।\n2. फिर धीरे-धीरे थोड़ा पानी या ORS घूंट-घूंट कर पिएं।\n3. आराम करें, तेज़ गंध और भारी खाने से बचें।\n4. अगर खून की उल्टी हो, पेट में तेज़ दर्द हो, डिहाइड्रेशन के लक्षण हों, या एक दिन से ज़्यादा चले तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["vomiting blood", "hematemesis", "black stool", "bloody stool", "gastrointestinal bleeding", "khoon ki ulti", "खून की उल्टी", "काला मल"],
    en: "Vomiting blood or black/bloody stool — OFFLINE REFERENCE:\nThis can signal internal bleeding and needs urgent medical care.\n1. Call emergency services or get to a hospital promptly.\n2. Keep them resting, lying down if weak/dizzy.\n3. Don't give food or drink. Note how much and what it looked like, for the doctor.",
    hi: "खून की उल्टी या काला/खूनी मल — ऑफलाइन रेफरेंस:\nयह शरीर के अंदर खून बहने का संकेत हो सकता है और तुरंत इलाज ज़रूरी है।\n1. इमरजेंसी सेवाओं को कॉल करें या तुरंत अस्पताल जाएं।\n2. उन्हें आराम दें, कमज़ोरी/चक्कर हो तो लिटाएं।\n3. खाना-पानी न दें। डॉक्टर के लिए मात्रा और रंग नोट करें।"
  },
  {
    keywords: ["diarrhea", "loose motion", "food poisoning", "cholera", "mild diarrhea", "dast", "pet kharab", "दस्त", "पेट खराब"],
    en: "Diarrhea / food poisoning — OFFLINE REFERENCE:\n1. Drink plenty of ORS or clean water to avoid dehydration.\n2. Eat light, bland food (rice, banana, toast) once able.\n3. Avoid dairy, oily, spicy food until it settles.\n4. Seek care if: blood in stool, high fever, lasts more than 2 days, or dehydration signs appear.",
    hi: "दस्त / फूड पॉइज़निंग — ऑफलाइन रेफरेंस:\n1. डिहाइड्रेशन से बचने के लिए ORS या साफ पानी खूब पिएं।\n2. खाने लायक हों तो हल्का खाना लें (चावल, केला, टोस्ट)।\n3. ठीक होने तक डेयरी, तैलीय, मसालेदार खाना न लें।\n4. अगर मल में खून, तेज़ बुखार, 2 दिन से ज़्यादा चले, या डिहाइड्रेशन के लक्षण हों तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["dehydration", "dry mouth", "excessive thirst", "oral rehydration", "paani ki kami", "पानी की कमी", "डिहाइड्रेशन"],
    en: "Dehydration — OFFLINE REFERENCE:\nSigns: dry mouth, less urination, dizziness, dark urine, extreme thirst.\n1. Sip ORS or clean water slowly and steadily (not large gulps at once).\n2. Rest in a cool place.\n3. Seek urgent care for: confusion, no urination for 8+ hours, sunken eyes, or extreme weakness.",
    hi: "डिहाइड्रेशन — ऑफलाइन रेफरेंस:\nलक्षण: सूखा मुंह, कम पेशाब, चक्कर, गहरे रंग का पेशाब, बहुत ज़्यादा प्यास।\n1. धीरे-धीरे, लगातार ORS या साफ पानी पिएं (एक साथ बहुत न पिएं)।\n2. ठंडी जगह आराम करें।\n3. भ्रम, 8+ घंटे पेशाब न आना, धंसी आंखें, या बहुत कमज़ोरी हो तो तुरंत डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["constipation", "mild constipation", "कब्ज़"],
    en: "Constipation — OFFLINE REFERENCE:\n1. Drink more water, eat more fibre (fruits, vegetables, whole grains).\n2. Light physical activity can help.\n3. Seek medical advice if it lasts over a week, or with severe pain, bleeding, or vomiting.",
    hi: "कब्ज़ — ऑफलाइन रेफरेंस:\n1. ज़्यादा पानी पिएं, फाइबर वाला खाना लें (फल, सब्ज़ियां, साबुत अनाज)।\n2. हल्की शारीरिक गतिविधि मदद कर सकती है।\n3. अगर एक हफ्ते से ज़्यादा रहे, या तेज़ दर्द, खून, या उल्टी हो तो डॉक्टर से सलाह लें।"
  },
  {
    keywords: ["acid reflux", "gerd", "heartburn", "indigestion", "dyspepsia", "gas", "bloating", "एसिडिटी", "सीने में जलन", "गैस"],
    en: "Acid reflux / indigestion / gas — OFFLINE REFERENCE:\n1. Eat smaller meals, avoid lying down right after eating.\n2. Avoid spicy, oily, or very acidic food if it triggers symptoms.\n3. An antacid available over the counter may help occasional symptoms — follow the label.\n4. See a doctor if it's frequent, severe, or comes with chest pain/difficulty swallowing.",
    hi: "एसिडिटी / अपच / गैस — ऑफलाइन रेफरेंस:\n1. कम मात्रा में खाएं, खाने के तुरंत बाद न लेटें।\n2. अगर मसालेदार, तैलीय, या खट्टा खाना तकलीफ दे तो उससे बचें।\n3. कभी-कभार होने पर ओवर-द-काउंटर एंटासिड मदद कर सकता है — लेबल के अनुसार लें।\n4. अगर बार-बार हो, गंभीर हो, या सीने में दर्द/निगलने में तकलीफ के साथ हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["abdominal pain", "severe abdominal pain", "appendicitis", "gallbladder", "gallstones", "pancreatitis", "peritonitis", "bowel obstruction", "severe gastritis", "pet dard", "pet me tez dard", "पेट दर्द", "पेट में तेज़ दर्द"],
    en: "Severe/persistent abdominal pain — OFFLINE REFERENCE:\nThis can sometimes be a surgical emergency (e.g. appendicitis, gallbladder, pancreatitis).\nSeek urgent medical care if pain is: severe, constant, in one spot, with fever, vomiting, a rigid/tender belly, or won't let you move normally. For mild, generalized discomfort — rest, sip fluids, avoid heavy food, and see a doctor if it doesn't improve in a few hours.",
    hi: "गंभीर/लगातार पेट दर्द — ऑफलाइन रेफरेंस:\nयह कभी-कभी सर्जिकल इमरजेंसी हो सकती है (जैसे अपेंडिसाइटिस, गॉलब्लैडर, पैंक्रियाटाइटिस)।\nअगर दर्द तेज़, लगातार, एक जगह पर, बुखार/उल्टी के साथ, पेट सख्त/छूने पर दर्द हो, या सामान्य रूप से हिलने न दे तो तुरंत डॉक्टर को दिखाएं। हल्की, सामान्य तकलीफ के लिए — आराम करें, तरल पदार्थ लें, भारी खाना न लें, कुछ घंटों में ठीक न हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["bleeding", "severe bleeding", "hemorrhage", "cut", "wound", "blood", "deep cut", "laceration", "puncture wound", "open wound", "minor bleeding", "persistent minor bleeding", "khoon beh raha", "khoon aa raha", "chot lag gayi", "खून बह रहा", "चोट लग गयी"],
    en: "Bleeding control — OFFLINE REFERENCE:\n1. Wash hands or wear gloves if available.\n2. Apply firm, direct pressure with a clean cloth for 10-15 minutes continuously.\n3. Raise the injured area above heart level if possible.\n4. Once slowed, cover with a clean dressing, bandage firmly (not so tight it cuts circulation).\nSeek medical help for deep, large, or spurting wounds, or bleeding that won't stop.",
    hi: "खून बहना रोकना — ऑफलाइन रेफरेंस:\n1. हाथ धोएं या उपलब्ध हो तो दस्ताने पहनें।\n2. साफ कपड़े से 10-15 मिनट तक लगातार मज़बूती से दबाव डालें।\n3. संभव हो तो चोट वाले हिस्से को दिल के स्तर से ऊपर उठाएं।\n4. खून कम होने पर साफ पट्टी से मज़बूती से बांधें (इतनी तंग न हो कि खून का बहाव रुक जाए)।\nगहरे, बड़े, या तेज़ी से बहने वाले घाव के लिए डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["nosebleed", "nose bleeding", "epistaxis", "naak se khoon", "नाक से खून"],
    en: "Nosebleed — OFFLINE REFERENCE:\n1. Sit upright, lean slightly forward (not back).\n2. Pinch the soft part of the nose firmly for 10-15 minutes without letting go.\n3. Breathe through the mouth.\n4. Seek care if it doesn't stop after 20 minutes, is very heavy, or follows a head injury.",
    hi: "नाक से खून — ऑफलाइन रेफरेंस:\n1. सीधे बैठें, थोड़ा आगे झुकें (पीछे नहीं)।\n2. नाक के नरम हिस्से को 10-15 मिनट तक मज़बूती से दबाए रखें।\n3. मुंह से सांस लें।\n4. अगर 20 मिनट में न रुके, बहुत ज़्यादा हो, या सिर की चोट के बाद हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["bruise", "contusion", "swelling after injury", "pain after injury", "सूजन", "चोट के बाद दर्द"],
    en: "Bruise / swelling after injury — OFFLINE REFERENCE (RICE method):\nRest the area. Ice (wrapped in cloth, 15-20 min at a time). Compression with a soft bandage. Elevate above heart level.\nSee a doctor if swelling/pain is severe, worsening, or doesn't improve in a few days.",
    hi: "चोट के बाद सूजन / नील — ऑफलाइन रेफरेंस (RICE तरीका):\nआराम करें। बर्फ (कपड़े में लपेटकर, 15-20 मिनट)। मुलायम पट्टी से हल्का दबाव। दिल के स्तर से ऊपर उठाएं।\nअगर सूजन/दर्द तेज़ हो, बढ़ रहा हो, या कुछ दिनों में ठीक न हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["sprain", "strain", "mild sprain", "minor strain", "tendon irritation", "sports muscle pull", "tennis elbow", "plantar fasciitis", "dislocation", "moch aa gayi", "मोच आ गयी"],
    en: "Sprain / strain / suspected dislocation — OFFLINE REFERENCE:\nFor sprains/strains, use RICE: Rest, Ice, Compression, Elevation.\nFor a suspected dislocation (joint looks out of place): do NOT try to push it back — support it in the position found, apply a cold pack, and get medical care. Seek care for severe pain, inability to bear weight, or a visibly deformed joint.",
    hi: "मोच / खिंचाव / संभावित डिसलोकेशन — ऑफलाइन रेफरेंस:\nमोच/खिंचाव के लिए RICE अपनाएं: आराम, बर्फ, दबाव पट्टी, ऊंचाई।\nसंभावित डिसलोकेशन (जोड़ अपनी जगह से हटा हुआ दिखे) में उसे वापस धकेलने की कोशिश न करें — जिस स्थिति में है उसे सहारा दें, ठंडा पैक लगाएं, और डॉक्टर को दिखाएं। तेज़ दर्द, वज़न न उठा पाने, या साफ दिखने वाली विकृति में इलाज लें।"
  },
  {
    keywords: ["fracture", "broken bone", "suspected fracture", "haddi toot gayi", "haddi tut gayi", "हड्डी टूट गयी"],
    en: "Suspected fracture — OFFLINE REFERENCE:\n1. Keep the area still — don't try to realign it.\n2. Support it in the position found with a splint if you must move the person.\n3. Apply a cold pack wrapped in cloth to reduce swelling.\n4. Elevate if possible. Get medical/X-ray attention promptly.",
    hi: "संभावित फ्रैक्चर — ऑफलाइन रेफरेंस:\n1. हिस्से को स्थिर रखें — सीधा करने की कोशिश न करें।\n2. हिलाना ज़रूरी हो तो स्प्लिंट से उसी स्थिति में सहारा दें।\n3. सूजन कम करने के लिए कपड़े में लपेटा ठंडा पैक लगाएं।\n4. संभव हो तो ऊपर उठाएं। जल्द ही डॉक्टर/एक्स-रे कराएं।"
  },
  {
    keywords: ["splinter", "minor cut", "small abrasion", "scrape", "skin tear", "minor puncture wound", "kaanta chubh gaya", "कांटा चुभ गया"],
    en: "Minor cuts, scrapes & splinters — OFFLINE REFERENCE:\n1. Clean the area with water and mild soap.\n2. For a splinter: use clean tweezers to pull it out at the angle it entered.\n3. Apply an antiseptic if available, cover with a clean bandage.\n4. Watch for signs of infection (redness, warmth, pus, worsening pain).",
    hi: "छोटे घाव, खरोंच और कांटे — ऑफलाइन रेफरेंस:\n1. जगह को पानी और हल्के साबुन से साफ करें।\n2. कांटे के लिए: साफ चिमटी से उसी दिशा में खींचकर निकालें जिस दिशा से घुसा था।\n3. उपलब्ध हो तो एंटीसेप्टिक लगाएं, साफ पट्टी बांधें।\n4. इन्फेक्शन के लक्षणों (लालिमा, गर्मी, पस, बढ़ता दर्द) पर नज़र रखें।"
  },
  {
    keywords: ["burn", "thermal burn", "scald", "minor thermal burn", "minor scald", "minor kitchen burn", "fire injury", "jal gaya", "jalan ho rahi", "जल गया", "जलन हो रही"],
    en: "Burns (minor, thermal/scald) — OFFLINE REFERENCE:\n1. Cool under cool (not ice-cold) running water for 10-20 minutes.\n2. Remove tight clothing/jewellery near the area before it swells, if safe.\n3. Do NOT apply ice, butter, oil, or toothpaste.\n4. Cover loosely with a clean, non-fluffy cloth. Don't pop blisters.\nSeek medical help for large burns, burns on face/hands/genitals, or charred/white skin.",
    hi: "जलना (मामूली, आग/गर्म चीज़ से) — ऑफलाइन रेफरेंस:\n1. 10-20 मिनट तक ठंडे (बर्फ जैसा ठंडा नहीं) बहते पानी में रखें।\n2. सूजन से पहले आसपास के तंग कपड़े/गहने हटाएं, अगर सुरक्षित हो।\n3. बर्फ, मक्खन, तेल या टूथपेस्ट न लगाएं।\n4. साफ, बिना रोएं वाले कपड़े से ढीला ढकें। फफोले न फोड़ें।\nबड़े जलने, चेहरे/हाथ/गुप्तांग पर जलने, या जली हुई/सफेद त्वचा के लिए डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["chemical burn", "electrical burn", "accidental chemical skin contact", "minor household chemical irritation", "केमिकल बर्न"],
    en: "Chemical or electrical burn — OFFLINE REFERENCE:\n1. For chemical burns: remove contaminated clothing, flush the area with plenty of clean running water for 15-20 minutes.\n2. For electrical burns: ensure the power source is off before touching them, then check breathing.\n3. Cover loosely with a clean cloth. These need medical evaluation even if they look minor — damage can be deeper than it appears.",
    hi: "केमिकल या इलेक्ट्रिकल बर्न — ऑफलाइन रेफरेंस:\n1. केमिकल बर्न: दूषित कपड़े हटाएं, 15-20 मिनट तक खूब साफ बहते पानी से धोएं।\n2. इलेक्ट्रिकल बर्न: छूने से पहले बिजली का स्रोत बंद होना सुनिश्चित करें, फिर सांस जांचें।\n3. साफ कपड़े से ढीला ढकें। मामूली दिखने पर भी डॉक्टर को दिखाएं — अंदरूनी नुकसान ज़्यादा हो सकता है।"
  },
  {
    keywords: ["sunburn", "mild sunburn", "severe sun exposure", "heat rash", "prickly heat", "dhoop se jal gaya", "धूप से जलना"],
    en: "Sunburn / heat rash — OFFLINE REFERENCE:\n1. Get out of the sun, cool the skin with a cool (not cold) compress or shower.\n2. Drink extra water, apply a moisturizing aloe vera gel if available.\n3. Don't pop any blisters. Seek care for widespread blistering, fever, or signs of heatstroke.",
    hi: "धूप से जलना / घमौरियां — ऑफलाइन रेफरेंस:\n1. धूप से हट जाएं, त्वचा को ठंडे (बर्फ जैसे नहीं) पानी से ठंडा करें।\n2. ज़्यादा पानी पिएं, उपलब्ध हो तो एलोवेरा जेल लगाएं।\n3. फफोले न फोड़ें। ज़्यादा फफोले, बुखार, या लू के लक्षण हों तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["snake bite", "snakebite", "saanp ne kaata", "saanp kaata", "सांप ने काटा"],
    en: "Snake bite — OFFLINE REFERENCE:\n1. Keep the person calm and still — movement spreads venom faster.\n2. Keep the bitten limb at or below heart level.\n3. Remove tight items (rings, watches) near the bite before swelling starts.\n4. Do NOT cut the wound, suck out venom, apply ice, or use a tight tourniquet.\n5. Get to a hospital fast — antivenom is the real treatment.",
    hi: "सांप का काटना — ऑफलाइन रेफरेंस:\n1. व्यक्ति को शांत और स्थिर रखें — हिलने से ज़हर तेज़ी से फैलता है।\n2. काटे गए अंग को दिल के स्तर पर या नीचे रखें।\n3. सूजन से पहले अंगूठी/घड़ी जैसी तंग चीज़ें हटाएं।\n4. घाव को काटें नहीं, ज़हर चूसें नहीं, बर्फ न लगाएं, तंग पट्टी न बांधें।\n5. जल्द से जल्द अस्पताल पहुंचें — एंटीवेनम ही असली इलाज है।"
  },
  {
    keywords: ["dog bite", "cat bite", "human bite", "animal bite", "rabies exposure", "kutte ne kaata", "janwar ne kaata", "कुत्ते ने काटा"],
    en: "Animal / human bite — OFFLINE REFERENCE:\n1. Wash the wound thoroughly with soap and running water for several minutes.\n2. Apply antiseptic if available, cover with a clean bandage.\n3. Seek medical care promptly — rabies vaccination may be needed depending on the animal (especially stray/wild animals).\n4. Note details about the animal for the doctor (owned/stray, vaccination status).",
    hi: "जानवर / इंसान का काटना — ऑफलाइन रेफरेंस:\n1. घाव को कई मिनट तक साबुन और बहते पानी से अच्छी तरह धोएं।\n2. उपलब्ध हो तो एंटीसेप्टिक लगाएं, साफ पट्टी बांधें।\n3. तुरंत डॉक्टर को दिखाएं — जानवर के अनुसार रेबीज़ का टीका ज़रूरी हो सकता है (खासकर आवारा/जंगली जानवर)।\n4. डॉक्टर के लिए जानवर की जानकारी नोट करें (पालतू/आवारा, टीकाकरण की स्थिति)।"
  },
  {
    keywords: ["insect bite", "bee sting", "wasp sting", "scorpion sting", "spider bite", "tick bite", "jellyfish sting", "keeda kaat liya", "madhumakkhi ne kaata", "कीड़े ने काटा", "मधुमक्खी ने काटा"],
    en: "Insect bite / sting — OFFLINE REFERENCE:\n1. For bee stings: remove the stinger by scraping sideways (don't pinch/squeeze it).\n2. Wash the area with soap and water, apply a cold pack to reduce swelling and pain.\n3. For scorpion or spider bites, watch closely and seek medical advice — some species are more dangerous.\n4. Seek emergency care for signs of a severe allergic reaction (difficulty breathing, widespread swelling).",
    hi: "कीड़े का काटना / डंक — ऑफलाइन रेफरेंस:\n1. मधुमक्खी के डंक के लिए: डंक को बग़ल से खुरचकर निकालें (दबाएं नहीं)।\n2. जगह को साबुन-पानी से धोएं, सूजन-दर्द कम करने के लिए ठंडा पैक लगाएं।\n3. बिच्छू या मकड़ी के काटने पर ध्यान से नज़र रखें और डॉक्टर से सलाह लें — कुछ प्रजातियां ज़्यादा खतरनाक होती हैं।\n4. गंभीर एलर्जी के लक्षण (सांस में तकलीफ, पूरे शरीर में सूजन) हों तो तुरंत इमरजेंसी देखभाल लें।"
  },
  {
    keywords: ["poisoning", "suspected poisoning", "medication overdose", "chemical exposure", "swallowed poison", "zeher kha liya", "जहर खा लिया"],
    en: "Poisoning / overdose — OFFLINE REFERENCE:\n1. Call emergency services / poison control immediately.\n2. Do NOT induce vomiting unless told to by a medical professional.\n3. If on skin or in eyes, rinse with plenty of water.\n4. Keep the container/packaging to show medical staff.\n5. If unconscious or struggling to breathe, be ready to start CPR.",
    hi: "ज़हर / ओवरडोज़ — ऑफलाइन रेफरेंस:\n1. तुरंत इमरजेंसी सेवाओं / ज़हर नियंत्रण को कॉल करें।\n2. डॉक्टर के कहे बिना उल्टी न कराएं।\n3. त्वचा या आंखों पर लगा हो तो खूब पानी से धोएं।\n4. डॉक्टर को दिखाने के लिए पैकेजिंग रखें।\n5. बेहोश हों या सांस लेने में दिक्कत हो तो CPR के लिए तैयार रहें।"
  },
  {
    keywords: ["smoke inhalation", "dust inhalation", "mild irritation from fumes", "धुआं अंदर जाना"],
    en: "Smoke / fume inhalation — OFFLINE REFERENCE:\n1. Get to fresh air immediately.\n2. Loosen tight clothing, sit upright to help breathing.\n3. Seek medical care for persistent coughing, breathing difficulty, chest pain, confusion, or if they were in a closed smoky room.",
    hi: "धुआं / गैस अंदर जाना — ऑफलाइन रेफरेंस:\n1. तुरंत ताज़ी हवा में जाएं।\n2. तंग कपड़े ढीले करें, सांस लेने में आसानी के लिए सीधे बैठें।\n3. लगातार खांसी, सांस में तकलीफ, सीने में दर्द, भ्रम, या बंद धुएं वाले कमरे में रहने पर डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["low blood sugar", "hypoglycemia", "severe hypoglycemia", "diabetic emergency", "sugar kam ho gaya", "शुगर कम हो गया"],
    en: "Low blood sugar (hypoglycemia) — OFFLINE REFERENCE:\nSigns: shakiness, sweating, confusion, dizziness, irritability.\n1. If conscious & able to swallow: give fast sugar — juice, regular soda, glucose tablets, or candy.\n2. Wait 10-15 min, recheck — repeat if still unwell.\n3. Once better, give a small snack with protein/carbs.\n4. If unconscious — call emergency services immediately, do not give food/drink by mouth.",
    hi: "लो ब्लड शुगर (हाइपोग्लाइसीमिया) — ऑफलाइन रेफरेंस:\nलक्षण: कंपकंपी, पसीना, भ्रम, चक्कर, चिड़चिड़ापन।\n1. होश में हों तो: तुरंत मीठा दें — जूस, सोडा, ग्लूकोज़ टैबलेट, या मिठाई।\n2. 10-15 मिनट बाद दोबारा जांचें — ज़रूरत हो तो दोहराएं।\n3. ठीक होने पर प्रोटीन/कार्ब्स वाला हल्का नाश्ता दें।\n4. बेहोश हों तो तुरंत इमरजेंसी सेवाओं को कॉल करें, मुंह से कुछ न दें।"
  },
  {
    keywords: ["high blood sugar", "hyperglycemia", "diabetic ketoacidosis", "dka", "hyperosmolar hyperglycemic state", "hhs", "शुगर ज़्यादा हो गया"],
    en: "High blood sugar / diabetic emergency — OFFLINE REFERENCE:\nSigns: extreme thirst, frequent urination, confusion, fruity-smelling breath, nausea, weakness.\n1. This can become a serious emergency (DKA/HHS) — seek medical care promptly, especially with confusion or vomiting.\n2. Encourage water if they're able to drink safely.\n3. Don't give insulin unless you know their correct dose/plan.",
    hi: "हाई ब्लड शुगर / डायबिटिक इमरजेंसी — ऑफलाइन रेफरेंस:\nलक्षण: बहुत प्यास, बार-बार पेशाब, भ्रम, फल जैसी सांस, जी मिचलाना, कमज़ोरी।\n1. यह गंभीर इमरजेंसी (DKA/HHS) बन सकती है — खासकर भ्रम या उल्टी के साथ, जल्द डॉक्टर को दिखाएं।\n2. अगर सुरक्षित रूप से पी सकें तो पानी दें।\n3. सही डोज़ पता न हो तो इंसुलिन खुद से न दें।"
  },
  {
    keywords: ["thyroid storm", "adrenal crisis", "electrolyte imbalance", "severe sodium imbalance", "severe potassium imbalance", "थायरॉइड इमरजेंसी"],
    en: "Thyroid/adrenal/electrolyte emergencies — OFFLINE REFERENCE:\nThese are rare but serious (e.g. rapid heartbeat + fever + confusion in a known thyroid condition, or severe weakness/vomiting in someone on steroid medication).\nSeek emergency medical care promptly — these need hospital treatment and lab tests, not home care.",
    hi: "थायरॉइड/एड्रिनल/इलेक्ट्रोलाइट इमरजेंसी — ऑफलाइन रेफरेंस:\nये दुर्लभ पर गंभीर हो सकती हैं (जैसे थायरॉइड की स्थिति में तेज़ धड़कन+बुखार+भ्रम, या स्टेरॉयड दवा लेने वाले में गंभीर कमज़ोरी/उल्टी)।\nजल्द इमरजेंसी देखभाल लें — इन्हें अस्पताल में इलाज और जांच चाहिए, घरेलू देखभाल काफी नहीं।"
  },
  {
    keywords: ["kidney stone", "renal colic", "acute kidney injury", "urinary retention", "severe urinary infection", "pyelonephritis", "blood in urine", "hematuria", "पथरी", "पेशाब में खून"],
    en: "Kidney stone / urinary problem — OFFLINE REFERENCE:\nSigns: severe side/back pain that comes in waves, blood in urine, burning urination, fever.\n1. Drink water if able.\n2. Seek medical care for severe pain, fever with urinary symptoms, or inability to urinate — these need proper evaluation and sometimes urgent treatment.",
    hi: "गुर्दे की पथरी / पेशाब की समस्या — ऑफलाइन रेफरेंस:\nलक्षण: बगल/पीठ में लहरों जैसा तेज़ दर्द, पेशाब में खून, जलन के साथ पेशाब, बुखार।\n1. पी सकें तो पानी पिएं।\n2. तेज़ दर्द, बुखार के साथ पेशाब की समस्या, या पेशाब न आने पर डॉक्टर को दिखाएं — इन्हें सही जांच और कभी-कभी तुरंत इलाज चाहिए।"
  },
  {
    keywords: ["testicular torsion", "अंडकोष में दर्द"],
    en: "Sudden severe testicular pain — OFFLINE REFERENCE:\nSudden, severe pain in one testicle (with or without swelling) can be a time-critical emergency (torsion). Seek emergency medical care immediately — treatment within hours matters.",
    hi: "अचानक तेज़ अंडकोष दर्द — ऑफलाइन रेफरेंस:\nएक अंडकोष में अचानक, तेज़ दर्द (सूजन के साथ या बिना) एक समय-संवेदनशील इमरजेंसी (टॉर्शन) हो सकती है। तुरंत इमरजेंसी देखभाल लें — कुछ ही घंटों में इलाज ज़रूरी है।"
  },
  {
    keywords: ["ectopic pregnancy", "pregnancy severe abdominal pain", "pregnancy heavy bleeding", "गर्भावस्था में तेज़ दर्द", "प्रेगनेंसी में खून बहना"],
    en: "Pregnancy emergency (severe pain or heavy bleeding) — OFFLINE REFERENCE:\nSevere abdominal pain, heavy vaginal bleeding, dizziness, or fainting during pregnancy needs immediate medical attention. Call emergency services or get to a hospital right away — don't wait to see if it improves.",
    hi: "प्रेगनेंसी इमरजेंसी (तेज़ दर्द या ज़्यादा खून बहना) — ऑफलाइन रेफरेंस:\nप्रेगनेंसी के दौरान तेज़ पेट दर्द, ज़्यादा खून बहना, चक्कर, या बेहोशी पर तुरंत डॉक्टर को दिखाना ज़रूरी है। तुरंत इमरजेंसी सेवाओं को कॉल करें या अस्पताल जाएं — सुधार का इंतज़ार न करें।"
  },
  {
    keywords: ["sepsis", "severe infection", "गंभीर संक्रमण", "सेप्सिस"],
    en: "Signs of serious infection (sepsis) — OFFLINE REFERENCE:\nWarning signs: high fever or very low body temperature, fast heartbeat, fast breathing, confusion, extreme drowsiness, or skin that's cold/clammy/mottled.\nThis can be life-threatening — seek emergency medical care immediately if these appear, especially after an infection, wound, or surgery.",
    hi: "गंभीर संक्रमण (सेप्सिस) के लक्षण — ऑफलाइन रेफरेंस:\nचेतावनी संकेत: तेज़ बुखार या बहुत कम शरीर का तापमान, तेज़ धड़कन, तेज़ सांस, भ्रम, बहुत ज़्यादा नींद, या ठंडी/चिपचिपी/धब्बेदार त्वचा।\nयह जानलेवा हो सकता है — खासकर किसी संक्रमण, घाव, या सर्जरी के बाद ये लक्षण दिखें तो तुरंत इमरजेंसी देखभाल लें।"
  },
  {
    keywords: ["dengue", "malaria", "typhoid", "cholera", "covid", "tuberculosis", "measles", "डेंगू", "मलेरिया", "टाइफाइड"],
    en: "Common infectious fevers (dengue, malaria, typhoid, etc.) — OFFLINE REFERENCE:\n1. Rest, stay well-hydrated with ORS/fluids.\n2. Get tested by a doctor/lab — proper diagnosis matters, these need different treatments.\n3. Seek urgent care for: high fever that won't come down, bleeding/bruising (possible dengue warning sign), severe weakness, difficulty breathing, or persistent vomiting.",
    hi: "सामान्य संक्रामक बुखार (डेंगू, मलेरिया, टाइफाइड आदि) — ऑफलाइन रेफरेंस:\n1. आराम करें, ORS/तरल पदार्थों से अच्छी तरह हाइड्रेटेड रहें।\n2. डॉक्टर/लैब से जांच कराएं — सही निदान ज़रूरी है, इनके इलाज अलग-अलग होते हैं।\n3. न उतरने वाला तेज़ बुखार, खून बहना/चकत्ते (डेंगू का चेतावनी संकेत हो सकता है), बहुत कमज़ोरी, सांस की तकलीफ, या लगातार उल्टी में तुरंत डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["heat exhaustion", "heat stroke", "dehydration from heat", "loo lagna", "loo lag gayi", "garmi lag gayi", "लू लग गयी", "गर्मी लग गयी"],
    en: "Heat exhaustion / heatstroke — OFFLINE REFERENCE:\n1. Move to a cool/shaded place immediately.\n2. Loosen clothing, cool the skin with a damp cloth or fan.\n3. Sip water or ORS slowly.\n4. If confusion, very high body temperature, or no sweating occurs — this may be heatstroke: call emergency services right away.",
    hi: "लू लगना / हीटस्ट्रोक — ऑफलाइन रेफरेंस:\n1. तुरंत ठंडी/छायादार जगह पर जाएं।\n2. कपड़े ढीले करें, गीले कपड़े या पंखे से त्वचा ठंडी करें।\n3. धीरे-धीरे पानी या ORS पिएं।\n4. भ्रम, बहुत तेज़ शरीर का तापमान, या पसीना न आना — यह हीटस्ट्रोक हो सकता है: तुरंत इमरजेंसी सेवाओं को कॉल करें।"
  },
  {
    keywords: ["hypothermia", "cold injury", "frostbite", "minor cold exposure", "cold hands feet", "thand lag gayi", "सर्दी लगना"],
    en: "Hypothermia / frostbite — OFFLINE REFERENCE:\n1. Move to a warm, dry place. Remove wet clothing.\n2. Warm gradually with blankets, warm (not hot) drinks if conscious.\n3. For frostbite: don't rub the area; warm gently with body heat, don't use direct high heat.\n4. Seek medical care for confusion, severe shivering that stops suddenly, or numb/white/hard skin.",
    hi: "हाइपोथर्मिया / फ्रॉस्टबाइट — ऑफलाइन रेफरेंस:\n1. गर्म, सूखी जगह पर जाएं। गीले कपड़े हटाएं।\n2. धीरे-धीरे कंबल से गर्म करें, होश में हों तो गुनगुना (गर्म नहीं) पेय दें।\n3. फ्रॉस्टबाइट में जगह को रगड़ें नहीं; शरीर की गर्मी से धीरे गर्म करें, सीधी तेज़ गर्मी न लगाएं।\n4. भ्रम, अचानक रुकती तेज़ कंपकंपी, या सुन्न/सफेद/सख्त त्वचा पर डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["drowning", "near drowning", "doob gaya", "डूब गया"],
    en: "Drowning / near-drowning — OFFLINE REFERENCE:\n1. Get the person out of the water safely (don't put yourself at risk).\n2. Call for emergency help immediately.\n3. Check breathing — start CPR if not breathing.\n4. Even if they seem okay afterward, they need medical evaluation — water in the lungs can cause problems hours later.",
    hi: "डूबना / डूबते-डूबते बचना — ऑफलाइन रेफरेंस:\n1. व्यक्ति को सुरक्षित रूप से पानी से बाहर निकालें (खुद को खतरे में न डालें)।\n2. तुरंत इमरजेंसी मदद के लिए कॉल करें।\n3. सांस जांचें — सांस न आ रही हो तो CPR शुरू करें।\n4. ठीक दिखने पर भी डॉक्टर को दिखाएं — फेफड़ों में पानी घंटों बाद समस्या कर सकता है।"
  },
  {
    keywords: ["electric shock", "electrocution", "lightning strike", "minor electrical contact", "bijli ka jhatka", "current lag gaya", "बिजली का झटका", "करंट लग गया"],
    en: "Electric shock / lightning strike — OFFLINE REFERENCE:\n1. Do NOT touch the person if still in contact with the electrical source — turn off power or move it away with a non-conductive object (dry wood, plastic).\n2. Once safe, check breathing — start CPR if needed and call for emergency help.\n3. Even if they seem fine, they need medical evaluation — internal injuries can be hidden.",
    hi: "बिजली का झटका / आकाशीय बिजली — ऑफलाइन रेफरेंस:\n1. अगर व्यक्ति अभी भी बिजली के स्रोत के संपर्क में है तो उसे न छुएं — बिजली बंद करें या गैर-चालक चीज़ (सूखी लकड़ी, प्लास्टिक) से हटाएं।\n2. सुरक्षित होने पर सांस जांचें — ज़रूरत हो तो CPR शुरू करें और इमरजेंसी मदद बुलाएं।\n3. ठीक दिखने पर भी डॉक्टर को दिखाएं — अंदरूनी चोट छिपी हो सकती है।"
  },
  {
    keywords: ["fainting", "fainted", "unconscious", "passed out", "near-fainting", "dizziness", "lightheadedness", "general weakness", "fatigue", "feeling shaky", "trembling", "sudden sweating", "palpitations", "racing heart", "mild low blood pressure", "severe vertigo", "behosh ho gaya", "chakkar aa raha", "बेहोश हो गया", "चक्कर आ रहा"],
    en: "Fainting / dizziness / weakness — OFFLINE REFERENCE:\n1. Lay the person flat and raise their legs about 12 inches.\n2. Loosen tight clothing around the neck.\n3. Ensure fresh air, avoid crowding them.\n4. They usually recover within a minute — if not, or it keeps happening, or there's chest pain/palpitations, seek medical care.",
    hi: "बेहोशी / चक्कर / कमज़ोरी — ऑफलाइन रेफरेंस:\n1. व्यक्ति को लिटाएं और पैर करीब 12 इंच ऊपर उठाएं।\n2. गर्दन के आसपास के तंग कपड़े ढीले करें।\n3. ताज़ी हवा दें, भीड़ न लगने दें।\n4. आमतौर पर एक मिनट में ठीक हो जाते हैं — अगर नहीं, या बार-बार हो, या सीने में दर्द/धड़कन तेज़ हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["motion sickness", "travel sickness", "यात्रा में उल्टी जैसा महसूस होना"],
    en: "Motion / travel sickness — OFFLINE REFERENCE:\n1. Sit where movement is felt least (front seat of car, over the wing on a plane), look at the horizon.\n2. Fresh air and ginger (tea/candy) can help some people.\n3. Avoid reading or screens while moving.\n4. Over-the-counter motion sickness remedies may help — follow the label.",
    hi: "यात्रा में उल्टी जैसा महसूस होना — ऑफलाइन रेफरेंस:\n1. जहां सबसे कम हलचल महसूस हो वहां बैठें (कार की अगली सीट), क्षितिज की तरफ देखें।\n2. ताज़ी हवा और अदरक (चाय/कैंडी) कुछ लोगों के लिए मददगार होती है।\n3. चलते समय पढ़ने या स्क्रीन देखने से बचें।\n4. ओवर-द-काउंटर मोशन सिकनेस दवा मदद कर सकती है — लेबल के अनुसार लें।"
  },
  {
    keywords: ["eye injury", "foreign body in eye", "eye irritation", "red eye", "conjunctivitis", "itchy eyes", "watery eyes", "eye strain", "digital eye strain", "flashing lights", "eye floaters", "sudden vision changes", "aankh me kuch gir gaya", "आँख में कुछ गिर गया"],
    en: "Eye problems — OFFLINE REFERENCE:\n1. Don't rub the eye.\n2. For something in the eye: rinse gently with clean water for several minutes.\n3. For chemical splash: flush continuously with clean water for 15-20 minutes — this is urgent.\n4. Don't try to remove an embedded object — cover loosely and get medical help.\n5. Sudden vision changes, flashing lights, or lots of new floaters need prompt medical evaluation.",
    hi: "आंखों की समस्याएं — ऑफलाइन रेफरेंस:\n1. आंख को न रगड़ें।\n2. कुछ गिरा हो तो: कई मिनट तक साफ पानी से धीरे धोएं।\n3. केमिकल गिरा हो तो: 15-20 मिनट तक लगातार साफ पानी से धोएं — यह ज़रूरी है।\n4. फंसी हुई चीज़ को निकालने की कोशिश न करें — ढीला ढकें और डॉक्टर को दिखाएं।\n5. अचानक नज़र में बदलाव, चमकती रोशनी, या बहुत सारे नए धब्बे दिखें तो जल्द डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["earache", "blocked ear", "earwax", "tinnitus", "ringing in the ear", "sudden hearing loss", "kaan me dard", "कान में दर्द"],
    en: "Ear problems — OFFLINE REFERENCE:\n1. For mild earache: a warm (not hot) compress against the ear may help.\n2. Don't insert cotton buds or sharp objects into the ear canal.\n3. Sudden hearing loss, severe pain, discharge, or injury needs prompt medical evaluation.",
    hi: "कान की समस्याएं — ऑफलाइन रेफरेंस:\n1. हल्के कान दर्द के लिए: कान पर गुनगुना (गर्म नहीं) सेंक लगाना मदद कर सकता है।\n2. कान में रुई की बड या नुकीली चीज़ न डालें।\n3. अचानक सुनाई देना बंद होना, तेज़ दर्द, पानी/मवाद आना, या चोट पर जल्द डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["nasal congestion", "runny nose", "sneezing", "allergic rhinitis", "sinus congestion", "naak band", "नाक बंद"],
    en: "Nasal congestion / allergies — OFFLINE REFERENCE:\n1. Steam inhalation can help loosen congestion.\n2. Saline nasal rinses/sprays may help clear the nose.\n3. Identify and avoid known allergy triggers where possible.\n4. See a doctor if symptoms are severe, affect sleep/breathing badly, or last a long time.",
    hi: "नाक बंद होना / एलर्जी — ऑफलाइन रेफरेंस:\n1. भाप लेने से बंद नाक खुल सकती है।\n2. सलाइन नेज़ल रिंस/स्प्रे नाक साफ करने में मदद कर सकते हैं।\n3. जहां तक संभव हो, जाने-पहचाने एलर्जी ट्रिगर से बचें।\n4. लक्षण गंभीर हों, नींद/सांस में बाधा डालें, या लंबे समय तक रहें तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["mouth ulcer", "toothache", "tooth injury", "bleeding gums", "loose knocked out tooth", "sore mouth", "sore tongue", "cold sore", "fever blister", "daant dard", "दांत दर्द"],
    en: "Mouth & dental problems — OFFLINE REFERENCE:\n1. Rinse with warm salt water for general mouth discomfort/ulcers.\n2. For toothache: avoid very hot/cold food, see a dentist soon.\n3. For a knocked-out adult tooth: handle it by the crown (not the root), rinse gently if dirty, try to place it back in the socket or keep it in milk, and get to a dentist within 30 minutes if possible.\n4. Significant bleeding, swelling of the face, or fever needs prompt dental/medical care.",
    hi: "मुंह और दांतों की समस्याएं — ऑफलाइन रेफरेंस:\n1. मुंह में तकलीफ/छाले के लिए गुनगुने नमक पानी से कुल्ला करें।\n2. दांत दर्द के लिए: बहुत गर्म/ठंडा खाना न लें, जल्द डेंटिस्ट को दिखाएं।\n3. वयस्क का दांत टूटकर निकल जाए तो: उसे ताज के हिस्से से पकड़ें (जड़ से नहीं), गंदा हो तो हल्के से धोएं, कोशिश करें वापस जगह पर रखें या दूध में रखें, और हो सके तो 30 मिनट में डेंटिस्ट के पास जाएं।\n4. ज़्यादा खून बहना, चेहरे पर सूजन, या बुखार हो तो जल्द डॉक्टर/डेंटिस्ट को दिखाएं।"
  },
  {
    keywords: ["itchy skin", "dry skin", "skin rash", "contact dermatitis", "minor skin allergy", "hives", "urticaria", "acne", "minor skin infection", "boil", "furuncle", "small abscess", "blister", "friction blister", "khujli", "khujli chakatte", "खुजली", "त्वचा पर दाने"],
    en: "Minor skin rash / irritation / blisters — OFFLINE REFERENCE:\n1. Keep the area clean and dry. Avoid scratching.\n2. A cool compress or over-the-counter anti-itch cream may help mild itching.\n3. For a blister: leave it intact if possible, cover with a soft bandage; if it bursts, clean gently and cover.\n4. Seek medical care for rapid spreading, high fever, significant swelling, pus, or signs of a severe allergic reaction.",
    hi: "मामूली त्वचा पर दाने / जलन / फफोले — ऑफलाइन रेफरेंस:\n1. जगह को साफ और सूखा रखें। खुजलाएं नहीं।\n2. हल्की खुजली के लिए ठंडा सेंक या ओवर-द-काउंटर एंटी-इच क्रीम मदद कर सकती है।\n3. फफोले के लिए: हो सके तो न फोड़ें, मुलायम पट्टी से ढकें; फूट जाए तो धीरे साफ कर ढकें।\n4. तेज़ी से फैलना, तेज़ बुखार, ज़्यादा सूजन, पस, या गंभीर एलर्जी के लक्षण हों तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["muscle cramp", "leg cramp", "foot cramp", "muscle soreness", "ऐंठन", "पैर में ऐंठन"],
    en: "Muscle cramps — OFFLINE REFERENCE:\n1. Gently stretch and massage the cramping muscle.\n2. Drink water — cramps are often linked to dehydration.\n3. Applying heat can help relax the muscle afterward.\n4. See a doctor if cramps are frequent, severe, or unexplained.",
    hi: "मांसपेशियों में ऐंठन — ऑफलाइन रेफरेंस:\n1. ऐंठन वाली मांसपेशी को धीरे से खींचें और मसलें।\n2. पानी पिएं — ऐंठन अक्सर डिहाइड्रेशन से जुड़ी होती है।\n3. बाद में गर्माहट देने से मांसपेशी को आराम मिल सकता है।\n4. बार-बार, तेज़, या बेवजह ऐंठन हो तो डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["joint pain", "shoulder pain", "knee pain", "ankle pain", "wrist pain", "hand injury", "finger injury", "toe injury", "neck muscle strain", "mild low back pain", "back pain", "joint dard", "jod dard", "जोड़ों में दर्द"],
    en: "Joint & minor limb pain/injury — OFFLINE REFERENCE:\n1. Rest the joint/limb, apply a cold pack for the first 24-48 hours if there's swelling.\n2. Gentle movement (not forcing through pain) can help once acute pain settles.\n3. See a doctor for: inability to use the limb, significant swelling/deformity, or pain that doesn't improve in a few days.",
    hi: "जोड़ों और हल्की चोट का दर्द — ऑफलाइन रेफरेंस:\n1. जोड़/अंग को आराम दें, सूजन हो तो पहले 24-48 घंटे ठंडा पैक लगाएं।\n2. तेज़ दर्द कम होने पर हल्की हरकत (दर्द के बावजूद ज़ोर न लगाएं) मदद कर सकती है।\n3. अंग इस्तेमाल न कर पाना, ज़्यादा सूजन/विकृति, या कुछ दिनों में दर्द कम न होने पर डॉक्टर को दिखाएं।"
  },
  {
    keywords: ["numbness", "tingling", "pins and needles", "nerve pain", "sciatica", "restless legs", "सुन्न होना", "झनझनाहट"],
    en: "Numbness, tingling & nerve pain — OFFLINE REFERENCE:\n1. Brief numbness/tingling from sitting in one position usually resolves with movement.\n2. Persistent or spreading numbness, weakness, or nerve-type shooting pain (like sciatica) should be evaluated by a doctor.\n3. Seek urgent care if numbness/weakness is sudden and affects one side of the body (possible stroke sign — see Stroke).",
    hi: "सुन्नपन, झनझनाहट और नसों का दर्द — ऑफलाइन रेफरेंस:\n1. एक ही पोज़िशन में बैठने से होने वाला हल्का सुन्नपन आमतौर पर हिलने-डुलने से ठीक हो जाता है।\n2. लगातार या फैलता सुन्नपन, कमज़ोरी, या नस जैसा तेज़ दर्द (साइटिका जैसा) डॉक्टर को दिखाना चाहिए।\n3. अचानक सुन्नपन/कमज़ोरी शरीर के एक तरफ हो तो तुरंत डॉक्टर को दिखाएं (स्ट्रोक का संकेत हो सकता है)।"
  },
  {
    keywords: ["headache", "severe headache", "migraine", "tension headache", "cluster headache", "neck headache", "jaw pain", "facial pain", "sar dard", "sir dard", "सिरदर्द"],
    en: "Headache / migraine — OFFLINE REFERENCE:\n1. Rest in a quiet, dark room. Stay hydrated.\n2. A cold compress on the forehead may help.\n3. Over-the-counter pain relief can help if appropriate for the person — follow the label.\n4. Seek urgent care for: 'worst headache of your life', headache with confusion/stiff neck/fever, after a head injury, or with vision/speech changes or weakness (possible stroke — see Stroke).",
    hi: "सिरदर्द / माइग्रेन — ऑफलाइन रेफरेंस:\n1. शांत, अंधेरे कमरे में आराम करें। हाइड्रेटेड रहें।\n2. माथे पर ठंडा सेंक मदद कर सकता है।\n3. उपयुक्त हो तो ओवर-द-काउंटर दर्द निवारक मदद कर सकती है — लेबल के अनुसार लें।\n4. 'ज़िंदगी का सबसे तेज़ सिरदर्द', भ्रम/गर्दन अकड़न/बुखार के साथ सिरदर्द, सिर की चोट के बाद, या नज़र/बोली में बदलाव/कमज़ोरी के साथ तुरंत डॉक्टर को दिखाएं (स्ट्रोक का संकेत हो सकता है)।"
  },
  {
    keywords: ["swollen lymph nodes", "loss of appetite", "hiccups", "गांठ", "भूख न लगना", "हिचकी"],
    en: "Swollen glands / loss of appetite / hiccups — OFFLINE REFERENCE:\n1. Swollen lymph nodes are often a sign the body is fighting an infection — usually settle in 1-2 weeks.\n2. Loss of appetite with illness is common; focus on fluids, light food as tolerated.\n3. Hiccups usually stop on their own; holding your breath briefly or sipping cold water can help.\n4. See a doctor if swollen glands are large/hard/painless, or appetite loss/hiccups persist more than a couple of weeks.",
    hi: "सूजी हुई ग्रंथियां / भूख न लगना / हिचकी — ऑफलाइन रेफरेंस:\n1. सूजी हुई लिम्फ ग्रंथियां अक्सर शरीर के संक्रमण से लड़ने का संकेत होती हैं — आमतौर पर 1-2 हफ्ते में ठीक हो जाती हैं।\n2. बीमारी में भूख कम लगना सामान्य है; तरल पदार्थ और हल्के खाने पर ध्यान दें।\n3. हिचकी आमतौर पर खुद रुक जाती है; थोड़ी देर सांस रोकना या ठंडा पानी पीना मदद कर सकता है।\n4. सूजी हुई ग्रंथियां बड़ी/सख्त/बिना दर्द की हों, या भूख न लगना/हिचकी कुछ हफ्तों से ज़्यादा रहे तो डॉक्टर को दिखाएं।"
  }
];

function containsDevanagari(text) {
  return /[\u0900-\u097F]/.test(text);
}

const CONSONANT_MAP = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ng',
  'च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'ny',
  'ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n',
  'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
  'य':'y','र':'r','ल':'l','व':'v',
  'श':'sh','ष':'sh','स':'s','ह':'h','ळ':'l'
};
const MATRA_MAP = {
  'ा':'aa','ि':'i','ी':'ee','ु':'u','ू':'oo',
  'ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au'
};
const VOWEL_MAP = {
  'अ':'a','आ':'aa','इ':'i','ई':'ee','उ':'u',
  'ऊ':'oo','ऋ':'ri','ए':'e','ऐ':'ai','ओ':'o','औ':'au'
};

// STAGE 15: mechanically converts Devanagari to Roman letters (NOT a
// translation — same Hindi words, just Latin script), so a Hinglish
// question gets a proper Hinglish-looking answer automatically.
function transliterateToHinglish(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const base = CONSONANT_MAP[c];
    if (base) {
      const next = text[i + 1];
      if (next && MATRA_MAP[next]) {
        result += base + MATRA_MAP[next];
        i += 2;
      } else if (next === '्') {
        result += base;
        i += 2;
      } else {
        result += base + 'a';
        i += 1;
      }
    } else if (VOWEL_MAP[c]) {
      result += VOWEL_MAP[c];
      i += 1;
    } else if (c === 'ं' || c === 'ँ') {
      result += 'n';
      i += 1;
    } else if (c === 'ः') {
      result += 'h';
      i += 1;
    } else {
      result += c;
      i += 1;
    }
  }
  return result;
}

function normalizeWord(word) {
  if (containsDevanagari(word)) return word.toLowerCase();
  let result = '';
  let last = null;
  for (const c of word.toLowerCase()) {
    if (c !== last) result += c;
    last = c;
  }
  return result;
}

const STOPWORDS = new Set([
  'hai','hain','ho','hu','hun','aa','gaya','gayi','gaye','liya','diya',
  'kar','karo','kr','lag','laga','lagi','lage','mein','me','se','ka','ki',
  'ke','ne','aur','bhi','kya','raha','rahi','rahe','the','and','for','with',
  'not','are','you','your','this','that','mera','meri','mere','mujhe','tumhe',
  'aap','main','mai','kaise','kaisi','nahi','chahiye','hoga','hogi','bata',
  'batao','kuch','koi','kahan','kab','kyun','kyu','wala','wali',
  'hone','hota','hoti','sakta','sakti','karna','karni','wagera'
]);

const HINGLISH_MARKERS = new Set([
  'hai','hain','kya','mujhe','kar','kr','raha','rahi','rahe','nahi','mera',
  'meri','mere','tumhe','aap','kaise','kaisi','kyu','kyun','hua','hui','gaya',
  'gayi','liya','diya','chahiye','lag','laga','lagi','aa','ho','hoga','hogi',
  'bata','batao','mujhko','humko','hamein'
]);

function words(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/**
 * Picks the BEST matching entry (most overlapping distinctive words) so a
 * generic shared word like "dard" (pain) doesn't make an unrelated entry
 * win over a more specific one. Returns Hindi (Devanagari query), Hinglish
 * (Latin-script Hindi query — detected via marker words), or English.
 */
function findOfflineAnswer(query) {
  const queryWords = words(query);
  if (queryWords.length === 0) return null;

  let bestEntry = null;
  let bestScore = 0;
  for (const entry of OFFLINE_ENTRIES) {
    let entryBest = 0;
    for (const keyword of entry.keywords) {
      const score = words(keyword).filter((kw) =>
        queryWords.some((qw) => qw === kw || qw.includes(kw) || kw.includes(qw))
      ).length;
      if (score > entryBest) entryBest = score;
    }
    if (entryBest > bestScore) {
      bestScore = entryBest;
      bestEntry = entry;
    }
  }
  if (!bestEntry) return null;

  const rawWords = query.toLowerCase().split(/\s+/);
  if (containsDevanagari(query)) return bestEntry.hi;
  if (rawWords.some((w) => HINGLISH_MARKERS.has(w.trim()))) {
    return transliterateToHinglish(bestEntry.hi);
  }
  return bestEntry.en;
}
