const API_BASE_URL = "https://25gqp3p1vi.execute-api.eu-west-1.amazonaws.com/dev";

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

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (payload && payload.message) || response.statusText || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

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