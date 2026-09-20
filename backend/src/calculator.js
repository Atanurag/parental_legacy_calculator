const FACTORS = [
  { key: 'geneticInheritance', name: 'Genetic Inheritance', min: 9.333, max: 10.777 },
  { key: 'constitutionalVitality', name: 'Constitutional Vitality', min: 8.111, max: 9.111 },
  { key: 'mentalPatterns', name: 'Mental Patterns', min: 6.111, max: 7.111 },
  { key: 'intellectualCapacity', name: 'Intellectual Capacity', min: 6.333, max: 6.999 },
  { key: 'emotionalFoundation', name: 'Emotional Foundation', min: 7.111, max: 7.999 },
  { key: 'spiritualLineage', name: 'Spiritual Lineage', min: 5.011, max: 6.011 },
  { key: 'soulConnections', name: 'Soul Connections', min: 5.111, max: 6.222 }
];

const MIN_PARENT_TOTAL = FACTORS.reduce((sum, f) => sum + f.min, 0);
const MAX_PARENT_TOTAL = FACTORS.reduce((sum, f) => sum + f.max, 0);

function hashSeed(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function constrainedValues(target, rng) {
  const values = FACTORS.map((factor) => factor.min + rng() * (factor.max - factor.min));
  let remaining = target - values.reduce((sum, value) => sum + value, 0);

  // Iteratively distribute the difference without crossing any factor's range.
  for (let pass = 0; pass < 50 && Math.abs(remaining) > 1e-9; pass += 1) {
    const candidates = values
      .map((value, index) => ({ index, room: remaining > 0 ? FACTORS[index].max - value : value - FACTORS[index].min }))
      .filter((item) => item.room > 1e-10);

    if (!candidates.length) break;

    const weights = candidates.map((item) => Math.max(0.05, item.room * (0.6 + rng())));
    const weightTotal = weights.reduce((a, b) => a + b, 0);
    let applied = 0;

    candidates.forEach((candidate, i) => {
      const share = remaining * (weights[i] / weightTotal);
      const room = candidate.room;
      const delta = remaining > 0 ? Math.min(share, room) : Math.max(share, -room);
      values[candidate.index] += delta;
      applied += delta;
    });

    remaining -= applied;
  }

  return values.map(round3);
}

function adjustRoundedTotal(values, target) {
  let rounded = values.map(round3);
  let diff = round3(target - rounded.reduce((sum, value) => sum + value, 0));
  if (Math.abs(diff) < 0.0005) return rounded;

  const order = [...Array(FACTORS.length).keys()].sort((a, b) => {
    const aRoom = diff > 0 ? FACTORS[a].max - rounded[a] : rounded[a] - FACTORS[a].min;
    const bRoom = diff > 0 ? FACTORS[b].max - rounded[b] : rounded[b] - FACTORS[b].min;
    return bRoom - aRoom;
  });

  for (const index of order) {
    const min = FACTORS[index].min;
    const max = FACTORS[index].max;
    const possible = diff > 0 ? max - rounded[index] : rounded[index] - min;
    const change = diff > 0 ? Math.min(diff, possible) : Math.max(diff, -possible);
    const safeChange = round3(change);
    rounded[index] = round3(rounded[index] + safeChange);
    diff = round3(diff - safeChange);
    if (Math.abs(diff) < 0.0005) break;
  }

  // Extremely small floating point residue is corrected on the factor with room.
  if (Math.abs(diff) >= 0.0005) {
    for (const index of order) {
      const min = FACTORS[index].min;
      const max = FACTORS[index].max;
      const candidate = round3(rounded[index] + diff);
      if (candidate >= min && candidate <= max) {
        rounded[index] = candidate;
        break;
      }
    }
  }
  return rounded;
}

function validateDob(dateString) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) throw new Error('DOB must use DD/MM/YYYY format.');
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('Please enter a valid date.');
  }
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12));
  if (date > todayUtc) throw new Error('Date of birth cannot be in the future.');
  return { day, month, year };
}

export function calculateLegacy(dateString) {
  const { day } = validateDob(dateString);
  const motherHigher = day % 2 === 1;

  // Parent totals stay inside the factor bounds while parity decides the dominant parent.
  const dominance = 1.15 + ((day * 7) % 9) * 0.08;
  const motherTarget = motherHigher ? 50 + dominance / 2 : 50 - dominance / 2;
  const fatherTarget = 100 - motherTarget;

  const rng = seededRandom(hashSeed(dateString));
  const motherValues = constrainedValues(motherTarget, rng);
  const fatherValues = constrainedValues(fatherTarget, rng);
  const finalMother = adjustRoundedTotal(motherValues, motherTarget);
  const finalFather = adjustRoundedTotal(fatherValues, fatherTarget);

  const factors = FACTORS.map((factor, index) => {
    const mother = finalMother[index];
    const father = finalFather[index];
    return {
      ...factor,
      mother,
      father,
      total: round3(mother + father)
    };
  });

  const motherTotal = round3(factors.reduce((sum, factor) => sum + factor.mother, 0));
  const fatherTotal = round3(factors.reduce((sum, factor) => sum + factor.father, 0));
  const grandTotal = round3(motherTotal + fatherTotal);

  // Correct the final 0.001 rounding residue while respecting bounds.
  if (grandTotal !== 100) {
    const delta = round3(100 - grandTotal);
    const parentKey = delta > 0 ? (motherTotal < fatherTotal ? 'mother' : 'father') : (motherTotal > fatherTotal ? 'mother' : 'father');
    for (let i = factors.length - 1; i >= 0; i -= 1) {
      const factor = factors[i];
      const candidate = round3(factor[parentKey] + delta);
      if (candidate >= factor.min && candidate <= factor.max) {
        factor[parentKey] = candidate;
        factor.total = round3(factor.mother + factor.father);
        break;
      }
    }
  }

  const finalMotherTotal = round3(factors.reduce((sum, factor) => sum + factor.mother, 0));
  const finalFatherTotal = round3(factors.reduce((sum, factor) => sum + factor.father, 0));

  return {
    dob: dateString,
    day,
    isOddDay: motherHigher,
    dominantParent: motherHigher ? 'Mother' : 'Father',
    motherTotal: finalMotherTotal,
    fatherTotal: finalFatherTotal,
    grandTotal: round3(finalMotherTotal + finalFatherTotal),
    factors,
    generatedAt: new Date().toISOString(),
    algorithm: {
      parentRule: motherHigher ? 'Odd date → Mother has higher influence' : 'Even date → Father has higher influence',
      totalRule: 'Mother + Father = 100.000',
      deterministic: true
    }
  };
}

export { FACTORS, MIN_PARENT_TOTAL, MAX_PARENT_TOTAL };
