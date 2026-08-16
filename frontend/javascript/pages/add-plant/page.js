import { createPlant, fetchPlantById, updatePlant } from "../../api/plant.js";
import { setStatus, unwrap } from "../../utils.js";
import { loadPlants } from "../plant-list/page.js";

const pathParams = new URLSearchParams(window.location.search);
const plantId = pathParams.get("id");

function populateForm(form, plant) {
  form.common_name.value = plant.common_name || "";
  form.scientific_name.value = plant.scientific_name || "";
  form.nick_name.value = plant.nick_name || "";
  form.location.value = plant.location || "";
  form.date_acquired.value = plant.date_acquired || "";
  form.status.value = plant.status || "healthy";
  form.notes.value = plant.notes || "";
  form.humidity.value = plant.preference?.humidity || "medium";
  form.temperature.value = plant.preference?.temperature || "";
  form.watering.value = plant.preference?.watering || "";
  form.light.value = plant.preference?.light || "brightIndirect";
  form.checkDaily.value = plant.routine?.checkDaily ? "on" : "";
  form.fertilizeFrequency.value = plant.routine?.fertilizeFrequency || "";
}

async function loadPlantForEdit(form) {
  try {
    setStatus("Loading plant details...");
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
