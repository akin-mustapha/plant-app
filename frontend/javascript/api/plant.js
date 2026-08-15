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
  const formData = new FormData();
  formData.append("image", imageFile);

  const {data} = await client.post(`/plants/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}