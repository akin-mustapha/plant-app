import { deletePlant, uploadPlantImage } from "../../api/plant.js";
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

export function wireWaterButton(plantId) {
  const waterButton = document.querySelector(".icon-btn--water");
  if (!waterButton) return;

  waterButton.addEventListener("click", () => {
    // UI-only for now — no watering endpoint yet.
    setStatus("Marked as watered today.");
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
