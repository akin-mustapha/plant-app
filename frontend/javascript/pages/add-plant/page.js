import { createPlant, fetchPlantById, updatePlant } from "../../api/plant.js";
import { setStatus, unwrap } from "../../utils.js";
import { loadPlants } from "../plant-list/page.js";

const pathParams = new URLSearchParams(window.location.search);
const plantId = pathParams.get("id");

function setRadioValue(form, name, value) {
  const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function populateForm(form, plant) {
  form.common_name.value = plant.common_name || "";
  form.scientific_name.value = plant.scientific_name || "";
  form.nick_name.value = plant.nick_name || "";
  form.location.value = plant.location || "";
  form.window_direction.value = plant.preference?.window_direction || "";
  form.date_acquired.value = plant.date_acquired || "";
  setRadioValue(form, "status", plant.status || "healthy");
  form.notes.value = plant.notes || "";
  setRadioValue(form, "humidity", plant.preference?.humidity || "medium");
  form.temperature.value = plant.preference?.temperature || "";
  form.watering.value = plant.preference?.watering || "";
  form.light.value = plant.preference?.light || "brightIndirect";
  setRadioValue(form, "water_need", plant.preference?.water_need || "medium");
  form.avoid.value = plant.preference?.avoid || "";
  form.checkDaily.value = plant.routine?.checkDaily ? "on" : "";
  form.fertilizeFrequency.value = plant.routine?.fertilizeFrequency || "";
}

function renderFormSkeleton(form) {
  const skeleton = document.createElement("div");
  skeleton.className = "plant-form-skeleton";
  skeleton.dataset.formSkeleton = "";
  skeleton.innerHTML = `
    ${[3, 3].map(
      (fieldCount) => `
        <div>
          <div class="skel-line skel-section-label"></div>
          <div class="skel-grid">
            ${Array.from({ length: fieldCount })
              .map(
                (_, index) => `
                  <div class="skel-field${index === fieldCount - 1 ? " skel-field--span-2" : ""}">
                    <div class="skel-line skel-field-label"></div>
                    <div class="skel-block skel-field-input"></div>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `
    ).join("")}
    <div class="skel-actions">
      <div class="skel-block skel-button"></div>
      <div class="skel-block skel-button"></div>
    </div>
  `;

  form.style.display = "none";
  form.insertAdjacentElement("afterend", skeleton);
}

function removeFormSkeleton(form) {
  const skeleton = document.querySelector("[data-form-skeleton]");
  if (skeleton) skeleton.remove();
  form.style.display = "";
}

async function loadPlantForEdit(form) {
  try {
    renderFormSkeleton(form);
    const response = await fetchPlantById(plantId);
    const plant = unwrap(response);
    if (!plant) {
      setStatus("Plant not found.", true);
      return;
    }
    populateForm(form, plant);
    setStatus("");
  } catch (error) {
    setStatus(error.message || "Unable to load plant details.", true);
  } finally {
    removeFormSkeleton(form);
  }
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  return {
    common_name: data.common_name || "",
    scientific_name: data.scientific_name || "",
    location: data.location || "",
    nick_name: data.nick_name || "",
    date_acquired: data.date_acquired || "",
    status: data.status || "healthy",
    notes: data.notes || "",
    preference: {
      humidity: data.humidity || "medium",
      temperature: data.temperature || "",
      watering: data.watering || "",
      light: data.light || "brightIndirect",
      water_need: data.water_need || "medium",
      window_direction: data.window_direction || "",
      avoid: data.avoid || "",
    },
    routine: {
      checkDaily: data.checkDaily === "on",
      fertilizeFrequency: data.fertilizeFrequency || "",
    },
  };
}

async function handlePlantFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const originalText = submitButton?.textContent || "Submit";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = plantId ? "Saving..." : "Submitting...";
  }

  try {
    const plantData = getFormData(form);

    if (plantId) {
      await updatePlant(plantId, plantData);
      setStatus("Plant updated successfully.");
    } else {
      await createPlant(plantData);
      setStatus("Plant created successfully.");
      form.reset();
    }
    await loadPlants();
  } catch (error) {
    setStatus(error.message || "Unable to save plant.", true);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
}

const form = document.querySelector("[data-plant-form]");
if (form) {
  if (plantId) {
    const titleElement = document.querySelector("[data-form-title]");
    const submitButton = document.querySelector("[data-submit-button]");
    if (titleElement) titleElement.textContent = "Edit plant";
    if (submitButton) submitButton.textContent = "Save changes";
    loadPlantForEdit(form);
  }
  form.addEventListener("submit", handlePlantFormSubmit);
}
