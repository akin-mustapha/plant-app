import { escapeHtml } from "../../utils.js";

export function renderPlantDetails(plant) {
  const detailsContainer = document.querySelector(".data-plant-details");

  if (!plant) {
    detailsContainer.innerHTML = "<p>Plant not found.</p>";
    return;
  }

  const name = escapeHtml(plant.common_name || "Unnamed plant");
  const nickname = escapeHtml(plant.nick_name || "No nickname");
  const scientificName = escapeHtml(plant.scientific_name || "Unknown");
  const status = escapeHtml(plant.status || "unknown");
  const location = escapeHtml(plant.location || "Unknown");
  const dateAcquired = escapeHtml(plant.date_acquired || "Unknown");
  const notes = escapeHtml(plant.notes || "No notes available.");
  const humidityPreference = escapeHtml(plant.preference?.humidity || "Unknown");
  const temperaturePreference = escapeHtml(plant.preference?.temperature || "Unknown");
  const wateringPreference = escapeHtml(plant.preference?.watering || "Unknown");
  const lightPreference = escapeHtml(plant.preference?.light || "Unknown");
  const checkDaily = plant.routine?.checkDaily ? "Yes" : "No";
  const fertilizeFrequency = escapeHtml(plant.routine?.fertilizeFrequency || "Unknown");

  detailsContainer.innerHTML = `
    <div class="plant-info">
    <h2>${name}</h2>
    <label for="plant-image">Upload Plant Image:</label>
    <input type="file" id="plant-image" name="plant-image" accept="image/*" />
    <ul>
      <li>Nickname: ${nickname}</li>
      <li>Status: ${status}</li>
      <li>Scientific Name: ${scientificName}</li>
      <li>Location: ${location}</li>
      <li>Date Acquired: ${dateAcquired}</li>
      <li>Notes: ${notes}</li>
      <li>Humidity Preference: ${humidityPreference}</li>
      <li>Temperature Preference: ${temperaturePreference}</li>
      <li>Watering Preference: ${wateringPreference}</li>
      <li>Light Preference: ${lightPreference}</li>
      <li>Check Daily: ${checkDaily}</li>
      <li>Fertilize Frequency: ${fertilizeFrequency}</li>
    </ul>

    <button class="btn-delete"> Delete Plant</button>
    </div>
  `;
}
