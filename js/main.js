(() => {
  const WHATSAPP_NUMBER = "5531996154698";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupSmoothScroll();
    setupContactForm();
    injectCatalogMediaPlaceholders();
    setupRevealAnimation();
    injectWhatsAppFloat();
    updateFooterYear();
  });

  function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (!toggle || !nav) {
      return;
    }

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      nav.classList.toggle("is-open", !isExpanded);
    });

    nav.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 920) {
        closeMenu();
      }
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const hash = anchor.getAttribute("href");
        if (!hash || hash.length < 2) {
          return;
        }

        const target = document.querySelector(hash);
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", hash);
      });
    });
  }

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");

    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const nome = String(data.get("nome") || "").trim();
      const telefone = String(data.get("telefone") || "").trim();
      const interesse = String(data.get("interesse") || "").trim();
      const mensagem = String(data.get("mensagem") || "").trim();

      const body = [
        "Olá, DoSim! Vim pelo site e quero atendimento.",
        "",
        `Nome: ${nome}`,
        `Telefone: ${telefone}`,
        `Interesse: ${interesse}`,
        `Mensagem: ${mensagem}`,
      ].join("\n");

      window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }

  function setupRevealAnimation() {
    const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!revealTargets.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealTargets.forEach((element) => observer.observe(element));
  }

  function injectCatalogMediaPlaceholders() {
    if (!document.querySelector("[data-catalog-page]")) {
      return;
    }

    const catalogCards = document.querySelectorAll(".catalog-card");

    if (!catalogCards.length) {
      return;
    }

    catalogCards.forEach((card) => {
      if (card.querySelector(".catalog-media")) {
        return;
      }

      const media = document.createElement("div");
      media.className = "catalog-media";
      const photoSrc = card.getAttribute("data-photo-src");

      if (photoSrc) {
        const image = document.createElement("img");
        const cardTitle = card.querySelector(".card-title")?.textContent?.trim();
        image.src = photoSrc;
        image.loading = "lazy";
        image.alt = card.getAttribute("data-photo-alt") || (cardTitle ? `Foto do produto ${cardTitle}` : "Foto do produto DoSim");
        media.appendChild(image);
      } else {
        media.innerHTML = "<span>Foto 4:5</span>";
      }

      card.prepend(media);
    });
  }

  function injectWhatsAppFloat() {
    if (document.querySelector(".whatsapp-float")) {
      return;
    }

    const floatingLink = document.createElement("a");
    floatingLink.className = "whatsapp-float";
    floatingLink.href = `${WHATSAPP_URL}?text=${encodeURIComponent("Olá, DoSim! Quero atendimento.")}`;
    floatingLink.target = "_blank";
    floatingLink.rel = "noopener noreferrer";
    floatingLink.setAttribute("aria-label", "Conversar no WhatsApp");
    floatingLink.textContent = "WhatsApp";
    document.body.appendChild(floatingLink);
  }

  function updateFooterYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = year;
    });
  }
})();
