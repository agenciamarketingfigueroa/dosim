(() => {
  const WHATSAPP_NUMBER = "5531996154698";
  const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupSmoothScroll();
    updateFooterYear();
    injectWhatsAppButton();
    renderHomeHighlights();
  });

  function setupMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (!menuToggle || !nav) {
      return;
    }

    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 860) {
        closeMenu();
      }
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId.length < 2) {
          return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", targetId);
      });
    });
  }

  function updateFooterYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = year;
    });
  }

  function injectWhatsAppButton() {
    if (document.querySelector(".whatsapp-float")) {
      return;
    }

    const message = "Olá, DoSim Confeitaria! Quero um orçamento.";
    const button = document.createElement("a");
    button.className = "whatsapp-float";
    button.href = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "Conversar no WhatsApp");
    button.innerHTML = "<span>WhatsApp</span>";
    document.body.appendChild(button);
  }

  function renderHomeHighlights() {
    const container = document.getElementById("destaques-list");

    if (!container) {
      return;
    }

    const money = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    fetch("data/precos.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar preços.");
        }
        return response.json();
      })
      .then((items) => {
        const highlights = items.filter((item) => item.destaque).slice(0, 3);

        if (!highlights.length) {
          container.innerHTML =
            '<p class="text-small">Destaques em atualização. Fale no WhatsApp para receber as opções atuais.</p>';
          return;
        }

        container.innerHTML = highlights
          .map(
            (item) => `
              <article class="card">
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <p class="destaque-value">${money.format(item.precoVenda)}</p>
                <a
                  class="btn btn-secondary"
                  href="${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
                    `Olá, DoSim Confeitaria! Quero orçamento do item ${item.nome}.`
                  )}"
                  target="_blank"
                  rel="noopener noreferrer"
                >Quero este</a>
              </article>
            `
          )
          .join("");
      })
      .catch(() => {
        container.innerHTML =
          '<p class="text-small">Não foi possível carregar os destaques agora. Chame no WhatsApp para receber o catálogo.</p>';
      });
  }
})();
