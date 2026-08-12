import { createPlant, fetchAllPlants } from "./api/plant.js";
import { escapeHtml, setStatus, unwrap } from "./utils.js";
import { fetchPlantById } from "./api/plant.js";


const pathParams = new URLSearchParams(window.location.search);
const plantId = pathParams.get("id");


function renderPlantDetails(plant) {
  const detailsContainer = document.querySelector(".data-plant-details");
  console.log("Rendering plant details:", plant);
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
      <li>Humidity Preference: ${escapeHtml(plant.preference?.humidity || "Unknown")}</li>
      <li>Temperature Preference: ${escapeHtml(plant.preference?.temperature || "Unknown")}</li>
      <li>Watering Preference: ${escapeHtml(plant.preference?.watering || "Unknown")}</li>
      <li>Light Preference: ${escapeHtml(plant.preference?.light || "Unknown")}</li>
      <li>Check Daily: ${plant.routine?.checkDaily ? "Yes" : "No"}</li>
      <li>Fertilize Frequency: ${escapeHtml(plant.routine?.fertilizeFrequency || "Unknown")}</li>
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


if (plantId) {
  loadPlantDetails(plantId);
} else {
  setStatus("No plant ID provided in the URL.", true);
}

// const plant_detail_btn = document.querySelector("[data-plant-detail-btn]");

// if (plant_detail_btn) {
//   plant_detail_btn.addEventListener("click", () => {
//     handlePlantDetailButtonClick();
//   });
// }