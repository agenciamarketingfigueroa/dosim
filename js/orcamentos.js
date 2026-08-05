(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const auth = globalThis.DoSimInternalAuth;
    if (!auth?.isAuthenticated()) {
      globalThis.location.replace("/area-interna");
      return;
    }

    const form = document.querySelector("[data-quote-form]");
    if (!(form instanceof HTMLFormElement)) return;

    const get = (selector) => document.querySelector(selector);
    const fields = {
      customer: get("[data-quote-customer]"),
      customerWhatsapp: get("[data-quote-customer-whatsapp]"),
      type: get("[data-quote-type]"),
      modality: get("[data-quote-modality]"),
      product: get("[data-quote-product]"),
      flavor: get("[data-quote-flavor]"),
      sizeOptions: get("[data-quote-size-options]"),
      personalizedOrder: get("[data-quote-personalized-order]"),
      personalizedType: get("[data-quote-personalized-type]"),
      sizeField: get("[data-quote-size-field]"),
      size: get("[data-quote-size]"),
      units: get("[data-quote-units]"),
      grams: get("[data-quote-grams]"),
      quantityInstructions: get("[data-quote-quantity-instructions]"),
      unitsLabel: get("[data-quote-units-label]"),
      gramsLabel: get("[data-quote-grams-label]"),
      quantityNote: get("[data-quote-quantity-note]"),
      deliveryDate: get("[data-quote-delivery-date]"),
      productPrice: get("[data-quote-product-price]"),
      productPriceLabel: get("[data-quote-product-price-label]"),
      productPriceHelp: get("[data-quote-product-price-help]"),
      deliveryPanel: get("[data-quote-delivery-panel]"),
      street: get("[data-quote-street]"),
      number: get("[data-quote-number]"),
      neighborhood: get("[data-quote-neighborhood]"),
      city: get("[data-quote-city]"),
      cep: get("[data-quote-cep]"),
      complement: get("[data-quote-complement]"),
      reference: get("[data-quote-reference]"),
      shippingStatus: get("[data-quote-shipping-status]"),
      calculateShipping: get("[data-quote-calculate-shipping]"),
      notes: get("[data-quote-notes]"),
      error: get("[data-quote-error]"),
      summaryEmpty: get("[data-quote-summary-empty]"),
      summary: get("[data-quote-summary]"),
      summaryProduct: get("[data-quote-summary-product]"),
      summaryQuantity: get("[data-quote-summary-quantity]"),
      summaryModality: get("[data-quote-summary-modality]"),
      summaryFlavor: get("[data-quote-summary-flavor]"),
      summaryDate: get("[data-quote-summary-date]"),
      summaryFulfillment: get("[data-quote-summary-fulfillment]"),
      summaryUnitPriceRow: get("[data-quote-summary-unit-price-row]"),
      summaryUnitPrice: get("[data-quote-summary-unit-price]"),
      summaryProductPrice: get("[data-quote-summary-product-price]"),
      summaryShippingRow: get("[data-quote-summary-shipping-row]"),
      summaryShipping: get("[data-quote-summary-shipping]"),
      summaryTotal: get("[data-quote-summary-total]"),
      whatsapp: get("[data-quote-whatsapp]"),
      copy: get("[data-quote-copy]"),
      reset: get("[data-quote-reset]"),
      status: get("[data-quote-status]"),
      logout: get("[data-quote-logout]"),
    };

    const requiredFields = [
      fields.customer,
      fields.type,
      fields.modality,
      fields.product,
      fields.flavor,
      fields.sizeOptions,
      fields.personalizedOrder,
      fields.sizeField,
      fields.size,
      fields.units,
      fields.grams,
      fields.quantityInstructions,
      fields.unitsLabel,
      fields.gramsLabel,
      fields.deliveryDate,
      fields.productPrice,
      fields.productPriceLabel,
      fields.productPriceHelp,
      fields.summaryUnitPriceRow,
      fields.summaryUnitPrice,
    ];
    if (requiredFields.some((field) => !(field instanceof HTMLElement))) return;

    const DOSIM_WHATSAPP = "5531996154698";
    const GRAMS_PER_UNIT = 20;
    const PERSONALIZED_SIZES = {
      4: { label: "4 cm", unitWeightGrams: 8 },
      5: { label: "5 cm", unitWeightGrams: 10 },
      6: { label: "6 cm", unitWeightGrams: 20 },
    };
    const SAVORY_TYPES = new Set(["salgado", "congelado"]);
    const SAVORY_SIZE = { label: "5 cm / 4 mm", unitWeightGrams: 8 };
    const SAVORY_PRICE_TIERS = {
      salgado: {
        200: { units: 25, price: 18 },
        300: { units: 37, price: 26 },
        500: { units: 62, price: 40 },
      },
      congelado: {
        200: { units: 25, price: 16.9 },
        300: { units: 37, price: 24.9 },
        500: { units: 62, price: 36.9 },
      },
    };
    const SHIPPING_RULES = {
      origin: { lat: -19.87986, lng: -44.0284 },
      priceBands: [
        { maximumKm: 2, amount: 7 },
        { maximumKm: 5, amount: 8 },
        { maximumKm: 8, amount: 11 },
        { maximumKm: 12, amount: 14 },
        { maximumKm: 16, amount: 21.5 },
        { maximumKm: 20, amount: 27 },
      ],
      maximumRouteKm: 20,
    };

    const TYPE_LABELS = {
      amanteigado: "Amanteigado DoSim",
      "ninho-nutella": "Ninho com Nutella",
      salgado: "Salgado de queijo",
      congelado: "Queijo para assar · congelado",
    };
    const MODALITY_LABELS = {
      presenteavel: "Presenteável",
      gramatura: "Por gramatura",
      personalizado: "Personalizado",
    };
    const FLAVORS = {
      amanteigado: [
        { id: "tradicional", label: "Tradicional", price500: 40 },
        { id: "chocolate", label: "Chocolate", price500: 47 },
        { id: "canela", label: "Canela", price500: 45 },
        { id: "capuccino", label: "Capuccino", price500: 49 },
        { id: "ovomaltine", label: "Ovomaltine", price500: 49 },
        { id: "misto", label: "Misto", price500: 49 },
      ],
      "ninho-nutella": [{ id: "ninho-nutella", label: "Ninho com Nutella", price500: 55 }],
      salgado: [{ id: "queijo", label: "Queijo", price500: 40 }],
      congelado: [{ id: "queijo-assar", label: "Queijo para assar", price500: 36.9 }],
    };
    const PRODUCTS = {
      presenteavel: {
        amanteigado: [
          { id: "3x-sim", label: "3x Sim", packageUnits: 3, packagePrice: 12 },
          { id: "quarteto", label: "Quarteto DoSim", packageUnits: 4, packagePrice: 12 },
          { id: "cha-simco", label: "Chá das SIMco", packageUnits: 6, packagePrice: 22 },
          { id: "encontro-09", label: "Encontro às 09", packageUnits: 9, packagePrice: 18 },
        ],
        "ninho-nutella": [
          { id: "quarteto-ninho", label: "Quarteto DoSim · Ninho com Nutella", packageUnits: 4, packagePrice: 14 },
        ],
      },
      gramatura: {
        amanteigado: [{ id: "dosim-gramatura", label: "DoSim por gramatura" }],
        "ninho-nutella": [{ id: "ninho-gramatura", label: "Ninho com Nutella por gramatura" }],
        salgado: [{ id: "queijo-gramatura", label: "Queijo por gramatura" }],
        congelado: [{ id: "queijo-assar-gramatura", label: "Queijo para assar · congelado" }],
      },
      personalizado: {
        amanteigado: [{ id: "personalizado", label: "Biscoito personalizado", price500: 49 }],
      },
    };
    const MANUAL_PRODUCT = { id: "sob-consulta", label: "Projeto sob consulta · definir valor manualmente", manual: true };

    const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
    const positiveNumber = (value) => {
      const number = Number.parseFloat(String(value));
      return Number.isFinite(number) && number > 0 ? number : 0;
    };
    const formatCurrency = (value) => brl.format(Number.isFinite(value) ? value : 0);
    const formatWeight = (grams) => {
      if (grams >= 1000) {
        const kilograms = grams / 1000;
        return `${kilograms.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg`;
      }
      return `${Math.round(grams).toLocaleString("pt-BR")} g`;
    };
    const formatDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "A combinar";
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    };
    const getFulfillment = () => form.querySelector('input[name="quoteFulfillment"]:checked')?.value || "retirada";
    const getProducts = () => PRODUCTS[fields.modality.value]?.[fields.type.value] || [MANUAL_PRODUCT];
    const getSelectedProduct = () => getProducts().find((product) => product.id === fields.product.value) || null;
    const getSelectedFlavor = () => (FLAVORS[fields.type.value] || []).find((flavor) => flavor.id === fields.flavor.value) || null;
    const getSelectedSize = () => PERSONALIZED_SIZES[fields.size.value] || PERSONALIZED_SIZES[6];
    const isPresentable = () => fields.modality.value === "presenteavel";
    const isSavoryByWeight = () => fields.modality.value === "gramatura" && SAVORY_TYPES.has(fields.type.value);
    const usesSelectableSize = () => ["gramatura", "personalizado"].includes(fields.modality.value) && !isSavoryByWeight();
    const getUnitWeight = () => (isSavoryByWeight() ? SAVORY_SIZE.unitWeightGrams : usesSelectableSize() ? getSelectedSize().unitWeightGrams : GRAMS_PER_UNIT);
    const getSavoryTierByGrams = (grams) => SAVORY_PRICE_TIERS[fields.type.value]?.[Math.round(grams)] || null;
    const getSavoryTierByUnits = (units) =>
      Object.entries(SAVORY_PRICE_TIERS[fields.type.value] || {}).find(([, tier]) => tier.units === units) || null;
    const getProductionUnits = () => {
      const units = Math.max(0, Math.round(positiveNumber(fields.units.value)));
      const product = getSelectedProduct();
      return isPresentable() && product?.packageUnits ? units * product.packageUnits : units;
    };

    let shippingQuote = null;
    let isCalculatingShipping = false;

    const setOptions = (select, options, placeholder) => {
      select.replaceChildren();
      if (!options.length) {
        const option = new Option(placeholder, "");
        select.add(option);
        select.disabled = true;
        return;
      }
      options.forEach((item) => {
        const label = isPresentable() && Number.isFinite(item.packagePrice)
          ? `${item.label} · ${formatCurrency(item.packagePrice)} por presenteável`
          : item.label;
        select.add(new Option(label, item.id));
      });
      select.disabled = false;
    };

    const updateProductOptions = () => {
      if (!fields.type.value || !fields.modality.value) {
        setOptions(fields.product, [], "Escolha o tipo e a modalidade");
        return;
      }
      setOptions(fields.product, getProducts(), "Escolha um produto");
    };

    const updateFlavorOptions = () => {
      if (!fields.type.value) {
        setOptions(fields.flavor, [], "Escolha o tipo de biscoito");
        return;
      }
      setOptions(fields.flavor, FLAVORS[fields.type.value] || [], "Sabor sob consulta");
    };

    const updateQuantityPresentation = () => {
      const presentable = isPresentable();
      const product = getSelectedProduct();
      const productionUnits = getProductionUnits();
      const grams = positiveNumber(fields.grams.value);

      fields.quantityInstructions.textContent = presentable
        ? "Informe quantos presenteáveis serão pedidos. A produção será calculada automaticamente."
        : "Preencha unidades ou gramatura. O outro campo será calculado automaticamente.";
      fields.unitsLabel.textContent = presentable ? "Quantidade de presenteáveis" : "Unidades";
      fields.gramsLabel.textContent = presentable ? "Gramatura aproximada da produção" : "Gramatura";
      fields.grams.readOnly = presentable;
      fields.productPriceLabel.textContent = presentable ? "Valor por presenteável" : "Valor dos produtos";
      fields.productPriceHelp.textContent = presentable
        ? "Valor unitário sugerido. O total será calculado pela quantidade de presenteáveis."
        : "O valor sugerido pode ser ajustado antes do envio.";

      if (presentable && product?.packageUnits) {
        const packageDescription = `${product.packageUnits} ${product.packageUnits === 1 ? "biscoito" : "biscoitos"}`;
        const productionDescription = productionUnits
          ? ` Produção estimada: ${productionUnits.toLocaleString("pt-BR")} ${productionUnits === 1 ? "biscoito" : "biscoitos"}${grams ? `, aprox. ${formatWeight(grams)}` : ""}.`
          : "";
        fields.quantityNote.textContent = `Cada ${product.label} contém ${packageDescription}.${productionDescription}`;
        return;
      }

      const unitWeight = getUnitWeight();
      fields.quantityNote.textContent = isSavoryByWeight()
        ? `Conversão aproximada para o salgado de ${SAVORY_SIZE.label}: ${SAVORY_SIZE.unitWeightGrams} g por unidade.`
        : usesSelectableSize()
        ? `Conversão aproximada para a forma de ${getSelectedSize().label}: ${unitWeight} g por unidade.`
        : `Conversão aproximada: ${GRAMS_PER_UNIT} g por unidade.`;
    };

    const updatePersonalizedVisibility = () => {
      const personalized = fields.modality.value === "personalizado";
      const selectableSize = usesSelectableSize();
      fields.sizeOptions.hidden = !selectableSize;
      fields.personalizedOrder.hidden = !personalized;
      fields.sizeField.hidden = !selectableSize;
      fields.personalizedType.required = personalized;
      fields.size.required = selectableSize;
      updateQuantityPresentation();
    };

    const setDefaultQuantity = () => {
      if (isSavoryByWeight()) {
        const grams = 500;
        const tier = getSavoryTierByGrams(grams);
        fields.grams.value = String(grams);
        fields.units.value = String(tier.units);
        updateQuantityPresentation();
        return;
      }
      if (usesSelectableSize()) {
        const grams = 500;
        fields.grams.value = String(grams);
        fields.units.value = String(Math.round(grams / getUnitWeight()));
        updateQuantityPresentation();
        return;
      }
      const units = isPresentable() ? 1 : 25;
      fields.units.value = String(units);
      fields.grams.value = String(getProductionUnits() * GRAMS_PER_UNIT);
      updateQuantityPresentation();
    };

    const syncFromUnits = () => {
      const units = Math.max(0, Math.round(positiveNumber(fields.units.value)));
      fields.units.value = units ? String(units) : "";
      const savoryTier = isSavoryByWeight() ? getSavoryTierByUnits(units) : null;
      fields.grams.value = units ? String(savoryTier?.[0] || getProductionUnits() * getUnitWeight()) : "";
      updateQuantityPresentation();
    };

    const syncFromGrams = () => {
      const grams = positiveNumber(fields.grams.value);
      fields.grams.value = grams ? String(Math.round(grams)) : "";
      const product = getSelectedProduct();
      const gramsPerSelection = isPresentable() && product?.packageUnits
        ? product.packageUnits * GRAMS_PER_UNIT
        : getUnitWeight();
      const savoryTier = isSavoryByWeight() ? getSavoryTierByGrams(grams) : null;
      const convertedUnits = isSavoryByWeight()
        ? Math.floor(grams / gramsPerSelection)
        : Math.round(grams / gramsPerSelection);
      fields.units.value = grams ? String(savoryTier?.units || Math.max(1, convertedUnits)) : "";
      if (isPresentable()) {
        fields.grams.value = fields.units.value ? String(getProductionUnits() * GRAMS_PER_UNIT) : "";
      }
      updateQuantityPresentation();
    };

    const calculateSuggestedPrice = () => {
      const product = getSelectedProduct();
      const flavor = getSelectedFlavor();
      const units = positiveNumber(fields.units.value);
      const grams = positiveNumber(fields.grams.value);
      if (!product || product.manual || !units || !grams) return 0;

      if (isPresentable() && product.packageUnits) {
        return product.packagePrice;
      }

      if (isSavoryByWeight()) {
        const tier = getSavoryTierByGrams(grams);
        if (tier) return tier.price;
      }

      const price500 = fields.modality.value === "personalizado" ? product.price500 : flavor?.price500;
      if (!Number.isFinite(price500)) return 0;
      const production = (grams / 500) * price500;
      const cliche = fields.modality.value === "personalizado" && fields.personalizedType.value === "primeiro-pedido" ? 40 : 0;
      return production + cliche;
    };

    const applySuggestedPrice = () => {
      const price = calculateSuggestedPrice();
      fields.productPrice.value = price ? price.toFixed(2) : "";
      updateSummary();
    };

    const getPresentationLabel = () => {
      const product = getSelectedProduct();
      if (!product) return "—";
      if (!isPresentable() || !product.packageUnits) return product.label;
      const units = positiveNumber(fields.units.value);
      const presentables = Math.max(1, Math.round(units));
      return `${presentables} × ${product.label}`;
    };

    const getProductTotal = () => {
      const enteredPrice = positiveNumber(fields.productPrice.value);
      return isPresentable() ? enteredPrice * Math.round(positiveNumber(fields.units.value)) : enteredPrice;
    };

    const buildDeliveryAddress = () =>
      [fields.street.value, fields.number.value, fields.neighborhood.value, fields.city.value, fields.cep.value, "Brasil"]
        .map(normalizeText)
        .filter(Boolean)
        .join(", ");

    const clearShippingQuote = () => {
      shippingQuote = null;
      if (getFulfillment() === "entrega") {
        fields.shippingStatus.textContent = "Endereço alterado. Calcule o frete novamente.";
      }
      updateSummary();
    };

    const getShippingFeeForRoute = (routeKm) =>
      SHIPPING_RULES.priceBands.find((band) => routeKm <= band.maximumKm)?.amount ?? null;

    const calculateShipping = async () => {
      const address = buildDeliveryAddress();
      if (!normalizeText(fields.street.value) || !normalizeText(fields.number.value) || !normalizeText(fields.city.value)) {
        fields.shippingStatus.textContent = "Preencha rua, número e cidade para calcular o frete.";
        return false;
      }

      isCalculatingShipping = true;
      fields.calculateShipping.disabled = true;
      fields.calculateShipping.textContent = "Calculando...";
      fields.shippingStatus.textContent = "Consultando a distância da rota...";

      try {
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(address)}`
        );
        if (!geocodeResponse.ok) throw new Error("Não foi possível localizar o endereço.");
        const locations = await geocodeResponse.json();
        const destination = locations[0];
        if (!destination) throw new Error("Não encontramos esse endereço. Confira os dados informados.");

        const routeResponse = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${SHIPPING_RULES.origin.lng},${SHIPPING_RULES.origin.lat};${destination.lon},${destination.lat}?overview=false`
        );
        if (!routeResponse.ok) throw new Error("Não foi possível calcular a rota agora.");
        const routeData = await routeResponse.json();
        const routeMeters = routeData.routes?.[0]?.distance;
        if (!Number.isFinite(routeMeters)) throw new Error("Não foi possível calcular a rota agora.");

        const routeKm = routeMeters / 1000;
        if (routeKm > SHIPPING_RULES.maximumRouteKm) {
          shippingQuote = { available: false, routeKm, address };
          fields.shippingStatus.textContent = `Entrega indisponível para ${routeKm.toFixed(1).replace(".", ",")} km de rota. Nosso limite é ${SHIPPING_RULES.maximumRouteKm} km.`;
          updateSummary();
          return false;
        }

        const amount = getShippingFeeForRoute(routeKm);
        if (!Number.isFinite(amount)) throw new Error("Não foi possível calcular o frete para essa distância.");
        shippingQuote = { available: true, amount, routeKm, address };
        fields.shippingStatus.textContent = `Frete estimado: ${formatCurrency(amount)} para ${routeKm.toFixed(1).replace(".", ",")} km de rota.`;
        updateSummary();
        return true;
      } catch (error) {
        shippingQuote = null;
        fields.shippingStatus.textContent = error instanceof Error ? error.message : "Não foi possível calcular o frete agora.";
        updateSummary();
        return false;
      } finally {
        isCalculatingShipping = false;
        fields.calculateShipping.disabled = false;
        fields.calculateShipping.textContent = "Calcular frete";
      }
    };

    function updateSummary() {
      const product = getSelectedProduct();
      const flavor = getSelectedFlavor();
      const ready = Boolean(fields.type.value && fields.modality.value && product);
      fields.summaryEmpty.hidden = ready;
      fields.summary.hidden = !ready;
      if (!ready) return;

      const units = positiveNumber(fields.units.value);
      const grams = positiveNumber(fields.grams.value);
      const enteredPrice = positiveNumber(fields.productPrice.value);
      const productPrice = getProductTotal();
      const productionUnits = getProductionUnits();
      const isDelivery = getFulfillment() === "entrega";
      const shipping = isDelivery && shippingQuote?.available ? shippingQuote.amount : 0;
      fields.summaryProduct.textContent =
        isSavoryByWeight()
          ? `${getPresentationLabel()} · ${SAVORY_SIZE.label}`
          : usesSelectableSize()
          ? `${getPresentationLabel()} · ${getSelectedSize().label}`
          : getPresentationLabel();
      fields.summaryQuantity.textContent = units && grams
        ? isPresentable()
          ? `${Math.round(units)} ${Math.round(units) === 1 ? "presenteável" : "presenteáveis"} · ${productionUnits.toLocaleString("pt-BR")} ${productionUnits === 1 ? "biscoito" : "biscoitos"} · aprox. ${formatWeight(grams)}`
          : `${Math.round(units)} un. · aprox. ${formatWeight(grams)}`
        : "Informe a quantidade";
      fields.summaryModality.textContent = MODALITY_LABELS[fields.modality.value] || "—";
      fields.summaryFlavor.textContent = flavor?.label || "Sob consulta";
      fields.summaryDate.textContent = formatDate(fields.deliveryDate.value);
      fields.summaryFulfillment.textContent = isDelivery
        ? shippingQuote?.available
          ? `Entrega · ${shippingQuote.routeKm.toFixed(1).replace(".", ",")} km`
          : "Entrega · frete pendente"
        : "Retirada na DoSim";
      fields.summaryUnitPriceRow.hidden = !isPresentable();
      fields.summaryUnitPrice.textContent = isPresentable() ? `${formatCurrency(enteredPrice)} / presenteável` : "—";
      fields.summaryProductPrice.textContent = formatCurrency(productPrice);
      fields.summaryShippingRow.hidden = !isDelivery;
      fields.summaryShipping.textContent = shippingQuote?.available ? formatCurrency(shipping) : "A calcular";
      fields.summaryTotal.textContent = formatCurrency(productPrice + shipping);
    }

    const setDeliveryMode = () => {
      const isDelivery = getFulfillment() === "entrega";
      fields.deliveryPanel.hidden = !isDelivery;
      [fields.street, fields.number, fields.neighborhood, fields.city, fields.cep].forEach((input) => {
        input.required = isDelivery;
      });
      if (!isDelivery) shippingQuote = null;
      updateSummary();
    };

    const validateQuote = () => {
      fields.error.textContent = "";
      if (!form.reportValidity()) {
        fields.error.textContent = "Confira os campos destacados antes de gerar o orçamento.";
        return false;
      }
      if (!positiveNumber(fields.units.value) || !positiveNumber(fields.grams.value)) {
        fields.error.textContent = "Informe a quantidade em unidades ou em gramatura.";
        return false;
      }
      if (getFulfillment() === "entrega") {
        if (isCalculatingShipping) {
          fields.error.textContent = "Aguarde o cálculo do frete terminar.";
          return false;
        }
        if (!shippingQuote?.available || shippingQuote.address !== buildDeliveryAddress()) {
          fields.error.textContent = "Calcule o frete para este endereço antes de gerar a mensagem.";
          return false;
        }
      }
      return true;
    };

    const buildMessage = () => {
      const enteredPrice = positiveNumber(fields.productPrice.value);
      const productPrice = getProductTotal();
      const isDelivery = getFulfillment() === "entrega";
      const shipping = isDelivery && shippingQuote?.available ? shippingQuote.amount : 0;
      const flavor = getSelectedFlavor();
      const personalized = fields.modality.value === "personalizado";
      const lines = [
        "*Orçamento DoSim 🤎*",
        "",
        `*Cliente:* ${normalizeText(fields.customer.value)}`,
      ];

      if (normalizeText(fields.customerWhatsapp.value)) {
        lines.push(`*Contato:* ${normalizeText(fields.customerWhatsapp.value)}`);
      }

      lines.push(
        "",
        `🤎 *${getPresentationLabel()}*`,
        `${TYPE_LABELS[fields.type.value]} · ${MODALITY_LABELS[fields.modality.value]}`,
        `*Sabor:* ${flavor?.label || "Sob consulta"}`
      );

      if (isPresentable()) {
        const presentables = Math.round(positiveNumber(fields.units.value));
        const productionUnits = getProductionUnits();
        lines.push(
          `*Quantidade:* ${presentables} ${presentables === 1 ? "presenteável" : "presenteáveis"}`,
          `*Produção estimada:* ${productionUnits} ${productionUnits === 1 ? "biscoito" : "biscoitos"} (aprox. ${formatWeight(positiveNumber(fields.grams.value))})`,
          `*Valor unitário:* ${formatCurrency(enteredPrice)} por presenteável`
        );
      } else {
        lines.push(`*Quantidade:* ${Math.round(positiveNumber(fields.units.value))} unidades (aprox. ${formatWeight(positiveNumber(fields.grams.value))})`);
      }

      if (usesSelectableSize()) {
        lines.push(`*Tamanho da forma:* ${getSelectedSize().label} (aprox. ${getSelectedSize().unitWeightGrams} g por unidade)`);
      } else if (isSavoryByWeight()) {
        lines.push(`*Tamanho:* ${SAVORY_SIZE.label} (aprox. ${SAVORY_SIZE.unitWeightGrams} g por unidade)`);
      }

      if (personalized) {
        lines.push(
          fields.personalizedType.value === "primeiro-pedido"
            ? "*Personalização:* primeiro pedido, com confecção do clichê"
            : "*Personalização:* reposição com clichê existente"
        );
      }

      lines.push(`*Data desejada:* ${formatDate(fields.deliveryDate.value)}`);
      if (isDelivery) {
        lines.push(`*Entrega:* ${shippingQuote.address}`);
        if (normalizeText(fields.complement.value)) lines.push(`*Complemento:* ${normalizeText(fields.complement.value)}`);
        if (normalizeText(fields.reference.value)) lines.push(`*Referência:* ${normalizeText(fields.reference.value)}`);
      } else {
        lines.push("*Recebimento:* retirada na DoSim");
      }

      lines.push("", `*Produtos:* ${formatCurrency(productPrice)}`);
      if (isDelivery) {
        lines.push(`*Frete:* ${formatCurrency(shipping)} (${shippingQuote.routeKm.toFixed(1).replace(".", ",")} km)`);
      }
      lines.push(`*Total estimado:* ${formatCurrency(productPrice + shipping)}`);

      if (normalizeText(fields.notes.value)) {
        lines.push("", `*Observações:* ${normalizeText(fields.notes.value)}`);
      }
      lines.push("", "DoSim — afeto em cada detalhe, sabor em cada momento. 🤎");
      return lines.join("\n");
    };

    const copyMessage = async () => {
      if (!validateQuote()) return;
      const message = buildMessage();
      try {
        await navigator.clipboard.writeText(message);
      } catch {
        const helper = document.createElement("textarea");
        helper.value = message;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.append(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
      }
      fields.status.textContent = "Mensagem copiada. Prontinha para compartilhar!";
    };

    const resetQuote = () => {
      form.reset();
      shippingQuote = null;
      fields.error.textContent = "";
      fields.status.textContent = "";
      fields.shippingStatus.textContent = "Preencha o endereço para calcular o frete.";
      updateProductOptions();
      updateFlavorOptions();
      updatePersonalizedVisibility();
      setDeliveryMode();
      fields.productPrice.value = "";
      fields.customer.focus();
    };

    fields.type.addEventListener("change", () => {
      updateProductOptions();
      updateFlavorOptions();
      updatePersonalizedVisibility();
      setDefaultQuantity();
      applySuggestedPrice();
    });
    fields.modality.addEventListener("change", () => {
      updateProductOptions();
      updatePersonalizedVisibility();
      setDefaultQuantity();
      applySuggestedPrice();
    });
    fields.product.addEventListener("change", () => {
      setDefaultQuantity();
      applySuggestedPrice();
    });
    fields.flavor.addEventListener("change", applySuggestedPrice);
    fields.personalizedType.addEventListener("change", applySuggestedPrice);
    fields.size.addEventListener("change", () => {
      updatePersonalizedVisibility();
      syncFromGrams();
      applySuggestedPrice();
    });
    fields.units.addEventListener("input", () => {
      syncFromUnits();
      applySuggestedPrice();
    });
    fields.units.addEventListener("change", () => {
      syncFromUnits();
      applySuggestedPrice();
    });
    fields.grams.addEventListener("input", () => {
      syncFromGrams();
      applySuggestedPrice();
    });
    fields.grams.addEventListener("change", () => {
      syncFromGrams();
      applySuggestedPrice();
    });
    fields.productPrice.addEventListener("input", updateSummary);
    fields.deliveryDate.addEventListener("change", updateSummary);
    form.querySelectorAll('input[name="quoteFulfillment"]').forEach((input) => input.addEventListener("change", setDeliveryMode));
    [fields.street, fields.number, fields.neighborhood, fields.city, fields.cep].forEach((input) => input.addEventListener("input", clearShippingQuote));
    fields.calculateShipping.addEventListener("click", calculateShipping);
    fields.whatsapp.addEventListener("click", () => {
      if (!validateQuote()) return;
      globalThis.open(`https://wa.me/${DOSIM_WHATSAPP}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener,noreferrer");
      fields.status.textContent = "Orçamento aberto no WhatsApp da DoSim.";
    });
    fields.copy.addEventListener("click", copyMessage);
    fields.reset.addEventListener("click", resetQuote);
    fields.logout.addEventListener("click", () => {
      auth.logout();
      globalThis.location.replace("/area-interna");
    });

    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    fields.deliveryDate.min = localToday;
    updateProductOptions();
    updateFlavorOptions();
    updatePersonalizedVisibility();
    setDeliveryMode();
    updateSummary();
  });
})();
