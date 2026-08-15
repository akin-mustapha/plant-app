import { fetchAllPlants } from "../../api/plant.js";
import { setStatus, unwrap } from "../../utils.js";
import { renderPlants } from "./render.js";

export async function loadPlants() {
  try {
    setStatus("Loading plants...");
    const response = await fetchAllPlants();
    const plants = unwrap(response);
    renderPlants(plants);
    setStatus("");
  } catch (error) {
    setStatus(error.message || "Unable to load plants.", true);
  }
}

if (document.querySelector("[data-plant-list]")) {
  loadPlants();
}
