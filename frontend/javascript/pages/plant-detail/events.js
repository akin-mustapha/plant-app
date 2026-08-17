import { deletePlant, uploadPlantImage } from "../../api/plant.js";
import { logActivity } from "../../api/activity.js";
import { setStatus } from "../../utils.js";

export function wireDeleteButton(plantId) {
  const deleteButton = document.querySelector(".icon-btn--delete");
  if (!deleteButton) return;

  deleteButton.addEventListener("click", () => {
    deletePlant(plantId)
      .then(() => {
        setStatus("Plant deleted successfully.");
        window.location.href = "../index.html";
      })
      .catch((error) => {
        setStatus(error.message || "Unable to delete plant.", true);
      });
  });
}

export function wireWaterButton(plantId, wateringTypeId) {
  const waterButton = document.querySelector(".icon-btn--water");
  if (!waterButton || wateringTypeId == null) return;

  waterButton.addEventListener("click", () => {
    waterButton.disabled = true;
    setStatus("Marking as watered...");

    logActivity(plantId, { activity_type_id: wateringTypeId })
      .then(() => {
        setStatus("Marked as watered today.");
        window.location.reload();
      })
      .catch((error) => {
        waterButton.disabled = false;
        setStatus(error.message || "Unable to log watering.", true);
      });
  });
}

export function wireImageUpload(plantId) {
  const plantImageInput = document.getElementById("plant-image");
  if (!plantImageInput) return;

  plantImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus("Uploading image...");
    uploadPlantImage(plantId, file)
      .then(() => {
        setStatus("Image uploaded successfully.");
        window.location.reload();
      })
      .catch((error) => {
        setStatus(error.message || "Unable to upload image.", true);
      });
  });
}
