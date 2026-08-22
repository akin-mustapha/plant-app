import { escapeHtml } from "../../utils.js";
import { buildWateringHistory, daysAgoLabel } from "./watering-history.js";

const STATUS_LABEL = {
  healthy: "Healthy",
  sick: "Sick",
  dead: "Dead",
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_ROW_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

const ICONS = {
  photo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  water: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3s6.5 7.1 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 10.1 12 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  edit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  delete: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const WATER_NEED_LABEL = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const LIGHT_LABEL = {
  brightIndirect: "Bright indirect",
  direct: "Direct",
  lowLight: "Low light",
};

const WINDOW_DIRECTION_LABEL = {
  north: "North-facing window",
  east: "East-facing window",
  south: "South-facing window",
  west: "West-facing window",
};

const WINDOW_DIRECTION_SHORT_LABEL = {
  north: "North-facing",
  east: "East-facing",
  south: "South-facing",
  west: "West-facing",
};

const FIELD_ICONS = {
  location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 9.5h16M8 3v3.5M16 3v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  species: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 11.5 11.5 3H19a2 2 0 0 1 2 2v7.5l-8.5 8.5a1.5 1.5 0 0 1-2.1 0L3 12.6a1.5 1.5 0 0 1 0-2.1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="15.5" cy="8.5" r="1.4" fill="currentColor"/></svg>`,
  status: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 12h4l2-7 4 14 2-7h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  humidity: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3s6.5 7.1 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 10.1 12 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  temperature: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="10" cy="16.5" r="1.4" fill="currentColor"/></svg>`,
  light: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  watering: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3s6.5 7.1 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 10.1 12 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  checkDaily: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5L16.5 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fertilize: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21V13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 13C12 13 4 12.5 4 5.5C11 5.5 12 9 12 13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 13C12 13 20 12.5 20 5.5C13 5.5 12 9 12 13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  avoid: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M6.3 17.7 17.7 6.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

function statusClass(status) {
  return STATUS_LABEL[status] ? status : "dead";
}

function careDurationLabel(dateAcquired) {
  if (!dateAcquired) return null;
  const acquired = new Date(dateAcquired);
  if (Number.isNaN(acquired.getTime())) return null;

  const today = new Date();
  let months = (today.getFullYear() - acquired.getFullYear()) * 12 + (today.getMonth() - acquired.getMonth());
  if (today.getDate() < acquired.getDate()) months -= 1;
  months = Math.max(0, months);

  if (months < 1) return "In your care less than a month";
  if (months === 1) return "In your care 1 month";
  if (months < 24) return `In your care ${months} months`;
  const years = Math.floor(months / 12);
  return `In your care ${years} year${years === 1 ? "" : "s"}`;
}

function daysBetween(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(a);
  start.setHours(0, 0, 0, 0);
  const end = new Date(b);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / msPerDay);
}

function parseWateringIntervalDays(wateringPreference) {
  if (!wateringPreference) return null;
  const match = String(wateringPreference).match(/every\s+(\d+)\s+day/i) || String(wateringPreference).match(/(\d+)\s*-?\s*day/i);
  if (match) return Number(match[1]);
  if (/week/i.test(wateringPreference)) return 7;
  return null;
}

function renderNextUpBanner(plant, activities, wateringLabel) {
  const wateredDates = (activities || [])
    .filter((activity) => activity.__typeDescription === "Watering")
    .map((activity) => new Date(activity.activity_date))
    .sort((a, b) => b - a);

  const lastWatered = wateredDates[0] || null;
  const intervalDays = parseWateringIntervalDays(plant.preference?.watering) || 7;
  const today = new Date();

  let headline = "No watering logged yet";
  let subtext = "Log a watering to start tracking this plant's rhythm.";

  if (lastWatered) {
    const daysSince = daysBetween(lastWatered, today);
    const daysUntil = intervalDays - daysSince;

    if (daysUntil > 0) {
      headline = `Water in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`;
    } else if (daysUntil === 0) {
      headline = "Water today";
    } else {
      headline = `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"}`;
    }

    const lastWateredLabel = daysSince === 0 ? "today" : daysSince === 1 ? "1 day ago" : `${daysSince} days ago`;
    subtext = `Last watered ${lastWateredLabel} &middot; ${escapeHtml(wateringLabel)}`;
  }

  return `
    <div class="next-up-banner">
      <div class="next-up-info">
        <div class="next-up-label">Next up</div>
        <div class="next-up-headline">${escapeHtml(headline)}</div>
        <div class="next-up-subtext">${subtext}</div>
      </div>
      <div class="next-up-actions">
        <button type="button" class="icon-btn icon-btn--water-now">
          ${ICONS.water}<span>Water now</span>
        </button>
        <button type="button" class="icon-btn icon-btn--fertilize-now">
          ${FIELD_ICONS.fertilize}<span>Fertilize</span>
        </button>
      </div>
    </div>
  `;
}

function renderGlanceStrip(plant) {
  const light = LIGHT_LABEL[plant.preference?.light] || escapeHtml(plant.preference?.light || "Unknown");
  const waterNeed = WATER_NEED_LABEL[plant.preference?.water_need] || "Medium";
  const humidity = escapeHtml(plant.preference?.humidity || "Unknown");
  const temperature = escapeHtml(plant.preference?.temperature || "Unknown");

  return `
    <div class="glance-strip">
      <div class="glance-card">
        <div class="glance-label">Light</div>
        <div class="glance-value">${light}</div>
      </div>
      <div class="glance-card">
        <div class="glance-label">Water need</div>
        <div class="glance-value">${waterNeed}</div>
      </div>
      <div class="glance-card">
        <div class="glance-label">Humidity</div>
        <div class="glance-value">${humidity}</div>
      </div>
      <div class="glance-card">
        <div class="glance-label">Temperature</div>
        <div class="glance-value">${temperature}</div>
      </div>
    </div>
  `;
}

function renderField(iconKey, label, value) {
  return `
    <div class="detail-field">
      <div class="k"><span class="k-icon">${FIELD_ICONS[iconKey]}</span>${label}</div>
      <div class="v">${value}</div>
    </div>
  `;
}

function renderWateringHistory(activities) {
  const wateringActivities = (activities || []).filter((activity) => activity.__typeDescription === "Watering");
  const { weeks, lastWateredDate } = buildWateringHistory(wateringActivities, 3);

  let lastMonth = null;
  const monthLabelsHtml = weeks
    .map((week) => {
      const firstRealDay = week.find(Boolean);
      const month = firstRealDay ? firstRealDay.date.getMonth() : null;
      const label = month !== null && month !== lastMonth ? MONTH_LABELS[month] : "";
      if (month !== null) lastMonth = month;
      return `<div class="watering-month-label">${label}</div>`;
    })
    .join("");

  const rowsHtml = WEEKDAY_ROW_LABELS
    .map((dayLabel, rowIndex) => {
      const cells = weeks
        .map((week) => {
          const entry = week[rowIndex];
          if (!entry) return `<div class="watering-cell watering-cell--empty"></div>`;
          const watered = entry.watered ? "watering-cell--watered" : "";
          const dateLabel = entry.date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
          const title = `${dateLabel} — ${entry.watered ? "Watered" : "Not watered"}`;
          return `<div class="watering-cell ${watered}" title="${escapeHtml(title)}"></div>`;
        })
        .join("");
      return `
        <div class="watering-row">
          <div class="watering-row-label">${dayLabel}</div>
          <div class="watering-row-cells">${cells}</div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="detail-section watering-history">
      <div class="section-label">Watering history</div>
      <div class="watering-history-summary">Last watered <strong>${escapeHtml(daysAgoLabel(lastWateredDate))}</strong></div>
      <div class="watering-grid">
        <div class="watering-month-labels">
          <div class="watering-row-label"></div>
          <div class="watering-row-cells">${monthLabelsHtml}</div>
        </div>
        ${rowsHtml}
      </div>
      <div class="watering-legend">
        <span class="watering-legend-swatch"></span> Not watered
        <span class="watering-legend-swatch watering-legend-swatch--watered"></span> Watered
      </div>
    </div>
  `;
}

function renderLocationCard(location, windowDirectionShort, dateAcquiredLabel) {
  return `
    <div class="detail-section location-card">
      <div class="section-label">Location</div>
      <div class="care-profile-table">
        ${renderField("location", "Room", location)}
        ${windowDirectionShort ? renderField("light", "Window", windowDirectionShort) : ""}
        ${renderField("calendar", "Acquired", dateAcquiredLabel)}
      </div>
    </div>
  `;
}

export function renderPlantDetailsSkeleton() {
  const detailsContainer = document.querySelector(".data-plant-details");
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
    <div class="plant-detail-skeleton">
      <div class="plant-detail-skeleton-left">
        <div class="skel-block skel-photo"></div>
        <div class="skel-action-row">
          <div class="skel-circle skel-action-circle"></div>
          <div class="skel-circle skel-action-circle"></div>
          <div class="skel-circle skel-action-circle"></div>
        </div>
        <div class="skel-card">
          <div class="skel-line" style="width: 45%;"></div>
          <div class="skel-block" style="height: 90px;"></div>
        </div>
      </div>
      <div class="plant-detail-skeleton-right">
        <div class="skel-title-row">
          <div class="skel-line" style="width: 40%; height: 22px;"></div>
          <div class="skel-block skel-pill"></div>
        </div>
        <div class="skel-line" style="width: 60%; margin-bottom: 20px;"></div>
        <div class="skel-card">
          <div class="skel-line" style="width: 30%;"></div>
          <div class="skel-block" style="height: 60px;"></div>
        </div>
        <div class="skel-card">
          <div class="skel-line" style="width: 25%;"></div>
          <div class="skel-block" style="height: 44px;"></div>
        </div>
      </div>
    </div>
  `;
}

export function renderPlantDetails(plant, activities = []) {
  const detailsContainer = document.querySelector(".data-plant-details");

  if (!plant) {
    detailsContainer.innerHTML = "<p>Plant not found.</p>";
    return;
  }

  const name = escapeHtml(plant.common_name || "Unnamed plant");
  const nickname = escapeHtml(plant.nick_name || "No nickname");
  const scientificName = escapeHtml(plant.scientific_name || "Unknown");
  const status = statusClass(plant.status);
  const statusLabel = STATUS_LABEL[status];
  const location = escapeHtml(plant.location || "Unknown");
  const windowDirection = WINDOW_DIRECTION_LABEL[plant.preference?.window_direction] || null;
  const windowDirectionShort = WINDOW_DIRECTION_SHORT_LABEL[plant.preference?.window_direction] || null;
  const locationLine = windowDirection ? `${location} &middot; ${windowDirection}` : location;
  const dateAcquired = escapeHtml(plant.date_acquired || "Unknown");
  const careDuration = careDurationLabel(plant.date_acquired);
  const notes = escapeHtml(plant.notes || "No notes available.");
  const wateringPreference = escapeHtml(plant.preference?.watering || "Unknown");
  const light = LIGHT_LABEL[plant.preference?.light] || escapeHtml(plant.preference?.light || "Unknown");
  const waterNeed = WATER_NEED_LABEL[plant.preference?.water_need] || "Medium";
  const humidity = escapeHtml(plant.preference?.humidity || "Unknown");
  const temperature = escapeHtml(plant.preference?.temperature || "Unknown");
  const checkDaily = plant.routine?.checkDaily ? "Yes" : "No";
  const fertilizeFrequency = escapeHtml(plant.routine?.fertilizeFrequency || "Unknown");
  const imageUrl = plant.image_url ? escapeHtml(plant.image_url) : "";
  const initial = escapeHtml((plant.common_name || "?").charAt(0).toUpperCase());
  const plantId = escapeHtml(plant.plant_id || "unknown");

  const photo = imageUrl
    ? `<img src="${imageUrl}" alt="${name}">`
    : `<div class="plant-image-initial">${initial}</div><div class="plant-image-note">no photo yet</div>`;

  const titleEl = document.querySelector("[data-plant-title]");
  if (titleEl) {
    titleEl.innerHTML = `${name} <span class="nick">&ldquo;${nickname}&rdquo;</span>`;
  }

  detailsContainer.innerHTML = `
    <div class="plant-detail">

      <div class="plant-detail-left">
        <div class="plant-detail-media">
          <div class="plant-detail-photo">
            ${photo}
          </div>
        </div>
      </div>

      <div class="plant-detail-right">
        <div class="plant-detail-heading">
          <div class="location-line">${locationLine}</div>
          <div class="name-sci-row">
            <h2 class="plant-name">${name}</h2>
            <span class="plant-sci-name">${scientificName}</span>
          </div>
          <div class="status-acquired-row">
            <span class="status-chip status-chip--${status}">${statusLabel}</span>
            ${careDuration ? `<span class="acquired-note">${careDuration}</span>` : ""}
          </div>
        </div>

        ${renderNextUpBanner(plant, activities, wateringPreference)}
        ${renderGlanceStrip(plant)}
      </div>

      <div class="plant-detail-reference">
        <div class="care-profile">
          <div class="section-label">Care preferences</div>
          <div class="care-profile-table">
            ${renderField("species", "Plant type", scientificName)}
            ${renderField("watering", "Water", waterNeed)}
            ${renderField("light", "Light", light)}
            ${renderField("humidity", "Humidity", humidity)}
            ${renderField("temperature", "Temperature", temperature)}
          </div>

          <div class="detail-section-notes">
            <div class="section-label">Routine</div>
            <div class="care-profile-table">
              ${renderField("watering", "Watering", wateringPreference)}
              ${renderField("fertilize", "Fertilize", fertilizeFrequency)}
              ${renderField("checkDaily", "Check daily", checkDaily)}
            </div>
          </div>

          <div class="detail-section-notes">
            <div class="section-label">Notes</div>
            <div class="detail-notes">${notes}</div>
          </div>
        </div>

        <div class="plant-detail-reference-side">
          ${renderLocationCard(location, windowDirectionShort, dateAcquired)}
          ${renderWateringHistory(activities)}
        </div>
      </div>

      <div class="plant-detail-actions">
        <label class="btn" for="plant-image">
          Add photo
          <input type="file" id="plant-image" name="plant-image" accept="image/*" />
        </label>
        <a class="btn" href="add-plant.html?id=${plantId}">Edit details</a>
        <button type="button" class="btn btn-delete">Delete plant</button>
      </div>
    </div>
  `;
}
