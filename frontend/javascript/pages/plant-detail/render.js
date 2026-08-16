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

  const titleEl = document.querySelector("[data-plant-title]");
  if (titleEl) {
    titleEl.innerHTML = `${name} <span class="nick">&ldquo;${nickname}&rdquo;</span>`;
  }

  detailsContainer.innerHTML = `
    <div class="plant-detail">
    
      <div class="plant-detail-media">
        <div class="plant-detail-photo">${photo}</div>
        <label class="upload-label btn" for="plant-image">↑ Upload a photo
          <input type="file" id="plant-image" name="plant-image" accept="image/*" />
        </label>
        <p class="upload-hint">JPG or PNG, up to 5 MB. Added after the record is saved.</p>
      </div>

      <div class="plant-detail-main">
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
          <p class="detail-actions-hint">Editing or deleting affects this record and its photo.</p>
          <div class="detail-actions-buttons">
            <a class="btn" href="add-plant.html?id=${plantId}">Edit plant</a>
            <button type="button" class="btn-delete">Delete this plant</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
