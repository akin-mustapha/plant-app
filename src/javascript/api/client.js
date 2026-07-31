import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://3y5seu5e00.execute-api.eu-west-1.amazonaws.com/dev/plants",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;