import { fetchAllPlants } from "../../api/plant.js";
import { setStatus, unwrap } from "../../utils.js";
import { renderPlants, statusClass } from "./render.js";

let currentPlants = [];
let currentFilter = "all";

function updateFilterCounts(plants) {
  const filterBar = document.querySelector("[data-status-filters]");
  if (!filterBar) return;

  const counts = { all: plants.length, healthy: 0, sick: 0, dead: 0 };
  plants.forEach((plant) => {
    counts[statusClass(plant.status)] += 1;
  });

  filterBar.querySelectorAll("[data-filter]").forEach((button) => {
    const countEl = button.querySelector("[data-count]");
    if (countEl) countEl.textContent = counts[button.dataset.filter] ?? 0;
  });
}

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
    updateFilterCounts(currentPlants);
    setStatus("");
  } catch (error) {
    setStatus(error.message || "Unable to load plants.", true);
  }
}

if (document.querySelector("[data-plant-list]")) {
  wireStatusFilters();
  loadPlants();
}
