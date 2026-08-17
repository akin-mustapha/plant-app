// Placeholder watering history data until the backend tracks waterings.
// Generates a deterministic 7-day-a-week grid over the last 6 months so the
// widget has something realistic to render per plant.
function seedFromString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Random walk: pick the next watering day 5-9 days out (occasionally a
// quicker 3-4 day top-up), so the grid scatters organically instead of
// landing on the same weekday every week.
function buildWateredDateSet(random, rangeStart, today) {
  const watered = new Set();
  let cursor = new Date(rangeStart);
  cursor.setDate(cursor.getDate() + Math.floor(random() * 5));

  while (cursor <= today) {
    watered.add(cursor.toDateString());
    const gap = random() < 0.2 ? 3 + Math.floor(random() * 2) : 5 + Math.floor(random() * 5);
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() + gap);
  }

  return watered;
}

export function buildWateringHistory(plantId, months = 6) {
  const random = mulberry32(seedFromString(plantId || "plant"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDay = today.getDay();
  const daysSinceMonday = (startDay + 6) % 7;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - daysSinceMonday);

  const rangeStart = new Date(today);
  rangeStart.setMonth(rangeStart.getMonth() - months);
  const daysSinceMondayForStart = (rangeStart.getDay() + 6) % 7;
  const firstMonday = new Date(rangeStart);
  firstMonday.setDate(rangeStart.getDate() - daysSinceMondayForStart);

  const totalWeeks = Math.ceil((thisMonday - firstMonday) / (7 * 24 * 60 * 60 * 1000)) + 1;
  const wateredDates = buildWateredDateSet(random, rangeStart, today);

  const weeks = [];
  let lastWateredDate = null;

  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + w * 7 + d);

      if (date > today) {
        week.push(null);
        continue;
      }

      const watered = wateredDates.has(date.toDateString());
      week.push({ date, watered });
      if (watered && (!lastWateredDate || date > lastWateredDate)) {
        lastWateredDate = date;
      }
    }
    weeks.push(week);
  }

  return { weeks, lastWateredDate };
}

export function daysAgoLabel(date) {
  if (!date) return "No waterings logged yet";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compared = new Date(date);
  compared.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - compared) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
