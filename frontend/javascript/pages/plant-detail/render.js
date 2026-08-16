import { escapeHtml } from "../../utils.js";

const STATUS_LABEL = {
  healthy: "Healthy",
  sick: "Sick",
  dead: "Dead",
};

function statusClass(status) {
  return STATUS_LABEL[status] ? status : "dead";
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

  detailsContainer.innerHTML = `
    <div class="plant-detail">
      <div class="plant-detail-media">
        <div class="plant-detail-photo">${photo}</div>
        <p class="upload-hint">JPG or PNG, up to 5 MB.</p>
        <div class="record-meta">
          <div class="label">Record</div>
          <div class="value">id: ${plantId}</div>
        </div>
      </div>

      <div class="plant-detail-main">
        <div class="plant-detail-heading">
          <div class="title-row">
            <h2>${name} <span class="nick">&ldquo;${nickname}&rdquo;</span></h2>
            <span class="status-chip status-chip--${status}">${statusLabel}</span>
          </div>
          <div class="sci">${scientificName}</div>
          <div class="meta-row">
            <div><span class="k">Location</span> — ${location}</div>
            <div><span class="k">Acquired</span> — ${dateAcquired}</div>
          </div>
        </div>

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

        <div class="detail-actions">
          <label class="upload-label btn" for="plant-image">
            <svg class="btn-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 11V2M8 2L4.5 5.5M8 2L11.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.5 11V12.5C2.5 13.0523 2.94772 13.5 3.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Upload a photo
            <input type="file" id="plant-image" name="plant-image" accept="image/*" />
          </label>
          <a class="btn" href="add-plant.html?id=${plantId}">
            <svg class="btn-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Edit this plant
          </a>
          <button type="button" class="btn-delete">
            <svg class="btn-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2.5 4.5H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M6.5 4.5V2.5C6.5 2.22386 6.72386 2 7 2H9C9.27614 2 9.5 2.22386 9.5 2.5V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4.5 4.5L5 13C5 13.5523 5.44772 14 6 14H10C10.5523 14 11 13.5523 11 13L11.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Delete this plant
          </button>
        </div>
      </div>
    </div>
  `;
}
