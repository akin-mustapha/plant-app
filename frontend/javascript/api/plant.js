import client from "./client.js";

export async function fetchAllPlants() {
  const {data} = await client.get("/plants");
  return data;
}


export async function fetchPlantById(id) {
  const {data} = await client.get(`/plants/${id}`);
  return data;
}

export async function createPlant(plant) {
  const {data} = await client.post("/plants", plant);
  return data;
}

export async function updatePlant(id, plant) {
  const {data} = await client.put(`/plants/${id}`, plant);
  return data;
}

export async function deletePlant(id) {
  const {data} = await client.delete(`/plants/${id}`);
  return data;
}


export async function uploadPlantImage(id, imageFile) {
  const contentType = imageFile.type || "image/jpeg";

  const { data } = await client.post(`/plants/${id}/image/upload-url`, {
    plant_id: id,
    file_name: imageFile.name,
    content_type: contentType,
  });
  const { uploadUrl, key } = data;

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: imageFile,
  });

  if (!uploadResponse.ok) {
    throw new Error("Unable to upload image to storage.");
  }

  const { data: confirmation } = await client.post(`/plants/${id}/image/confirm`, {
    plant_id: id,
    key,
  });
  return confirmation;
}