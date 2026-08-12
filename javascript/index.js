import { createPlant, fetchAllPlants } from "./api/plant.js";
import { escapeHtml, setStatus, unwrap } from "./utils.js";


// function Plant(common_name, scientific_name, location, nick_name, date_acquired, status, notes, preference, routine) {
//   this.common_name = common_name;
//   this.scientific_name = scientific_name;
//   this.location = location;
//   this.nickname = nick_name;
//   this.dateAcquired = date_acquired;
//   this.status = status;
//   this.notes = notes;
//   this.routine = routine;
//   this.preference = preference;
// }

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
    submitButton.textContent = "Submitting...";
  }


  try {
    const plantData = getFormData(form);

    await createPlant(plantData);
    console.log(plantData);

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

const form = document.querySelector("[data-plant-form]");
if (form) {
  form.addEventListener("submit", handlePlantFormSubmit);
}