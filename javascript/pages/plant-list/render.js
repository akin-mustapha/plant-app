import { escapeHtml } from "../../utils.js";

export function renderPlants(plants) {
  const listContainer = document.querySelector("[data-plant-list]");
  if (!listContainer) return;

  if (!Array.isArray(plants) || plants.length === 0) {
    listContainer.innerHTML = "<p>No plants found yet.</p>";
    return;
  }

  listContainer.innerHTML = plants
    .map((plant) => {
      const name = escapeHtml(plant.common_name || "Unnamed plant");
      const nickname = escapeHtml(plant.nick_name || "No nickname");
      const scientificName = escapeHtml(plant.scientific_name || "Unknown");
      const status = escapeHtml(plant.status || "unknown");
      const imageUrl = plant.image_url ? escapeHtml(plant.image_url) : "";

      return `
        <article class="plant-card">
          ${imageUrl ? `<img class="plant-image" src="${imageUrl}" alt="${name}">` : `<div class="plant-image"></div>`}
          <div class="plant-info">
            <h2>${name}</h2>
            <dl class="plant-fields">
              <div class="plant-field">
                <dt>Nickname</dt>
                <dd>${nickname}</dd>
              </div>
              <div class="plant-field">
                <dt>Status</dt>
                <dd>${status}</dd>
              </div>
              <div class="plant-field">
                <dt>Scientific Name</dt>
                <dd>${scientificName}</dd>
              </div>
            </dl>
            <div class="plant-actions">
              <a class="btn" href="plant.html?id=${encodeURIComponent(plant.plant_id)}">Show Details</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}
