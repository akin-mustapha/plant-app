import { fetchAllPlants } from "../../api/plant.js";
import { setStatus, unwrap } from "../../utils.js";
import { renderPlants } from "./render.js";

let currentPlants = [];
let currentFilter = "all";

function wireStatusFilters() {
  const filterBar = document.querySelector("[data-status-filters]");
  if (!filterBar) return;

  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    currentFilter = button.dataset.filter;
    filterBar
      .querySelectorAll(".status-filter")
      .forEach((el) => el.classList.toggle("active", el === button));
    renderPlants(currentPlants, currentFilter);
  });
}

export async function loadPlants() {
  try {
    setStatus("Loading plants...");
    const response = await fetchAllPlants();
    const plants = unwrap(response);
    currentPlants = Array.isArray(plants) ? plants : [];
    renderPlants(currentPlants, currentFilter);
    setStatus("");
  } catch (error) {
    setStatus(error.message || "Unable to load plants.", true);
  }
}

if (document.querySelector("[data-plant-list]")) {
  wireStatusFilters();
  loadPlants();
}
