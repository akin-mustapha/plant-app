export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function setStatus(message, isError = false) {
  const statusElement = document.querySelector("[data-status-message]");
  if (!statusElement) return;

  statusElement.textContent = message;
  statusElement.classList.toggle("status--error", isError);
  statusElement.classList.toggle("status--success", !isError && !!message);
}

let notificationTimer = null;

export function showNotification(message, isError = false, duration = 4000) {
  let notificationElement = document.querySelector("[data-notification]");
  if (!notificationElement) {
    notificationElement = document.createElement("div");
    notificationElement.setAttribute("data-notification", "");
    notificationElement.setAttribute("role", "status");
    notificationElement.setAttribute("aria-live", "polite");
    document.body.prepend(notificationElement);
  }

  notificationElement.innerHTML = `<span class="notification-dot"></span>${escapeHtml(message)}`;
  notificationElement.classList.toggle("notification--error", isError);
  notificationElement.classList.add("notification--visible");

  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    notificationElement.classList.remove("notification--visible");
  }, duration);
}

export // apiClient.get/post return { data, status, statusText, headers }.
// Unwrap defensively in case api/plant.js changes what it returns.
function unwrap(response) {
  return response && typeof response === "object" && "data" in response
    ? response.data
    : response;
}