import { createPlant, fetchAllPlants } from "./api/plant.js";
import { escapeHtml, setStatus, unwrap } from "./utils.js";
import { fetchPlantById, deletePlant} from "./api/plant.js";


const pathParams = new URLSearchParams(window.location.search);
const plantId = pathParams.get("id");


function renderPlantDetails(plant) {
  console.log("Rendering plant details:", plant.plant_id);
  const detailsContainer = document.querySelector(".data-plant-details");

  if (!plant) {
    detailsContainer.innerHTML = "<p>Plant not found.</p>";
    return;
  }

  const name = escapeHtml(plant.common_name || "Unnamed plant");
  const nickname = escapeHtml(plant.nick_name || "No nickname");
  const scientificName = escapeHtml(plant.scientificName || plant.scientific_name || "Unknown");
  const status = escapeHtml(plant.status || "unknown");
  const location = escapeHtml(plant.location || "Unknown");
  const dateAcquired = escapeHtml(plant.date_Acquired || "Unknown");
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

  const plant_delete_btn = document.querySelector(".btn-delete");
  console.log("Delete button element:", plant_delete_btn);

  if (plant_delete_btn) {
    plant_delete_btn.addEventListener("click", () => {
      console.log("Delete button clicked for plant ID:", plantId);
      deletePlant(plantId)
        .then(() => {
          setStatus("Plant deleted successfully.");
          window.location.href = "plants.html"; // Redirect to the main page after deletion
        })
        .catch((error) => {
          setStatus(error.message || "Unable to delete plant.", true);
        });
    });
  }
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
  console.log("Plant ID found in URL:", plantId);
  loadPlantDetails(plantId);
} else {
  setStatus("No plant ID provided in the URL.", true);
}
