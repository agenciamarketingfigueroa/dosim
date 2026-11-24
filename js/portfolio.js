(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
    const items = Array.from(document.querySelectorAll(".portfolio-item"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");

    if (!items.length) {
      return;
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = (button.dataset.filter || "todos").toLowerCase();

        filterButtons.forEach((chip) => {
          chip.classList.toggle("is-active", chip === button);
          chip.setAttribute("aria-pressed", String(chip === button));
        });

        items.forEach((item) => {
          const tags = (item.dataset.tags || "")
            .toLowerCase()
            .split(",")
            .map((value) => value.trim());
          const match = filter === "todos" || tags.includes(filter);

          item.classList.toggle("is-hidden", !match);
          item.toggleAttribute("hidden", !match);
        });
      });
    });

    items.forEach((item) => {
      item.addEventListener("click", () => {
        if (!lightbox || !lightboxImage || !lightboxCaption) {
          return;
        }

        lightboxImage.src = item.dataset.image || "";
        lightboxImage.alt = item.dataset.alt || "Imagem ampliada do portfólio DoSim";
        lightboxCaption.textContent = item.dataset.title || "Portfólio DoSim";

        lightbox.showModal();
        document.body.classList.add("lock-scroll");
        lightboxClose?.focus();
      });
    });

    lightboxClose?.addEventListener("click", () => lightbox.close());
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox?.addEventListener("close", () => {
      document.body.classList.remove("lock-scroll");
      lightboxImage.removeAttribute("src");
    });
  });
})();
