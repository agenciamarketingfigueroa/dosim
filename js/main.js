(() => {
  const WHATSAPP_NUMBER = "5531996154698";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
  const CART_STORAGE_KEY = "dosim_cart_v1";

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupSmoothScroll();
    setupContactForm();
    injectCatalogMediaPlaceholders();
    setupCatalogWhatsAppCart();
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

  function setupCatalogWhatsAppCart() {
    const navList = document.querySelector(".site-nav ul");
    if (!navList) {
      return;
    }

    let cartOpenButton = navList.querySelector("[data-cart-open]");
    if (!cartOpenButton) {
      const cartNavItem = document.createElement("li");
      cartNavItem.className = "cart-nav-item";
      cartNavItem.innerHTML = `
        <button class="cart-nav-btn" type="button" data-cart-open aria-label="Abrir carrinho">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 6h14l-1.35 7.1a1 1 0 0 1-.98.8H9.3a1 1 0 0 1-.98-.8L6.7 4H3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="10.2" cy="18.4" r="1.4" fill="currentColor" />
            <circle cx="17.4" cy="18.4" r="1.4" fill="currentColor" />
          </svg>
          <span class="cart-nav-count" data-cart-count>0</span>
        </button>
      `;
      navList.appendChild(cartNavItem);
      cartOpenButton = cartNavItem.querySelector("[data-cart-open]");
    }

    if (document.querySelector("[data-cart-drawer]")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.setAttribute("data-cart-overlay", "");
    overlay.hidden = true;

    const drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("data-cart-drawer", "");
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <h2 class="cart-drawer-title">Seu carrinho</h2>
        <button class="cart-close" type="button" data-cart-close aria-label="Fechar carrinho">Fechar</button>
      </div>
      <div class="cart-drawer-body">
        <p class="cart-empty" data-cart-empty>Seu carrinho está vazio.</p>
        <ul class="cart-items" data-cart-items></ul>
      </div>
      <div class="cart-drawer-footer">
        <p class="cart-total" data-cart-total>0 item(ns)</p>
        <a class="btn btn-primary btn-block cart-whatsapp-btn" href="#" data-cart-submit>Fazer pedido no WhatsApp</a>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    let cartFloatButton = document.querySelector("[data-cart-float-open]");
    if (!cartFloatButton) {
      cartFloatButton = document.createElement("button");
      cartFloatButton.className = "cart-float";
      cartFloatButton.type = "button";
      cartFloatButton.setAttribute("data-cart-float-open", "");
      cartFloatButton.setAttribute("aria-label", "Abrir carrinho");
      cartFloatButton.hidden = true;
      cartFloatButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 6h14l-1.35 7.1a1 1 0 0 1-.98.8H9.3a1 1 0 0 1-.98-.8L6.7 4H3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="10.2" cy="18.4" r="1.4" fill="currentColor" />
          <circle cx="17.4" cy="18.4" r="1.4" fill="currentColor" />
        </svg>
        <span class="cart-float-count" data-cart-float-count>0</span>
        <span class="sr-only">Abrir carrinho</span>
      `;
      document.body.appendChild(cartFloatButton);
    }

    const counters = Array.from(document.querySelectorAll("[data-cart-count]"));
    const cartFloatCount = cartFloatButton.querySelector("[data-cart-float-count]");
    if (cartFloatCount) {
      counters.push(cartFloatCount);
    }
    const emptyMessage = drawer.querySelector("[data-cart-empty]");
    const itemsList = drawer.querySelector("[data-cart-items]");
    const totalLabel = drawer.querySelector("[data-cart-total]");
    const submitButton = drawer.querySelector("[data-cart-submit]");
    const closeButton = drawer.querySelector("[data-cart-close]");

    let cartItems = loadCartItems();

    const slugify = (value) =>
      value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

    const extractCardImageData = (card, fallbackName = "") => {
      if (!(card instanceof Element)) {
        return { imageSrc: "", imageAlt: fallbackName ? `Foto do produto ${fallbackName}` : "Foto do produto DoSim" };
      }

      const image = card.querySelector(".catalog-media img");
      if (image instanceof HTMLImageElement) {
        const src = normalizeText(image.getAttribute("src"));
        if (src) {
          const altText = normalizeText(image.getAttribute("alt")) || (fallbackName ? `Foto do produto ${fallbackName}` : "Foto do produto DoSim");
          return { imageSrc: src, imageAlt: altText };
        }
      }

      const dataSrc = normalizeText(card.getAttribute("data-photo-src"));
      const dataAlt = normalizeText(card.getAttribute("data-photo-alt"));
      return {
        imageSrc: dataSrc,
        imageAlt: dataAlt || (fallbackName ? `Foto do produto ${fallbackName}` : "Foto do produto DoSim"),
      };
    };

    const brlFormatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const parsePriceValue = (priceText) => {
      if (typeof priceText !== "string") {
        return null;
      }

      const normalized = priceText
        .replace(/\s/g, "")
        .replace(/R\$/gi, "")
        .replace(/\./g, "")
        .replace(",", ".");

      const match = normalized.match(/-?\d+(\.\d+)?/);
      if (!match) {
        return null;
      }

      const value = Number.parseFloat(match[0]);
      return Number.isFinite(value) ? value : null;
    };

    const formatCurrency = (value) => brlFormatter.format(value);
    const SELECT_QTY_LIMIT = 10;
    const clampQty = (value) => {
      const parsed = Number.parseInt(String(value), 10);
      if (Number.isNaN(parsed)) {
        return 1;
      }

      return Math.max(1, parsed);
    };

    const useCustomQty = (qty) => qty > SELECT_QTY_LIMIT;

    const buildQtySelectOptions = (qty) => {
      const normalizedQty = clampQty(qty);
      const hasCustom = useCustomQty(normalizedQty);
      const baseOptions = Array.from({ length: SELECT_QTY_LIMIT }, (_, index) => {
        const value = index + 1;
        return `<option value="${value}" ${!hasCustom && normalizedQty === value ? "selected" : ""}>${value}</option>`;
      }).join("");

      return `${baseOptions}<option value="custom" ${hasCustom ? "selected" : ""}>Mais de ${SELECT_QTY_LIMIT}</option>`;
    };

    const getCartTotals = () =>
      cartItems.reduce(
        (summary, item) => {
          const unitPrice = parsePriceValue(item.price);
          if (unitPrice === null) {
            summary.hasUnpricedItems = true;
            return summary;
          }

          summary.totalValue += unitPrice * item.qty;
          return summary;
        },
        { totalValue: 0, hasUnpricedItems: false }
      );

    const saveCartItems = () => {
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch {
        // Ignore storage errors and keep cart working for current session.
      }
    };

    const openCart = () => {
      const toggle = document.querySelector(".menu-toggle");
      const nav = document.querySelector(".site-nav");
      if (toggle && nav) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }

      overlay.hidden = false;
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      cartFloatButton.classList.remove("is-visible");
    };

    const closeCart = () => {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        if (!drawer.classList.contains("is-open")) {
          overlay.hidden = true;
          const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
          const shouldShowFloat = totalItems > 0;
          cartFloatButton.hidden = !shouldShowFloat;
          cartFloatButton.classList.toggle("is-visible", shouldShowFloat);
        }
      }, 200);
    };

    const updateCartSummary = () => {
      const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
      const cartTotals = getCartTotals();
      counters.forEach((counter) => {
        counter.textContent = String(totalItems);
      });
      if (!totalItems) {
        cartFloatButton.hidden = true;
        cartFloatButton.classList.remove("is-visible");
      }

      if (!cartItems.length) {
        itemsList.innerHTML = "";
        emptyMessage.hidden = false;
        totalLabel.textContent = `0 item(ns) | Total: ${formatCurrency(0)}`;
        submitButton.setAttribute("aria-disabled", "true");
        return false;
      }

      emptyMessage.hidden = true;
      submitButton.removeAttribute("aria-disabled");
      totalLabel.textContent = cartTotals.hasUnpricedItems
        ? `${cartItems.length} produto(s), ${totalItems} item(ns) | Total parcial: ${formatCurrency(cartTotals.totalValue)}`
        : `${cartItems.length} produto(s), ${totalItems} item(ns) | Total: ${formatCurrency(cartTotals.totalValue)}`;
      return true;
    };

    const renderCart = (customQtyFocusIndex = null) => {
      const hasItems = updateCartSummary();
      if (!hasItems) {
        itemsList.innerHTML = "";
        return;
      }

      itemsList.innerHTML = cartItems
        .map(
          (item, index) => {
            const imageSrc = normalizeText(item.imageSrc);
            const imageAlt = normalizeText(item.imageAlt) || `Foto do produto ${item.name}`;
            const itemPrice = normalizeText(item.price);

            return `
            <li class="cart-item">
              <div class="cart-item-top">
                <div class="cart-item-media">
                  ${
                    imageSrc
                      ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}" loading="lazy" />`
                      : '<span class="cart-item-media-fallback" aria-hidden="true">DoSim</span>'
                  }
                </div>
                <div class="cart-item-main">
                  <p class="cart-item-name">${escapeHtml(item.name)}</p>
                  <p class="cart-item-meta${itemPrice ? "" : " is-unpriced"}">${itemPrice ? escapeHtml(itemPrice) : "Preço sob consulta"}</p>
                </div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-item-qty-group">
                  <label class="sr-only" for="cart-qty-select-${index}">Quantidade de ${escapeHtml(item.name)}</label>
                  <button class="cart-qty-step" type="button" data-cart-step="${index}" data-step="-1" aria-label="Diminuir quantidade de ${escapeHtml(item.name)}">-</button>
                  <select id="cart-qty-select-${index}" class="cart-item-qty-select" data-cart-qty-select="${index}">
                    ${buildQtySelectOptions(item.qty)}
                  </select>
                  <button class="cart-qty-step" type="button" data-cart-step="${index}" data-step="1" aria-label="Aumentar quantidade de ${escapeHtml(item.name)}">+</button>
                </div>
                <label class="sr-only" for="cart-qty-custom-${index}">Digite quantidade maior que ${SELECT_QTY_LIMIT} para ${escapeHtml(item.name)}</label>
                <input
                  id="cart-qty-custom-${index}"
                  class="cart-item-qty cart-item-qty-custom ${useCustomQty(item.qty) ? "is-visible" : ""}"
                  type="number"
                  min="${SELECT_QTY_LIMIT + 1}"
                  step="1"
                  value="${useCustomQty(item.qty) ? item.qty : SELECT_QTY_LIMIT + 1}"
                  inputmode="numeric"
                  data-cart-qty-custom="${index}"
                  ${useCustomQty(item.qty) ? "" : "hidden"}
                />
                <button class="cart-item-remove" type="button" data-cart-remove="${index}">Remover</button>
              </div>
            </li>
          `;
          }
        )
        .join("");

      if (typeof customQtyFocusIndex === "number") {
        const customInput = itemsList.querySelector(`[data-cart-qty-custom="${customQtyFocusIndex}"]`);
        if (customInput instanceof HTMLInputElement && !customInput.hidden) {
          customInput.focus();
          customInput.select();
        }
      }
    };

    const setItemQty = (index, qty) => {
      if (!Number.isInteger(index) || !cartItems[index]) {
        return false;
      }

      cartItems[index].qty = clampQty(qty);
      saveCartItems();
      return true;
    };

    const addToCart = (item) => {
      const normalizedItem = {
        id: item.id,
        name: item.name,
        price: normalizeText(item.price),
        imageSrc: normalizeText(item.imageSrc),
        imageAlt: normalizeText(item.imageAlt),
      };

      const existing = cartItems.find((entry) => entry.id === normalizedItem.id);
      if (existing) {
        existing.qty += 1;
        if (!normalizeText(existing.price) && normalizedItem.price) {
          existing.price = normalizedItem.price;
        }
        if (!normalizeText(existing.imageSrc) && normalizedItem.imageSrc) {
          existing.imageSrc = normalizedItem.imageSrc;
          existing.imageAlt = normalizedItem.imageAlt || `Foto do produto ${normalizedItem.name}`;
        }
      } else {
        cartItems.push({
          ...normalizedItem,
          imageAlt: normalizedItem.imageAlt || `Foto do produto ${normalizedItem.name}`,
          qty: 1,
        });
      }
      saveCartItems();
      renderCart();
      openCart();
    };

    cartOpenButton?.addEventListener("click", openCart);
    cartFloatButton?.addEventListener("click", openCart);
    closeButton?.addEventListener("click", closeCart);
    overlay.addEventListener("click", closeCart);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
      }
    });

    itemsList.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.hasAttribute("data-cart-qty-custom")) {
        return;
      }

      const index = Number.parseInt(target.getAttribute("data-cart-qty-custom") || "", 10);
      if (Number.isNaN(index) || !cartItems[index]) {
        return;
      }

      const rawValue = target.value.trim();
      if (!rawValue) {
        return;
      }

      const qty = Number.parseInt(rawValue, 10);
      if (Number.isNaN(qty) || qty <= 0) {
        return;
      }

      cartItems[index].qty = qty;
      saveCartItems();
      updateCartSummary();
    });

    itemsList.addEventListener("change", (event) => {
      const target = event.target;

      if (target instanceof HTMLSelectElement && target.hasAttribute("data-cart-qty-select")) {
        const index = Number.parseInt(target.getAttribute("data-cart-qty-select") || "", 10);
        if (Number.isNaN(index) || !cartItems[index]) {
          return;
        }

        if (target.value === "custom") {
          const nextQty = useCustomQty(cartItems[index].qty) ? cartItems[index].qty : SELECT_QTY_LIMIT + 1;
          if (setItemQty(index, nextQty)) {
            renderCart(index);
          }
          return;
        }

        if (setItemQty(index, target.value)) {
          renderCart();
        }
        return;
      }

      if (target instanceof HTMLInputElement && target.hasAttribute("data-cart-qty-custom")) {
        const index = Number.parseInt(target.getAttribute("data-cart-qty-custom") || "", 10);
        if (Number.isNaN(index) || !cartItems[index]) {
          return;
        }

        if (setItemQty(index, target.value)) {
          renderCart(useCustomQty(cartItems[index].qty) ? index : null);
        }
      }
    });

    itemsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const stepButton = target.closest("[data-cart-step]");
      if (stepButton instanceof HTMLElement) {
        const index = Number.parseInt(stepButton.getAttribute("data-cart-step") || "", 10);
        const step = Number.parseInt(stepButton.getAttribute("data-step") || "0", 10);
        if (Number.isNaN(index) || Number.isNaN(step) || !cartItems[index]) {
          return;
        }

        const nextQty = Math.max(1, cartItems[index].qty + step);
        if (setItemQty(index, nextQty)) {
          renderCart(useCustomQty(nextQty) ? index : null);
        }
        return;
      }

      const removeButton = target.closest("[data-cart-remove]");
      if (!(removeButton instanceof HTMLElement)) {
        return;
      }

      const index = Number.parseInt(removeButton.getAttribute("data-cart-remove") || "", 10);
      if (Number.isNaN(index) || !cartItems[index]) {
        return;
      }

      cartItems.splice(index, 1);
      saveCartItems();
      renderCart();
    });

    submitButton?.addEventListener("click", (event) => {
      event.preventDefault();
      if (!cartItems.length) {
        window.alert("Seu carrinho está vazio.");
        return;
      }

      const cartTotals = getCartTotals();
      const lines = cartItems.map((item) => {
        const unitPrice = parsePriceValue(item.price);
        if (unitPrice === null) {
          return `- ${item.name}: ${item.qty}x`;
        }

        const lineTotal = formatCurrency(unitPrice * item.qty);
        return `- ${item.name}: ${item.qty}x (${item.price} cada) = ${lineTotal}`;
      });

      const totalLine = cartTotals.hasUnpricedItems
        ? `Total parcial calculado no site: ${formatCurrency(cartTotals.totalValue)} (há itens sem preço no catálogo).`
        : `Total do pedido: ${formatCurrency(cartTotals.totalValue)}.`;

      const message = [
        "Olá, DoSim! Quero fazer um pedido pelo site.",
        "",
        "Itens selecionados:",
        ...lines,
        "",
        totalLine,
      ].join("\n");

      window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });

    const catalogItemLookup = new Map();
    const gramaturaOptions = Array.from(document.querySelectorAll(".weight-list li"));
    gramaturaOptions.forEach((option) => {
      const card = option.closest(".catalog-card");
      const productName = card?.querySelector(".card-title")?.textContent?.trim();
      const weight = option.querySelector("span")?.textContent?.trim();
      const price = option.querySelector("strong")?.textContent?.trim();
      if (!productName || !weight || !price) {
        return;
      }

      const itemName = `${productName} (${weight})`;
      const itemId = slugify(`${productName}-${weight}`);
      const imageData = extractCardImageData(card, itemName);
      catalogItemLookup.set(itemId, { price, ...imageData });

      option.classList.add("weight-option");
      option.setAttribute("role", "button");
      option.setAttribute("tabindex", "0");
      option.setAttribute("aria-label", `Adicionar ${itemName} ao carrinho`);

      const handleAdd = () => {
        addToCart({ id: itemId, name: itemName, price, ...imageData });
        option.classList.add("is-added");
        window.setTimeout(() => option.classList.remove("is-added"), 260);
      };

      option.addEventListener("click", handleAdd);
      option.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleAdd();
        }
      });
    });

    const presenteavelCards = Array.from(document.querySelectorAll(".catalog-card")).filter((card) => {
      if (!card.querySelector(".btn-sm")) {
        return false;
      }

      return Boolean(card.querySelector(".price-stack")) || Boolean(card.closest("#mais-vendidos"));
    });

    presenteavelCards.forEach((card) => {
      const addButton = card.querySelector(".btn-sm");
      if (!(addButton instanceof HTMLAnchorElement || addButton instanceof HTMLButtonElement)) {
        return;
      }

      const productName = card.querySelector(".card-title")?.textContent?.trim();
      const meta = card.querySelector(".card-meta")?.textContent?.trim();
      const price = card.querySelector(".price-current")?.textContent?.trim() || card.getAttribute("data-price")?.trim() || "";
      if (!productName) {
        return;
      }

      const itemName = meta ? `${productName} (${meta})` : productName;
      const itemId = slugify(`${productName}-${meta || "produto"}`);
      const imageData = extractCardImageData(card, itemName);
      catalogItemLookup.set(itemId, { price, ...imageData });

      if (addButton instanceof HTMLAnchorElement) {
        addButton.href = "#";
      }
      addButton.textContent = "Adicionar ao carrinho";
      addButton.setAttribute("aria-label", `Adicionar ${itemName} ao carrinho`);

      const handleAdd = (event) => {
        event.preventDefault();
        addToCart({ id: itemId, name: itemName, price, ...imageData });
        addButton.classList.add("is-added");
        window.setTimeout(() => addButton.classList.remove("is-added"), 260);
      };

      addButton.addEventListener("click", handleAdd);
    });

    let cartHydrated = false;
    cartItems = cartItems.map((item) => {
      const lookup = catalogItemLookup.get(item.id);
      if (!lookup) {
        return item;
      }

      const nextItem = { ...item };
      if (!normalizeText(nextItem.price) && normalizeText(lookup.price)) {
        nextItem.price = normalizeText(lookup.price);
        cartHydrated = true;
      }

      if (!normalizeText(nextItem.imageSrc) && normalizeText(lookup.imageSrc)) {
        nextItem.imageSrc = normalizeText(lookup.imageSrc);
        cartHydrated = true;
      }

      if (!normalizeText(nextItem.imageAlt) && normalizeText(lookup.imageAlt)) {
        nextItem.imageAlt = normalizeText(lookup.imageAlt);
        cartHydrated = true;
      }

      return nextItem;
    });

    if (cartHydrated) {
      saveCartItems();
    }

    renderCart();
  }

  function loadCartItems() {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item) => item && typeof item.id === "string" && typeof item.name === "string")
        .map((item) => ({
          id: item.id,
          name: item.name,
          price: typeof item.price === "string" ? item.price : "",
          imageSrc: typeof item.imageSrc === "string" ? item.imageSrc : "",
          imageAlt: typeof item.imageAlt === "string" ? item.imageAlt : "",
          qty: Number.isFinite(Number(item.qty)) ? Math.max(1, Number.parseInt(String(item.qty), 10)) : 1,
        }));
    } catch {
      return [];
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
    floatingLink.innerHTML = `
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 4.6c-6.25 0-11.31 4.85-11.31 10.84 0 2.29.74 4.42 2 6.17L5.2 27.4l5.97-1.45a11.53 11.53 0 0 0 4.83 1.05c6.24 0 11.3-4.85 11.3-10.84S22.24 4.6 16 4.6Z"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21.04 18.75c-.27-.13-1.6-.77-1.84-.86-.25-.09-.42-.13-.6.13-.18.27-.68.86-.83 1.05-.15.18-.31.2-.58.07-.26-.13-1.1-.39-2.09-1.24-.77-.67-1.29-1.49-1.45-1.75-.15-.27-.02-.41.12-.54.12-.12.26-.31.4-.47.13-.15.18-.27.26-.45.09-.18.05-.34-.02-.47-.07-.13-.6-1.43-.82-1.95-.22-.53-.44-.45-.6-.46h-.51c-.18 0-.46.07-.7.33-.24.27-.92.9-.92 2.2 0 1.29.94 2.54 1.07 2.72.13.18 1.84 2.9 4.54 3.95 2.69 1.05 2.69.7 3.18.65.49-.04 1.6-.64 1.82-1.25.22-.61.22-1.13.15-1.24-.06-.12-.24-.18-.51-.31Z"
          fill="currentColor"
        />
      </svg>
      <span class="sr-only">WhatsApp</span>
    `;
    document.body.appendChild(floatingLink);
  }

  function injectLinksFloat() {
    if (document.querySelector(".links-float")) {
      return;
    }

    const pathname = window.location.pathname.toLowerCase();
    if (pathname.endsWith("/links/") || pathname.endsWith("/links/index.html")) {
      return;
    }

    const linksButton = document.createElement("a");
    linksButton.className = "links-float";
    linksButton.href = new URL("links/", window.location.href).href;
    linksButton.setAttribute("aria-label", "Abrir página /links");
    linksButton.textContent = "Abrir /links";
    document.body.appendChild(linksButton);
  }

  function updateFooterYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = year;
    });
  }
})();
