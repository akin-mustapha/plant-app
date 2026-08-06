const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://3y5seu5e00.execute-api.eu-west-1.amazonaws.com/dev";

async function request(path, options = {}) {
  const { headers: customHeaders, ...restOptions } = options;

  const headers = { ...customHeaders };
  if (restOptions.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(errorText || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? response.status === 204
      ? null
      : await response.json()
    : await response.text();

  return {
    data: payload,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}

const apiClient = {
  get: (path, config = {}) => request(path, { ...config, method: "GET" }),
  post: (path, body, config = {}) =>
    request(path, { ...config, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, config = {}) =>
    request(path, { ...config, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, config = {}) => request(path, { ...config, method: "DELETE" }),
};

export default apiClient;