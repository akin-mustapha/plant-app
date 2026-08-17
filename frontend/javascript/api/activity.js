import client from "./client.js";

export async function fetchActivityTypes() {
  const {data} = await client.get("/activity-types");
  return data;
}

export async function fetchActivitiesByPlantId(plantId) {
  const {data} = await client.get(`/plants/${plantId}/activities`);
  return data;
}

export async function logActivity(plantId, activity) {
  const {data} = await client.post(`/plants/${plantId}/activities`, activity);
  return data;
}

export async function deleteActivity(plantId, activityId) {
  const {data} = await client.delete(`/plants/${plantId}/activities/${activityId}`);
  return data;
}
