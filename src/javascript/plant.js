import { createPlant, fetchAllPlants } from "./api/plant.js";
import { escapeHtml, setStatus, unwrap } from "./utils.js";


function renderPlantDetails(plant) {
  const detailsContainer = document.querySelector("[data-plant-details]");
  if (!detailsContainer) return;

  if (!plant) {
    detailsContainer.innerHTML = "<p>Plant not found.</p>";
    return;
  }

  const name = escapeHtml(plant.common_name || "Unnamed plant");
  const nickname = escapeHtml(plant.nick_name || "No nickname");
  const scientificName = escapeHtml(
    plant.scientificName || plant.scientific_name || "Unknown"
  );
  const status = escapeHtml(plant.status || "unknown");
  const location = escapeHtml(plant.location || "Unknown");
  const dateAcquired = escapeHtml(plant.date_Acquired || "Unknown");
  const notes = escapeHtml(plant.notes || "No notes available.");

  detailsContainer.innerHTML = `
    <h2>${name}</h2>
    <ul>
      <li>Nickname: ${nickname}</li>
      <li>Status: ${status}</li>
      <li>Scientific Name: ${scientificName}</li>
      <li>Location: ${location}</li>
      <li>Date Acquired: ${dateAcquired}</li>
      <li>Notes: ${notes}</li>
    </ul>
  `;
};


async function loadPlantDetails(id) {
  try {
    setStatus("Loading plant details...");
    const response = await fetchPlantById(id);
    const plant = unwrap(response);
    if (!plant) {
      setStatus("Plant not found.", true);
      return;
    }
    renderPlantDetails(plant);
    setStatus("");
  } catch (error) {
    setStatus(error.message || "Unable to load plant details.", true);
  }
} 


const plant_detail_btn = document.querySelector("[data-plant-detail-btn]");

if (plant_detail_btn) {
  plant_detail_btn.addEventListener("click", () => {
    handlePlantDetailButtonClick();
  });
}