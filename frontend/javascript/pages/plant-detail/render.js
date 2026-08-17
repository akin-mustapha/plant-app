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

function statusClass(status) {
  return STATUS_LABEL[status] ? status : "dead";
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
            <button type="button" class="icon-btn icon-btn--delete btn-delete">
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
            <div class="detail-field"><div class="k">Location</div><div class="v">${location}</div></div>
            <div class="detail-field"><div class="k">Acquired</div><div class="v">${dateAcquired}</div></div>
          </div>
        </div>

        <div class="plant-detail-main">
          <div class="detail-section">
            <div class="section-label">Care preferences</div>
            <div class="detail-grid">
              <div class="detail-field"><div class="k">Humidity</div><div class="v">${humidityPreference}</div></div>
              <div class="detail-field"><div class="k">Temperature</div><div class="v">${temperaturePreference}</div></div>
              <div class="detail-field"><div class="k">Light</div><div class="v">${lightPreference}</div></div>
              <div class="detail-field"><div class="k">Watering</div><div class="v">${wateringPreference}</div></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-label">Routine</div>
            <div class="detail-grid">
              <div class="detail-field"><div class="k">Check daily</div><div class="v">${checkDaily}</div></div>
              <div class="detail-field"><div class="k">Fertilize</div><div class="v">${fertilizeFrequency}</div></div>
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
