import { fetchPlantById } from "../../api/plant.js";
import { fetchActivitiesByPlantId, fetchActivityTypes } from "../../api/activity.js";
import { setStatus, unwrap } from "../../utils.js";
import { renderPlantDetails } from "./render.js";
import { wireDeleteButton, wireImageUpload, wireWaterButton } from "./events.js";

const pathParams = new URLSearchParams(window.location.search);
const plantId = pathParams.get("id");

async function loadPlantDetails(id) {
  try {
    setStatus("Loading plant details...");
    const response = await fetchPlantById(id);
    const plant = unwrap(response);
    if (!plant) {
      setStatus("Plant not found.", true);
      return;
    }

    const [activities, activityTypes] = await Promise.all([
      fetchActivitiesByPlantId(id).catch(() => []),
      fetchActivityTypes().catch(() => []),
    ]);

    renderPlantDetails(plant, activities);
    wireDeleteButton(id);
    wireImageUpload(id);

    const wateringType = (activityTypes || []).find((type) => type.description === "Watering");
    wireWaterButton(id, wateringType?.activity_type_id);

    setStatus("");
  } catch (error) {
    setStatus(error.message || "Unable to load plant details.", true);
  }
}

if (plantId) {
  loadPlantDetails(plantId);
} else {
  setStatus("No plant ID provided in the URL.", true);
}
