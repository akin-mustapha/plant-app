export function confirmModal({ title, message, confirmLabel, cancelLabel = "Cancel", variant = "default" }) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title" class="modal-title">${title}</h3>
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
          <button type="button" class="btn modal-btn-cancel">${cancelLabel}</button>
          <button type="button" class="btn modal-btn-confirm modal-btn-confirm--${variant}">${confirmLabel}</button>
        </div>
      </div>
    `;

    function close(result) {
      document.removeEventListener("keydown", onKeydown);
      overlay.remove();
      resolve(result);
    }

    function onKeydown(event) {
      if (event.key === "Escape") close(false);
    }

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close(false);
    });
    overlay.querySelector(".modal-btn-cancel").addEventListener("click", () => close(false));
    overlay.querySelector(".modal-btn-confirm").addEventListener("click", () => close(true));

    document.addEventListener("keydown", onKeydown);
    document.body.appendChild(overlay);
    overlay.querySelector(".modal-btn-confirm").focus();
  });
}
