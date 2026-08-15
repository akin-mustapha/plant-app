import { deletePlant, uploadPlantImage } from "../../api/plant.js";
import { setStatus } from "../../utils.js";

export function wireDeleteButton(plantId) {
  const deleteButton = document.querySelector(".btn-delete");
  if (!deleteButton) return;

  deleteButton.addEventListener("click", () => {
    deletePlant(plantId)
      .then(() => {
        setStatus("Plant deleted successfully.");
        window.location.href = "plants.html";
      })
      .catch((error) => {
        setStatus(error.message || "Unable to delete plant.", true);
      });
  });
}

export function wireImageUpload(plantId) {
  const plantImageInput = document.getElementById("plant-image");
  if (!plantImageInput) return;

  plantImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    uploadPlantImage(plantId, file)
      .then((response) => {
        setStatus("Image uploaded successfully.");
      })
      .catch((error) => {
        setStatus(error.message || "Unable to upload image.", true);
      });
  });
}
