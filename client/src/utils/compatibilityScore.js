/**
 * Compatibility Matching Algorithm
 *
 * Calculates a percentage score (0-100) between two profiles based on:
 *
 * 1. Budget Compatibility (25 pts)
 *    - Budgets within $200 of each other → full 25 pts
 *    - Within $500 → 15 pts
 *    - Otherwise → 5 pts
 *
 * 2. Sleep Schedule (20 pts)
 *    - Exact match → 20 pts
 *    - One is flexible → 10 pts (flexible person adapts)
 *    - Different schedules → 0 pts
 *
 * 3. Cleanliness (20 pts)
 *    - Difference of 0 → 20 pts
 *    - Difference of 1 → 15 pts
 *    - Difference of 2 → 8 pts
 *    - Difference >= 3 → 0 pts
 *
 * 4. Smoking / Drinking (20 pts total, 10 each)
 *    - Exact match → 10 pts
 *    - One says "occasional", other says "yes" → 5 pts
 *    - One says "no", other says "yes" → 0 pts
 *    - "occasional" + "no" → 5 pts
 *
 * 5. Shared Interests (15 pts)
 *    - Proportional: (shared / max(1, min(len1, len2))) * 15
 *    - If both have no interests → 7 pts (neutral)
 *
 * Result: Sum of all categories = compatibility percentage.
 */

export function calculateCompatibility(profileA, profileB) {
  let score = 0;

  // 1. Budget (25 pts)
  const budgetDiff = Math.abs(profileA.budget - profileB.budget);
  if (budgetDiff <= 200) score += 25;
  else if (budgetDiff <= 500) score += 15;
  else score += 5;

  // 2. Sleep Schedule (20 pts)
  if (profileA.sleepSchedule === profileB.sleepSchedule) {
    score += 20;
  } else if (
    profileA.sleepSchedule === 'flexible' ||
    profileB.sleepSchedule === 'flexible'
  ) {
    score += 10;
  }

  // 3. Cleanliness (20 pts)
  const cleanDiff = Math.abs(profileA.cleanliness - profileB.cleanliness);
  if (cleanDiff === 0) score += 20;
  else if (cleanDiff === 1) score += 15;
  else if (cleanDiff === 2) score += 8;

  // 4. Smoking (10 pts) & Drinking (10 pts)
  const matchHabit = (a, b) => {
    if (a === b) return 10;
    if ((a === 'occasional' && b === 'yes') || (a === 'yes' && b === 'occasional')) return 5;
    if ((a === 'occasional' && b === 'no') || (a === 'no' && b === 'occasional')) return 5;
    return 0;
  };
  score += matchHabit(profileA.smoking, profileB.smoking);
  score += matchHabit(profileA.drinking, profileB.drinking);

  // 5. Shared Interests (15 pts)
  const interestsA = profileA.interests || [];
  const interestsB = profileB.interests || [];
  if (interestsA.length === 0 && interestsB.length === 0) {
    score += 7;
  } else {
    const setA = new Set(interestsA.map((i) => i.toLowerCase().trim()));
    const setB = new Set(interestsB.map((i) => i.toLowerCase().trim()));
    const shared = [...setA].filter((i) => setB.has(i)).length;
    const minLen = Math.min(setA.size, setB.size);
    score += minLen > 0 ? (shared / minLen) * 15 : 0;
  }

  return Math.round(score);
}
