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
      console.log("Rendering plant:", plant);
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
              <a href="plant.html?id=${encodeURIComponent(plant.id)}">Show Details</a>
            </div>
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

const form = document.querySelector("[data-plant-form]");
if (form) {
  form.addEventListener("submit", handlePlantFormSubmit);
}

if (document.querySelector("[data-plant-list]")) {
  loadPlants();
}

const plant_detail_btn = document.querySelector("[data-plant-detail-btn]");

if (plant_detail_btn) {
  plant_detail_btn.addEventListener("click", () => {
    handlePlantDetailButtonClick();
  });
}

