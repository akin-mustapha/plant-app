import { createPlant, fetchAllPlants } from "./api/plant.js";

function getFormData(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  return {
    name: data.name || "",
    scientificName: data.scientific || "",
    location: data.location || "",
    nickname: data.nickname || "",
    dateAcquired: data.dateAcquired || "",
    status: data.status || "healthy",
    notes: data.notes || "",
    preference: {
      humidity: data.humidity || "medium",
      temperature: data.temperature || "",
      watering: data.watering || "",
      light: data.light || "brightIndirect",
    },
    routine: {
      checkDaily: data.checkDaily === "on",
      fertilizeFrequency: data.fertilizeFrequency || "",
    },
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setStatus(message, isError = false) {
  const statusElement = document.querySelector("[data-status-message]");
  if (!statusElement) return;

  statusElement.textContent = message;
  statusElement.classList.toggle("status--error", isError);
  statusElement.classList.toggle("status--success", !isError && !!message);
}

// apiClient.get/post return { data, status, statusText, headers }.
// Unwrap defensively in case api/plant.js changes what it returns.
function unwrap(response) {
  return response && typeof response === "object" && "data" in response
    ? response.data
    : response;
}

async function handlePlantFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const originalText = submitButton?.textContent || "Submit";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
  }

  try {
    const plantData = getFormData(form);
    await createPlant(plantData);
    setStatus("Plant created successfully.");
    form.reset();
    await loadPlants();
  } catch (error) {
    setStatus(error.message || "Unable to create plant.", true);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
}

function renderPlants(plants) {
  const listContainer = document.querySelector("[data-plant-list]");
  if (!listContainer) return;

  if (!Array.isArray(plants) || plants.length === 0) {
    listContainer.innerHTML = "<p>No plants found yet.</p>";
    return;
  }

  listContainer.innerHTML = plants
    .map((plant) => {
      const name = escapeHtml(plant.name || "Unnamed plant");
      const nickname = escapeHtml(plant.nickname || "No nickname");
      const scientificName = escapeHtml(
        plant.scientificName || plant.scientific || "Unknown"
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
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadPlants() {
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

const form = document.querySelector("[data-plant-form]");
if (form) {
  form.addEventListener("submit", handlePlantFormSubmit);
}

if (document.querySelector("[data-plant-list]")) {
  loadPlants();
}