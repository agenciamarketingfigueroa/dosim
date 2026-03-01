(() => {
  const WHATSAPP_NUMBER = "5531996154698";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
  const CART_STORAGE_KEY = "dosim_cart_v1";
  const CART_CUSTOMER_STORAGE_KEY = "dosim_cart_customer_v1";

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
        "Ola, DoSim! Vim pelo site e quero atendimento.",
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
        <p class="cart-empty" data-cart-empty>Seu carrinho esta vazio.</p>
        <ul class="cart-items" data-cart-items></ul>
        <section class="cart-customer" data-cart-customer>
          <h3 class="cart-customer-title">Dados para o pedido</h3>
          <div class="cart-customer-grid">
            <label class="cart-field">
              <span>Nome</span>
              <input type="text" data-cart-first-name autocomplete="given-name" />
            </label>
            <label class="cart-field">
              <span>Sobrenome</span>
              <input type="text" data-cart-last-name autocomplete="family-name" />
            </label>
          </div>
          <fieldset class="cart-customer-choice">
            <legend>Recebimento</legend>
            <label>
              <input type="radio" name="cart-fulfillment" value="retirada" data-cart-fulfillment />
              <span>Retirada</span>
            </label>
            <label>
              <input type="radio" name="cart-fulfillment" value="entrega" data-cart-fulfillment />
              <span>Entrega</span>
            </label>
          </fieldset>
          <fieldset class="cart-customer-choice">
            <legend>Forma de pagamento</legend>
            <label>
              <input type="radio" name="cart-payment" value="pix" data-cart-payment />
              <span>Pix</span>
            </label>
            <label>
              <input type="radio" name="cart-payment" value="cartao" data-cart-payment />
              <span>Cartao de credito/debito</span>
            </label>
          </fieldset>
          <label class="cart-field">
            <span>Data desejada para encomenda</span>
            <input type="date" data-cart-delivery-date />
            <small data-cart-delivery-note>Prazo minimo: 1 dia util para itens sem pronta entrega.</small>
          </label>
          <div class="cart-delivery-fields" data-cart-delivery-fields hidden>
            <div class="cart-delivery-grid">
              <label class="cart-field">
                <span>Rua</span>
                <input type="text" data-cart-delivery-street />
              </label>
              <label class="cart-field">
                <span>Numero</span>
                <input type="text" data-cart-delivery-number />
              </label>
              <label class="cart-field">
                <span>Complemento</span>
                <input type="text" data-cart-delivery-complement />
              </label>
              <label class="cart-field">
                <span>Bairro</span>
                <input type="text" data-cart-delivery-neighborhood />
              </label>
              <label class="cart-field">
                <span>Cidade</span>
                <input type="text" data-cart-delivery-city />
              </label>
              <label class="cart-field">
                <span>CEP</span>
                <input type="text" data-cart-delivery-cep />
              </label>
            </div>
            <label class="cart-field">
              <span>Ponto de referencia</span>
              <textarea rows="2" data-cart-delivery-reference></textarea>
            </label>
          </div>
        </section>
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
    const customerSection = drawer.querySelector("[data-cart-customer]");
    const firstNameInput = drawer.querySelector("[data-cart-first-name]");
    const lastNameInput = drawer.querySelector("[data-cart-last-name]");
    const fulfillmentInputs = Array.from(drawer.querySelectorAll("[data-cart-fulfillment]"));
    const paymentInputs = Array.from(drawer.querySelectorAll("[data-cart-payment]"));
    const deliveryFields = drawer.querySelector("[data-cart-delivery-fields]");
    const deliveryDateInput = drawer.querySelector("[data-cart-delivery-date]");
    const deliveryNote = drawer.querySelector("[data-cart-delivery-note]");
    const deliveryStreetInput = drawer.querySelector("[data-cart-delivery-street]");
    const deliveryNumberInput = drawer.querySelector("[data-cart-delivery-number]");
    const deliveryComplementInput = drawer.querySelector("[data-cart-delivery-complement]");
    const deliveryNeighborhoodInput = drawer.querySelector("[data-cart-delivery-neighborhood]");
    const deliveryCityInput = drawer.querySelector("[data-cart-delivery-city]");
    const deliveryCepInput = drawer.querySelector("[data-cart-delivery-cep]");
    const deliveryReferenceInput = drawer.querySelector("[data-cart-delivery-reference]");

    if (
      !(emptyMessage instanceof HTMLElement) ||
      !(itemsList instanceof HTMLElement) ||
      !(totalLabel instanceof HTMLElement) ||
      !(submitButton instanceof HTMLElement) ||
      !(closeButton instanceof HTMLElement) ||
      !(customerSection instanceof HTMLElement) ||
      !(firstNameInput instanceof HTMLInputElement) ||
      !(lastNameInput instanceof HTMLInputElement) ||
      !(deliveryFields instanceof HTMLElement) ||
      !(deliveryDateInput instanceof HTMLInputElement) ||
      !(deliveryNote instanceof HTMLElement) ||
      !(deliveryStreetInput instanceof HTMLInputElement) ||
      !(deliveryNumberInput instanceof HTMLInputElement) ||
      !(deliveryComplementInput instanceof HTMLInputElement) ||
      !(deliveryNeighborhoodInput instanceof HTMLInputElement) ||
      !(deliveryCityInput instanceof HTMLInputElement) ||
      !(deliveryCepInput instanceof HTMLInputElement) ||
      !(deliveryReferenceInput instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    let cartItems = loadCartItems();
    let flavorValidationActive = false;

    const slugify = (value) =>
      value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
    const normalizeCatalogType = (value) => (value === "presenteavel" || value === "gramatura" ? value : "");
    const normalizeFulfillment = (value) => (value === "entrega" ? "entrega" : "retirada");
    const normalizePayment = (value) => (value === "cartao" ? "cartao" : "pix");
    const normalizeDateInput = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : "");

    const DELIVERY_MIN_BUSINESS_DAYS = 1;
    const DELIVERY_FEE_VALUE = 7;
    const SELECT_QTY_LIMIT = 10;
    const FLAVOR_OPTIONS = [
      { id: "tradicional", label: "Tradicional", available: true },
      { id: "chocolate", label: "Chocolate", available: true },
      { id: "canela", label: "Canela", available: true },
      { id: "capuccino", label: "Capuccino", available: true },
      { id: "ninho-nutella", label: "Ninho com Nutella", available: true },
      { id: "ovomaltine", label: "Ovomaltine", available: true },
    ];
    const flavorOptionById = new Map(FLAVOR_OPTIONS.map((option) => [option.id, option]));

    const storedCustomerData = loadCustomerData();
    let customerData = {
      firstName: normalizeText(storedCustomerData.firstName),
      lastName: normalizeText(storedCustomerData.lastName),
      fulfillment: normalizeFulfillment(storedCustomerData.fulfillment),
      payment: normalizePayment(storedCustomerData.payment),
      street: normalizeText(storedCustomerData.street),
      number: normalizeText(storedCustomerData.number),
      complement: normalizeText(storedCustomerData.complement),
      neighborhood: normalizeText(storedCustomerData.neighborhood),
      city: normalizeText(storedCustomerData.city),
      cep: normalizeText(storedCustomerData.cep),
      reference: normalizeText(storedCustomerData.reference),
      deliveryDate: normalizeDateInput(storedCustomerData.deliveryDate),
    };

    const clampQty = (value) => {
      const parsed = Number.parseInt(String(value), 10);
      if (Number.isNaN(parsed)) {
        return 1;
      }

      return Math.max(1, parsed);
    };

    const useCustomQty = (qty) => qty > SELECT_QTY_LIMIT;

    const inferCatalogType = (itemId, itemName) => {
      const normalizedId = normalizeText(itemId).toLowerCase();
      const normalizedName = normalizeText(itemName).toLowerCase();
      if (/\(\d+\s*unidades?\)/.test(normalizedName) || /-unidade/.test(normalizedId) || /-unidades/.test(normalizedId)) {
        return "presenteavel";
      }

      if (/\(\d+\s*g\)/.test(normalizedName) || /-\d+g$/.test(normalizedId)) {
        return "gramatura";
      }

      return "";
    };

    const isFixedFlavorProduct = (itemName) => normalizeText(itemName).toLowerCase().includes("ninho com nutella");

    const shouldItemSupportFlavorSelection = (catalogType, itemName) => {
      if (isFixedFlavorProduct(itemName)) {
        return false;
      }

      if (catalogType === "presenteavel") {
        return true;
      }

      if (catalogType !== "gramatura") {
        return false;
      }

      return normalizeText(itemName).toLowerCase().startsWith("misto");
    };

    const resolveFlavorSupport = (catalogType, itemName, fallbackSupport = false) => {
      if (isFixedFlavorProduct(itemName)) {
        return false;
      }

      return shouldItemSupportFlavorSelection(catalogType, itemName) || fallbackSupport === true;
    };

    const isFlavorAvailable = (flavorId) => flavorOptionById.get(flavorId)?.available !== false;

    const sanitizeFlavorIds = (value) => {
      if (!Array.isArray(value)) {
        return [];
      }

      const seen = new Set();
      return value
        .map((entry) => normalizeText(entry))
        .filter((entry) => {
          if (!entry || seen.has(entry)) {
            return false;
          }

          const flavor = flavorOptionById.get(entry);
          if (!flavor || !isFlavorAvailable(entry)) {
            return false;
          }

          seen.add(entry);
          return true;
        });
    };

    const areStringArraysEqual = (left, right) => {
      if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
        return false;
      }

      return left.every((value, index) => value === right[index]);
    };

    const normalizeCartItem = (item) => {
      const itemName = normalizeText(item.name);
      const catalogType = normalizeCatalogType(item.catalogType) || inferCatalogType(item.id, itemName);
      const supportsFlavors = resolveFlavorSupport(catalogType, itemName, item.supportsFlavors);

      return {
        id: item.id,
        name: itemName,
        price: normalizeText(item.price),
        imageSrc: normalizeText(item.imageSrc),
        imageAlt: normalizeText(item.imageAlt) || (itemName ? `Foto do produto ${itemName}` : "Foto do produto DoSim"),
        qty: clampQty(item.qty),
        catalogType,
        supportsFlavors,
        selectedFlavorIds: supportsFlavors ? sanitizeFlavorIds(item.selectedFlavorIds) : [],
      };
    };

    const areItemsEquivalent = (left, right) =>
      normalizeText(left.id) === normalizeText(right.id) &&
      normalizeText(left.name) === normalizeText(right.name) &&
      normalizeText(left.price) === normalizeText(right.price) &&
      normalizeText(left.imageSrc) === normalizeText(right.imageSrc) &&
      normalizeText(left.imageAlt) === normalizeText(right.imageAlt) &&
      clampQty(left.qty) === clampQty(right.qty) &&
      normalizeCatalogType(left.catalogType) === normalizeCatalogType(right.catalogType) &&
      Boolean(left.supportsFlavors) === Boolean(right.supportsFlavors) &&
      areStringArraysEqual(sanitizeFlavorIds(left.selectedFlavorIds), sanitizeFlavorIds(right.selectedFlavorIds));

    const buildFlavorLabelList = (flavorIds) =>
      sanitizeFlavorIds(flavorIds)
        .map((flavorId) => flavorOptionById.get(flavorId)?.label)
        .filter((label) => Boolean(label));

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

    const saveCustomerData = () => {
      try {
        window.localStorage.setItem(CART_CUSTOMER_STORAGE_KEY, JSON.stringify(customerData));
      } catch {
        // Ignore storage errors and keep cart working for current session.
      }
    };

    const getSelectedFulfillment = () => {
      const checkedInput = fulfillmentInputs.find((input) => input.checked);
      return normalizeFulfillment(checkedInput?.value);
    };

    const getSelectedPayment = () => {
      const checkedInput = paymentInputs.find((input) => input.checked);
      return normalizePayment(checkedInput?.value);
    };

    const refreshMinimumDeliveryDate = () => {
      const minDeliveryDate = getFutureBusinessDateISO(DELIVERY_MIN_BUSINESS_DAYS);
      const dayLabel = DELIVERY_MIN_BUSINESS_DAYS === 1 ? "dia util" : "dias uteis";
      deliveryDateInput.min = minDeliveryDate;
      deliveryNote.textContent = `Prazo minimo: ${DELIVERY_MIN_BUSINESS_DAYS} ${dayLabel} para itens sem pronta entrega.`;
      return minDeliveryDate;
    };

    const syncCustomerDataFromForm = () => {
      customerData = {
        firstName: normalizeText(firstNameInput.value),
        lastName: normalizeText(lastNameInput.value),
        fulfillment: getSelectedFulfillment(),
        payment: getSelectedPayment(),
        street: normalizeText(deliveryStreetInput.value),
        number: normalizeText(deliveryNumberInput.value),
        complement: normalizeText(deliveryComplementInput.value),
        neighborhood: normalizeText(deliveryNeighborhoodInput.value),
        city: normalizeText(deliveryCityInput.value),
        cep: normalizeText(deliveryCepInput.value),
        reference: normalizeText(deliveryReferenceInput.value),
        deliveryDate: normalizeDateInput(deliveryDateInput.value),
      };
    };

    const updateDeliveryFieldVisibility = () => {
      const isDelivery = getSelectedFulfillment() === "entrega";
      deliveryFields.hidden = !isDelivery;
    };

    const syncCustomerFormFromState = () => {
      firstNameInput.value = customerData.firstName;
      lastNameInput.value = customerData.lastName;
      deliveryStreetInput.value = customerData.street;
      deliveryNumberInput.value = customerData.number;
      deliveryComplementInput.value = customerData.complement;
      deliveryNeighborhoodInput.value = customerData.neighborhood;
      deliveryCityInput.value = customerData.city;
      deliveryCepInput.value = customerData.cep;
      deliveryReferenceInput.value = customerData.reference;
      deliveryDateInput.value = customerData.deliveryDate;

      const fulfillmentValue = normalizeFulfillment(customerData.fulfillment);
      let radioSelected = false;
      fulfillmentInputs.forEach((input) => {
        const shouldCheck = input.value === fulfillmentValue;
        input.checked = shouldCheck;
        if (shouldCheck) {
          radioSelected = true;
        }
      });

      if (!radioSelected && fulfillmentInputs[0]) {
        fulfillmentInputs[0].checked = true;
      }

      const paymentValue = normalizePayment(customerData.payment);
      let paymentSelected = false;
      paymentInputs.forEach((input) => {
        const shouldCheck = input.value === paymentValue;
        input.checked = shouldCheck;
        if (shouldCheck) {
          paymentSelected = true;
        }
      });

      if (!paymentSelected && paymentInputs[0]) {
        paymentInputs[0].checked = true;
      }

      refreshMinimumDeliveryDate();
      updateDeliveryFieldVisibility();
      syncCustomerDataFromForm();
      saveCustomerData();
    };

    const persistCustomerDataFromForm = () => {
      syncCustomerDataFromForm();
      saveCustomerData();
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
      const deliveryFee = getSelectedFulfillment() === "entrega" ? DELIVERY_FEE_VALUE : 0;
      const orderTotal = cartTotals.totalValue + deliveryFee;
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
      const subtotalPrefix = cartTotals.hasUnpricedItems ? "Subtotal parcial" : "Subtotal";
      const totalPrefix = cartTotals.hasUnpricedItems ? "Total parcial" : "Total";
      const deliveryLabel = deliveryFee > 0 ? ` | Taxa entrega: ${formatCurrency(deliveryFee)}` : "";
      totalLabel.textContent = `${cartItems.length} produto(s), ${totalItems} item(ns) | ${subtotalPrefix}: ${formatCurrency(cartTotals.totalValue)}${deliveryLabel} | ${totalPrefix}: ${formatCurrency(orderTotal)}`;
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
            const selectedFlavorIds = sanitizeFlavorIds(item.selectedFlavorIds);
            const hasFlavorError = Boolean(item.supportsFlavors) && !selectedFlavorIds.length && flavorValidationActive;

            const flavorMarkup = item.supportsFlavors
              ? `
              <div class="cart-item-flavors${hasFlavorError ? " has-error" : ""}">
                <p class="cart-item-flavors-title">Sabores</p>
                <div class="cart-flavor-options">
                  ${FLAVOR_OPTIONS.map((flavor) => {
                    const unavailable = flavor.available === false;
                    const checked = selectedFlavorIds.includes(flavor.id);
                    return `
                      <label class="cart-flavor-option${checked ? " is-selected" : ""}${unavailable ? " is-unavailable" : ""}">
                        <input
                          type="checkbox"
                          value="${escapeHtml(flavor.id)}"
                          data-cart-flavor="${index}"
                          data-flavor-id="${escapeHtml(flavor.id)}"
                          ${checked ? "checked" : ""}
                          ${unavailable ? "disabled" : ""}
                        />
                        <span>${escapeHtml(flavor.label)}</span>
                      </label>
                    `;
                  }).join("")}
                </div>
                ${
                  hasFlavorError
                    ? '<p class="cart-item-error">Selecione pelo menos 1 sabor para este item.</p>'
                    : '<p class="cart-item-hint">Marque um ou mais sabores.</p>'
                }
              </div>
            `
              : "";

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
                  <p class="cart-item-meta${itemPrice ? "" : " is-unpriced"}">${itemPrice ? escapeHtml(itemPrice) : "Preco sob consulta"}</p>
                </div>
              </div>
              ${flavorMarkup}
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
      const normalizedItem = normalizeCartItem({
        ...item,
        qty: 1,
      });

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

        if (!normalizeCatalogType(existing.catalogType) && normalizedItem.catalogType) {
          existing.catalogType = normalizedItem.catalogType;
        }

        const supportsFlavors = resolveFlavorSupport(
          normalizeCatalogType(existing.catalogType),
          existing.name,
          existing.supportsFlavors === true || normalizedItem.supportsFlavors === true
        );
        existing.supportsFlavors = supportsFlavors;
        existing.selectedFlavorIds = supportsFlavors ? sanitizeFlavorIds(existing.selectedFlavorIds) : [];
      } else {
        cartItems.push(normalizedItem);
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

    firstNameInput.addEventListener("input", persistCustomerDataFromForm);
    lastNameInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryStreetInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryNumberInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryComplementInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryNeighborhoodInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryCityInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryCepInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryReferenceInput.addEventListener("input", persistCustomerDataFromForm);
    deliveryDateInput.addEventListener("change", persistCustomerDataFromForm);
    fulfillmentInputs.forEach((input) => {
      input.addEventListener("change", () => {
        updateDeliveryFieldVisibility();
        persistCustomerDataFromForm();
        updateCartSummary();
      });
    });
    paymentInputs.forEach((input) => {
      input.addEventListener("change", persistCustomerDataFromForm);
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

      if (target instanceof HTMLInputElement && target.hasAttribute("data-cart-flavor")) {
        const index = Number.parseInt(target.getAttribute("data-cart-flavor") || "", 10);
        const flavorId = normalizeText(target.getAttribute("data-flavor-id"));
        if (Number.isNaN(index) || !cartItems[index] || !flavorOptionById.has(flavorId) || !isFlavorAvailable(flavorId)) {
          return;
        }

        const currentFlavorIds = sanitizeFlavorIds(cartItems[index].selectedFlavorIds);
        let nextFlavorIds = currentFlavorIds;
        if (target.checked) {
          nextFlavorIds = sanitizeFlavorIds([...currentFlavorIds, flavorId]);
        } else {
          nextFlavorIds = currentFlavorIds.filter((id) => id !== flavorId);
        }

        cartItems[index].selectedFlavorIds = nextFlavorIds;
        flavorValidationActive = false;
        saveCartItems();
        renderCart();
        return;
      }

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
      if (!cartItems.length) {
        flavorValidationActive = false;
      }
      saveCartItems();
      renderCart();
    });

    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!cartItems.length) {
        window.alert("Seu carrinho esta vazio.");
        return;
      }

      const minDeliveryDate = refreshMinimumDeliveryDate();
      syncCustomerDataFromForm();
      saveCustomerData();

      if (!customerData.firstName || !customerData.lastName) {
        window.alert("Preencha nome e sobrenome para enviar o pedido.");
        if (!customerData.firstName) {
          firstNameInput.focus();
        } else {
          lastNameInput.focus();
        }
        return;
      }

      if (!customerData.deliveryDate) {
        window.alert("Selecione a data desejada para encomenda.");
        deliveryDateInput.focus();
        return;
      }

      if (customerData.deliveryDate < minDeliveryDate) {
        window.alert(`Selecione uma data a partir de ${formatISODateForDisplay(minDeliveryDate)}.`);
        deliveryDateInput.focus();
        return;
      }

      const itemsWithoutFlavor = cartItems.filter((item) => item.supportsFlavors && !sanitizeFlavorIds(item.selectedFlavorIds).length);
      if (itemsWithoutFlavor.length) {
        flavorValidationActive = true;
        renderCart();
        const productNames = itemsWithoutFlavor.map((item) => item.name).join(", ");
        window.alert(`Selecione pelo menos 1 sabor para: ${productNames}.`);
        return;
      }

      if (customerData.fulfillment === "entrega") {
        if (!customerData.street) {
          window.alert("Preencha a rua para entrega.");
          deliveryStreetInput.focus();
          return;
        }

        if (!customerData.number) {
          window.alert("Preencha o numero para entrega.");
          deliveryNumberInput.focus();
          return;
        }

        if (!customerData.neighborhood) {
          window.alert("Preencha o bairro para entrega.");
          deliveryNeighborhoodInput.focus();
          return;
        }

        if (!customerData.city) {
          window.alert("Preencha a cidade para entrega.");
          deliveryCityInput.focus();
          return;
        }

        if (!customerData.cep) {
          window.alert("Preencha o CEP para entrega.");
          deliveryCepInput.focus();
          return;
        }
      }

      flavorValidationActive = false;
      const cartTotals = getCartTotals();
      const lines = cartItems.map((item) => {
        const unitPrice = parsePriceValue(item.price);
        const selectedFlavorLabels = item.supportsFlavors ? buildFlavorLabelList(item.selectedFlavorIds) : [];
        const flavorSuffix = selectedFlavorLabels.length ? ` | Sabores: ${selectedFlavorLabels.join(", ")}` : "";

        if (unitPrice === null) {
          return `- ${item.name}: ${item.qty}x${flavorSuffix}`;
        }

        const lineTotal = formatCurrency(unitPrice * item.qty);
        return `- ${item.name}: ${item.qty}x (${item.price} cada) = ${lineTotal}${flavorSuffix}`;
      });

      const deliveryFee = customerData.fulfillment === "entrega" ? DELIVERY_FEE_VALUE : 0;
      const orderTotal = cartTotals.totalValue + deliveryFee;
      const totalsBlock = [
        cartTotals.hasUnpricedItems
          ? `Subtotal parcial dos produtos: ${formatCurrency(cartTotals.totalValue)} (ha itens sem preco no catalogo).`
          : `Subtotal dos produtos: ${formatCurrency(cartTotals.totalValue)}.`,
      ];
      if (deliveryFee > 0) {
        totalsBlock.push(`Taxa de entrega: ${formatCurrency(deliveryFee)}.`);
      }
      totalsBlock.push(
        cartTotals.hasUnpricedItems
          ? `Total parcial do pedido: ${formatCurrency(orderTotal)} (valor final sera confirmado no atendimento).`
          : `Total do pedido: ${formatCurrency(orderTotal)}.`
      );

      const customerBlock = [
        `Nome: ${customerData.firstName} ${customerData.lastName}`,
        `Recebimento: ${customerData.fulfillment === "entrega" ? "Entrega" : "Retirada"}`,
        `Forma de pagamento: ${customerData.payment === "cartao" ? "Cartao de credito/debito" : "Pix"}`,
        `Data desejada: ${formatISODateForDisplay(customerData.deliveryDate)}`,
      ];

      const addressBlock =
        customerData.fulfillment === "entrega"
          ? [
              "ENDERECO DE ENTREGA:",
              `Rua: ${customerData.street}`,
              `Numero: ${customerData.number}`,
              `Complemento: ${customerData.complement || "-"}`,
              `Bairro: ${customerData.neighborhood}`,
              `Cidade: ${customerData.city}`,
              `CEP: ${customerData.cep}`,
              `Ponto de referencia: ${customerData.reference || "-"}`,
            ]
          : [];

      const message = [
        "Ola, DoSim! Quero fazer um pedido pelo site.",
        "",
        "Dados do cliente:",
        ...customerBlock,
        ...(addressBlock.length ? ["", "", ...addressBlock] : []),
        "",
        "Itens selecionados:",
        ...lines,
        "",
        ...totalsBlock,
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
      const isMistoGramatura = slugify(productName) === "misto";
      catalogItemLookup.set(itemId, {
        price,
        ...imageData,
        catalogType: "gramatura",
        supportsFlavors: isMistoGramatura,
      });

      option.classList.add("weight-option");
      option.setAttribute("role", "button");
      option.setAttribute("tabindex", "0");
      option.setAttribute("aria-label", `Adicionar ${itemName} ao carrinho`);

      const handleAdd = () => {
        addToCart({
          id: itemId,
          name: itemName,
          price,
          ...imageData,
          catalogType: "gramatura",
          supportsFlavors: isMistoGramatura,
        });
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
      const supportsFlavors = resolveFlavorSupport("presenteavel", itemName);
      catalogItemLookup.set(itemId, {
        price,
        ...imageData,
        catalogType: "presenteavel",
        supportsFlavors,
      });

      if (addButton instanceof HTMLAnchorElement) {
        addButton.href = "#";
      }
      addButton.textContent = "Adicionar ao carrinho";
      addButton.setAttribute("aria-label", `Adicionar ${itemName} ao carrinho`);

      const handleAdd = (event) => {
        event.preventDefault();
        addToCart({
          id: itemId,
          name: itemName,
          price,
          ...imageData,
          catalogType: "presenteavel",
          supportsFlavors,
        });
        addButton.classList.add("is-added");
        window.setTimeout(() => addButton.classList.remove("is-added"), 260);
      };

      addButton.addEventListener("click", handleAdd);
    });

    let cartHydrated = false;
    cartItems = cartItems.map((item) => {
      const lookup = catalogItemLookup.get(item.id);
      const hydratedSource = {
        ...item,
        price: normalizeText(item.price) || normalizeText(lookup?.price),
        imageSrc: normalizeText(item.imageSrc) || normalizeText(lookup?.imageSrc),
        imageAlt: normalizeText(item.imageAlt) || normalizeText(lookup?.imageAlt),
        catalogType: normalizeCatalogType(item.catalogType) || normalizeCatalogType(lookup?.catalogType),
        supportsFlavors: resolveFlavorSupport(
          normalizeCatalogType(item.catalogType) || normalizeCatalogType(lookup?.catalogType),
          item.name,
          item.supportsFlavors === true || lookup?.supportsFlavors === true
        ),
      };

      const normalizedItem = normalizeCartItem(hydratedSource);
      if (!areItemsEquivalent(item, normalizedItem)) {
        cartHydrated = true;
      }
      return normalizedItem;
    });

    if (cartHydrated) {
      saveCartItems();
    }

    syncCustomerFormFromState();
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
          catalogType: typeof item.catalogType === "string" ? item.catalogType : "",
          supportsFlavors: item.supportsFlavors === true,
          selectedFlavorIds: Array.isArray(item.selectedFlavorIds)
            ? item.selectedFlavorIds.filter((entry) => typeof entry === "string")
            : [],
          qty: Number.isFinite(Number(item.qty)) ? Math.max(1, Number.parseInt(String(item.qty), 10)) : 1,
        }));
    } catch {
      return [];
    }
  }

  function loadCustomerData() {
    try {
      const raw = window.localStorage.getItem(CART_CUSTOMER_STORAGE_KEY);
      if (!raw) {
        return {
          firstName: "",
          lastName: "",
          fulfillment: "retirada",
          payment: "pix",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          cep: "",
          reference: "",
          deliveryDate: "",
        };
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return {
          firstName: "",
          lastName: "",
          fulfillment: "retirada",
          payment: "pix",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          cep: "",
          reference: "",
          deliveryDate: "",
        };
      }

      return {
        firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
        lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
        fulfillment: parsed.fulfillment === "entrega" ? "entrega" : "retirada",
        payment: parsed.payment === "cartao" ? "cartao" : "pix",
        street: typeof parsed.street === "string" ? parsed.street : typeof parsed.address === "string" ? parsed.address : "",
        number: typeof parsed.number === "string" ? parsed.number : "",
        complement: typeof parsed.complement === "string" ? parsed.complement : "",
        neighborhood: typeof parsed.neighborhood === "string" ? parsed.neighborhood : "",
        city: typeof parsed.city === "string" ? parsed.city : "",
        cep: typeof parsed.cep === "string" ? parsed.cep : "",
        reference: typeof parsed.reference === "string" ? parsed.reference : "",
        deliveryDate: typeof parsed.deliveryDate === "string" ? parsed.deliveryDate : "",
      };
    } catch {
      return {
        firstName: "",
        lastName: "",
        fulfillment: "retirada",
        payment: "pix",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        cep: "",
        reference: "",
        deliveryDate: "",
      };
    }
  }

  function getFutureBusinessDateISO(businessDays) {
    const safeBusinessDays = Number.isFinite(Number(businessDays))
      ? Math.max(0, Number.parseInt(String(businessDays), 10))
      : 0;
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    let daysRemaining = safeBusinessDays;

    while (daysRemaining > 0) {
      date.setDate(date.getDate() + 1);
      const weekday = date.getDay();
      if (weekday !== 0 && weekday !== 6) {
        daysRemaining -= 1;
      }
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatISODateForDisplay(isoDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate))) {
      return String(isoDate || "");
    }

    const [year, month, day] = String(isoDate).split("-");
    return `${day}/${month}/${year}`;
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
    floatingLink.href = `${WHATSAPP_URL}?text=${encodeURIComponent("Ola, DoSim! Quero atendimento.")}`;
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
    linksButton.setAttribute("aria-label", "Abrir pagina /links");
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
