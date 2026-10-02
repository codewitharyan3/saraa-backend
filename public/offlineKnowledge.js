// STAGE 12: a small, fixed, pre-written reference used ONLY in Offline mode.
//
// IMPORTANT — this is NOT an AI. It does not "think" or generate new text.
// It's a simple keyword search over a short list of basic, common-sense
// safety information, so the app has *something* honest and useful to say
// when there is no internet — not a replacement for real medical care, and
// not a substitute for the real AI chat (which needs internet).

const OFFLINE_ENTRIES = [
  {
    keywords: ['cpr', 'not breathing', 'heart stopped', 'cardiac arrest'],
    answer:
      "CPR (basic adult steps) — OFFLINE REFERENCE, not a substitute for emergency services:\n" +
      "1. Call for emergency help immediately (or have someone else call).\n" +
      "2. Lay the person flat on their back on a firm surface.\n" +
      "3. Kneel beside them, place the heel of one hand on the center of the chest, other hand on top.\n" +
      "4. Push hard and fast — about 100-120 compressions per minute, 5-6 cm deep.\n" +
      "5. Continue until help arrives or the person responds.\n" +
      "If you have no training, hands-only CPR (compressions only, no breaths) is recommended."
  },
  {
    keywords: ['choking', "can't breathe", 'something stuck in throat'],
    answer:
      "Choking (conscious adult) — OFFLINE REFERENCE:\n" +
      "1. Ask \"Are you choking?\" If they can't speak/cough/breathe, act fast.\n" +
      "2. Give 5 back blows between the shoulder blades with the heel of your hand.\n" +
      "3. If that doesn't work, give 5 abdominal thrusts (Heimlich maneuver): stand behind them, " +
      "fist above the navel, grasp with other hand, pull sharply inward and upward.\n" +
      "4. Alternate 5 back blows and 5 abdominal thrusts until the object comes out or they become unresponsive.\n" +
      "Call emergency services if it doesn't clear quickly."
  },
  {
    keywords: ['bleeding', 'cut', 'wound', 'blood'],
    answer:
      "Bleeding control — OFFLINE REFERENCE:\n" +
      "1. Wash your hands or wear gloves if available.\n" +
      "2. Apply firm, direct pressure on the wound with a clean cloth or bandage.\n" +
      "3. Keep pressing continuously for at least 10-15 minutes — don't keep lifting it to check.\n" +
      "4. If possible, raise the injured area above heart level.\n" +
      "5. Once bleeding slows, cover with a clean dressing and bandage firmly (not so tight it cuts circulation).\n" +
      "Seek medical help for deep, large, or spurting wounds."
  },
  {
    keywords: ['burn', 'scald', 'fire injury'],
    answer:
      "Burns (minor) — OFFLINE REFERENCE:\n" +
      "1. Cool the burn under cool (not ice-cold) running water for 10-20 minutes.\n" +
      "2. Remove tight clothing/jewellery near the area before it swells, if safe to do so.\n" +
      "3. Do NOT apply ice, butter, oil, or toothpaste.\n" +
      "4. Cover loosely with a clean, non-fluffy cloth or cling film.\n" +
      "5. Do not pop any blisters.\n" +
      "Seek medical help for large burns, burns on the face/hands/genitals, or if the skin is charred/white."
  },
  {
    keywords: ['snake bite', 'snakebite'],
    answer:
      "Snake bite — OFFLINE REFERENCE:\n" +
      "1. Keep the person calm and still — moving spreads venom faster.\n" +
      "2. Keep the bitten limb at or below heart level.\n" +
      "3. Remove tight items (rings, watches) near the bite before swelling starts.\n" +
      "4. Do NOT cut the wound, suck out venom, apply ice, or use a tight tourniquet.\n" +
      "5. Get to a hospital as fast as possible — antivenom is the real treatment."
  },
  {
    keywords: ['fracture', 'broken bone', 'sprain'],
    answer:
      "Suspected fracture or sprain — OFFLINE REFERENCE:\n" +
      "1. Keep the injured area still — don't try to realign or straighten it.\n" +
      "2. Support it in the position found using a splint if you must move the person.\n" +
      "3. Apply a cold pack wrapped in cloth to reduce swelling (20 minutes on, then off).\n" +
      "4. Elevate the limb if possible.\n" +
      "5. Get medical/X-ray attention as soon as possible."
  },
  {
    keywords: ['allergic reaction', 'anaphylaxis', 'swelling throat'],
    answer:
      "Severe allergic reaction (anaphylaxis) — OFFLINE REFERENCE:\n" +
      "Signs: difficulty breathing, swelling of face/throat, widespread hives, dizziness.\n" +
      "1. Call emergency services immediately — this can be life-threatening.\n" +
      "2. If they have a prescribed epinephrine auto-injector, help them use it.\n" +
      "3. Have them lie flat with legs raised (unless breathing is easier sitting up).\n" +
      "4. Keep them calm and monitor breathing until help arrives."
  },
  {
    keywords: ['fainting', 'fainted', 'unconscious', 'passed out'],
    answer:
      "Fainting — OFFLINE REFERENCE:\n" +
      "1. Lay the person flat and raise their legs about 12 inches.\n" +
      "2. Loosen tight clothing around the neck.\n" +
      "3. Ensure fresh air, avoid crowding them.\n" +
      "4. They usually recover within a minute — if not, call for emergency help.\n" +
      "5. Once awake, have them rest sitting down before standing."
  },
  {
    keywords: ['fever', 'high temperature'],
    answer:
      "Fever (general care) — OFFLINE REFERENCE:\n" +
      "1. Rest and drink plenty of fluids.\n" +
      "2. Dress in light clothing, keep the room comfortably cool.\n" +
      "3. A lukewarm sponge bath can help reduce discomfort.\n" +
      "4. Seek medical care for a fever above 103°F (39.4°C), or fever with stiff neck, confusion, " +
      "difficulty breathing, or in a young infant."
  },
  {
    keywords: ['dehydration', 'heatstroke', 'heat exhaustion'],
    answer:
      "Heat exhaustion / dehydration — OFFLINE REFERENCE:\n" +
      "1. Move to a cool/shaded place immediately.\n" +
      "2. Loosen clothing, cool the skin with a damp cloth or fan.\n" +
      "3. Sip water or an oral rehydration solution slowly (not large gulps).\n" +
      "4. If confusion, very high body temperature, or no sweating occurs — this may be heatstroke: " +
      "call emergency services right away."
  }
];

function findOfflineAnswer(query) {
  const lowerQuery = query.toLowerCase();
  const match = OFFLINE_ENTRIES.find((entry) =>
    entry.keywords.some((keyword) => lowerQuery.includes(keyword))
  );
  return match ? match.answer : null;
}
