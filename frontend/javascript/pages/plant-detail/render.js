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
};

const FIELD_ICONS = {
  location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 9.5h16M8 3v3.5M16 3v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  humidity: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3s6.5 7.1 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 10.1 12 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  temperature: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="10" cy="16.5" r="1.4" fill="currentColor"/></svg>`,
  light: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  watering: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3s6.5 7.1 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 10.1 12 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  checkDaily: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5L16.5 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fertilize: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21V13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 13C12 13 4 12.5 4 5.5C11 5.5 12 9 12 13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 13C12 13 20 12.5 20 5.5C13 5.5 12 9 12 13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

function statusClass(status) {
  return STATUS_LABEL[status] ? status : "dead";
}

function renderField(iconKey, label, value) {
  return `
    <div class="detail-field">
      <div class="k"><span class="k-icon">${FIELD_ICONS[iconKey]}</span>${label}</div>
      <div class="v">${value}</div>
    </div>
  `;
}

function renderWateringHistory(plantId) {
  const { weeks, lastWateredDate } = buildWateringHistory(plantId);

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

export function renderPlantDetails(plant) {
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
  const dateAcquired = escapeHtml(plant.date_acquired || "Unknown");
  const notes = escapeHtml(plant.notes || "No notes available.");
  const humidityPreference = escapeHtml(plant.preference?.humidity || "Unknown");
  const temperaturePreference = escapeHtml(plant.preference?.temperature || "Unknown");
  const wateringPreference = escapeHtml(plant.preference?.watering || "Unknown");
  const lightPreference = escapeHtml(plant.preference?.light || "Unknown");
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
          <div class="plant-detail-photo">${photo}</div>

          <div class="icon-action-row">
            <label class="icon-btn" for="plant-image">
              <span class="icon-btn-circle">${ICONS.photo}</span>
              <span class="icon-btn-label">Photo</span>
              <input type="file" id="plant-image" name="plant-image" accept="image/*" />
            </label>
            <button type="button" class="icon-btn icon-btn--water">
              <span class="icon-btn-circle">${ICONS.water}</span>
              <span class="icon-btn-label">Water</span>
            </button>
            <a class="icon-btn" href="add-plant.html?id=${plantId}">
              <span class="icon-btn-circle">${ICONS.edit}</span>
              <span class="icon-btn-label">Edit</span>
            </a>
            <button type="button" class="icon-btn icon-btn--delete">
              <span class="icon-btn-circle">${ICONS.delete}</span>
              <span class="icon-btn-label">Delete</span>
            </button>
          </div>
        </div>

        ${renderWateringHistory(plantId)}
      </div>

      <div class="plant-detail-right">
        <div class="plant-detail-heading">
          <div class="title-row">
            <h2>${name}</h2>
            <span class="status-chip status-chip--${status}">${statusLabel}</span>
          </div>
          <div class="name-sci-row">
            <span class="nick">&ldquo;${nickname}&rdquo;</span>
            <span class="sci">${scientificName}</span>
          </div>
          <div class="meta-row">
            ${renderField("location", "Location", location)}
            ${renderField("calendar", "Acquired", dateAcquired)}
          </div>
        </div>

        <div class="plant-detail-main">
          <div class="detail-section">
            <div class="section-label">Care preferences</div>
            <div class="detail-grid">
              ${renderField("humidity", "Humidity", humidityPreference)}
              ${renderField("temperature", "Temperature", temperaturePreference)}
              ${renderField("light", "Light", lightPreference)}
              ${renderField("watering", "Watering", wateringPreference)}
            </div>
          </div>

          <div class="detail-section">
            <div class="section-label">Routine</div>
            <div class="detail-grid">
              ${renderField("checkDaily", "Check daily", checkDaily)}
              ${renderField("fertilize", "Fertilize", fertilizeFrequency)}
            </div>
          </div>

          <div class="detail-section">
            <div class="section-label">Notes</div>
            <div class="detail-notes">${notes}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
