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
      const scientificName = escapeHtml(
        plant.scientificName || plant.scientific_name || "Unknown"
      );
      const status = escapeHtml(plant.status || "unknown");

      return `
        <article class="plant-card">
          <div class="plant-info">
            <h2>${name}</h2>
            <ul>
              <li>Nickname: ${nickname}</li>
              <li>Status: ${status}</li>
              <li>Scientific Name: ${scientificName}</li>
            </ul>
            <div class="plant-actions">
              <a class="btn" href="plant.html?id=${encodeURIComponent(plant.plant_id)}">Show Details</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}
