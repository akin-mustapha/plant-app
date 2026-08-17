import { deletePlant, uploadPlantImage } from "../../api/plant.js";
import { logActivity } from "../../api/activity.js";
import { setStatus, showNotification } from "../../utils.js";
import { confirmModal } from "../../modal.js";

export function wireDeleteButton(plantId, plantLabel = "this plant") {
  const deleteButton = document.querySelector(".icon-btn--delete");
  if (!deleteButton) return;

  deleteButton.addEventListener("click", async () => {
    const confirmed = await confirmModal({
      title: "Delete this plant?",
      message: `This removes ${plantLabel}'s record and photo permanently. This can't be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    deletePlant(plantId)
      .then(() => {
        sessionStorage.setItem("notification", `${plantLabel} deleted successfully.`);
        window.location.href = "../index.html";
      })
      .catch((error) => {
        showNotification(error.message || "Unable to delete plant.", true);
      });
  });
}

export function wireWaterButton(plantId, wateringTypeId, plantLabel = "this plant") {
  const waterButton = document.querySelector(".icon-btn--water");
  if (!waterButton || wateringTypeId == null) return;

  waterButton.addEventListener("click", async () => {
    const confirmed = await confirmModal({
      title: "Mark as watered?",
      message: `This logs today in ${plantLabel}'s watering history.`,
      confirmLabel: "Confirm",
      variant: "primary",
    });
    if (!confirmed) return;

    waterButton.disabled = true;
    setStatus("");

    logActivity(plantId, { activity_type_id: wateringTypeId })
      .then(() => {
        sessionStorage.setItem("notification", `Watered ${plantLabel} — logged for today.`);
        window.location.reload();
      })
      .catch((error) => {
        waterButton.disabled = false;
        showNotification(error.message || "Unable to log watering.", true);
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
