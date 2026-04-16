(() => {
  const WHATSAPP_NUMBER = "55XXXXXXXXXXX";

  const ORDER_TYPES = {
    "primeiro-pedido": {
      label: "Primeiro pedido (com molde)",
      leadTime: "15 dias",
    },
    reposicao: {
      label: "Reposição (molde existente)",
      leadTime: "3 dias",
    },
  };

  const PACKAGES = {
    "primeiro-pedido": {
      title: "Primeiro Pedido | Molde + Produção",
      defaultOrderType: "primeiro-pedido",
      packageLeadTime: "15 dias",
      volumeLabel: "25 / 40 / 55",
      minQty: 25,
      note: "No primeiro pedido, precisamos solicitar a confecção da forma com o fornecedor antes da produção.",
    },
    reposicao: {
      title: "Reposição | Mesmo Molde, Mais Rápido",
      defaultOrderType: "reposicao",
      packageLeadTime: "3 dias (a partir do segundo pedido)",
      volumeLabel: "A partir de 25 unidades",
      minQty: 25,
      note: "Como a forma já existe, a reposição entra em um fluxo mais rápido e não precisa de nova criação.",
    },
    assinatura: {
      title: "Assinatura | mínimo 3 meses",
      defaultOrderType: "primeiro-pedido",
      packageLeadTime: "1ª entrega: 15 dias | demais entregas: 3 dias",
      volumeLabel: "25 / 40 / 55 por remessa",
      minQty: 25,
      note: "Na assinatura, a primeira remessa segue o fluxo do primeiro pedido e as seguintes entram como reposição.",
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector("[data-bp-page]");
    if (!page) {
      return;
    }

    setupBiscoitosPersonalizados(page);
  });

  function setupBiscoitosPersonalizados(page) {
    const form = document.getElementById("form-biscoitos-personalizados");
    const formSection = document.getElementById("formulario-personalizados");
    const packageField = document.getElementById("bp-pacote");
    const quantityField = document.getElementById("bp-quantidade");
    const whatsappField = document.getElementById("bp-whatsapp");
    const statusField = page.querySelector("[data-bp-form-status]");
    const quantityErrorField = page.querySelector("[data-bp-quantity-error]");
    const liveRegion = page.querySelector("[data-bp-live-region]");
    const copyButton = page.querySelector("[data-bp-copy-message]");
    const packageCards = Array.from(page.querySelectorAll("[data-bp-package-card]"));

    if (!form || !formSection || !packageField || !quantityField || !whatsappField || !statusField) {
      return;
    }

    const typeRadios = Array.from(form.querySelectorAll('input[name="tipoPedido"]'));
    const state = {
      selectedPackageKey: "",
    };

    setDateMinValue(form.elements.namedItem("dataDesejada"));
    updateRadioCards(typeRadios);
    updateSelectionSummary(page, state.selectedPackageKey, getSelectedOrderType(typeRadios));

    packageCards.forEach((card) => {
      const button = card.querySelector("[data-bp-select-package]");
      const packageKey = card.getAttribute("data-bp-package-key") || "";

      if (!button || !PACKAGES[packageKey]) {
        return;
      }

      button.addEventListener("click", () => {
        selectPackage({
          packageKey,
          packageCards,
          page,
          state,
          packageField,
          quantityField,
          typeRadios,
          formSection,
          liveRegion,
          statusField,
          quantityErrorField,
        });
      });
    });

    typeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        updateRadioCards(typeRadios);
        updateSelectionSummary(page, state.selectedPackageKey, getSelectedOrderType(typeRadios));
      });
    });

    quantityField.addEventListener("input", () => {
      clearQuantityError(quantityField, quantityErrorField);
      validateQuantity(state.selectedPackageKey, quantityField, quantityErrorField);
    });

    whatsappField.addEventListener("input", () => {
      whatsappField.setCustomValidity("");
      clearStatus(statusField);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = validateAndBuildMessage({
        form,
        page,
        state,
        quantityField,
        quantityErrorField,
        whatsappField,
        statusField,
        typeRadios,
        requireConfiguredNumber: true,
      });

      if (!result) {
        return;
      }

      const targetNumber = sanitizeDigits(WHATSAPP_NUMBER);
      const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(result.message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setStatus(statusField, "Mensagem pronta. O WhatsApp foi aberto em uma nova aba.");
    });

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const result = validateAndBuildMessage({
          form,
          page,
          state,
          quantityField,
          quantityErrorField,
          whatsappField,
          statusField,
          typeRadios,
          requireConfiguredNumber: false,
        });

        if (!result) {
          return;
        }

        const copied = await copyText(result.message);
        if (copied) {
          setStatus(statusField, "Mensagem copiada. Agora você pode colar no WhatsApp.");
          announce(liveRegion, "Mensagem copiada.");
          return;
        }

        setStatus(statusField, "Não foi possível copiar automaticamente. Tente novamente.", true);
      });
    }
  }

  function selectPackage({
    packageKey,
    packageCards,
    page,
    state,
    packageField,
    quantityField,
    typeRadios,
    formSection,
    liveRegion,
    statusField,
    quantityErrorField,
  }) {
    const selectedPackage = PACKAGES[packageKey];
    if (!selectedPackage) {
      return;
    }

    state.selectedPackageKey = packageKey;
    packageField.value = selectedPackage.title;
    quantityField.min = String(selectedPackage.minQty);

    packageCards.forEach((card) => {
      const isSelected = card.getAttribute("data-bp-package-key") === packageKey;
      card.classList.toggle("is-selected", isSelected);
      const button = card.querySelector("[data-bp-select-package]");
      if (button) {
        button.setAttribute("aria-pressed", String(isSelected));
      }
    });

    setOrderType(typeRadios, selectedPackage.defaultOrderType);
    updateSelectionSummary(page, packageKey, getSelectedOrderType(typeRadios));
    clearStatus(statusField);
    clearQuantityError(quantityField, quantityErrorField);
    validateQuantity(packageKey, quantityField, quantityErrorField);

    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      packageField.focus({ preventScroll: true });
    }, 350);

    announce(liveRegion, `${selectedPackage.title} selecionado.`);
  }

  function validateAndBuildMessage({
    form,
    page,
    state,
    quantityField,
    quantityErrorField,
    whatsappField,
    statusField,
    typeRadios,
    requireConfiguredNumber,
  }) {
    clearStatus(statusField);
    clearQuantityError(quantityField, quantityErrorField);
    whatsappField.setCustomValidity("");

    if (!state.selectedPackageKey) {
      setStatus(statusField, "Selecione um pacote acima para preencher o campo de pacote escolhido.", true);
      document.getElementById("pacotes")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return null;
    }

    if (!isValidWhatsApp(whatsappField.value)) {
      whatsappField.setCustomValidity(
        "Digite um WhatsApp válido com DDD. Você pode usar números, espaços, parênteses e traços."
      );
    }

    if (!form.reportValidity()) {
      return null;
    }

    const quantityIsValid = validateQuantity(state.selectedPackageKey, quantityField, quantityErrorField);
    if (!quantityIsValid) {
      quantityField.focus();
      return null;
    }

    if (requireConfiguredNumber && !isConfiguredWhatsAppNumber(WHATSAPP_NUMBER)) {
      setStatus(
        statusField,
        "Configure WHATSAPP_NUMBER no topo de js/biscoitos-personalizados.js antes de usar o envio pelo WhatsApp.",
        true
      );
      return null;
    }

    const message = buildMessage(form, state.selectedPackageKey, getSelectedOrderType(typeRadios), page);
    return { message };
  }

  function buildMessage(form, packageKey, selectedOrderType, page) {
    const data = new FormData(form);
    const packageData = PACKAGES[packageKey];
    const orderType = ORDER_TYPES[selectedOrderType] || ORDER_TYPES["primeiro-pedido"];
    const packageLeadTime = packageData.packageLeadTime;
    const sanitizedWhatsapp = sanitizeDigits(String(data.get("whatsapp") || ""));

    const lines = [
      "Olá, DoSim! Quero solicitar um pedido de biscoitos personalizados.",
      "",
      `Pacote escolhido: ${packageData.title}`,
      `Nome/Empresa: ${String(data.get("nomeEmpresa") || "").trim()}`,
      `WhatsApp: ${sanitizedWhatsapp || "Não informado"}`,
      `Data desejada: ${formatDate(String(data.get("dataDesejada") || ""))}`,
      `Cidade/Bairro ou Endereço: ${String(data.get("localEntrega") || "").trim()}`,
      `Quantidade: ${String(data.get("quantidade") || "").trim()}`,
      `Tamanho: ${String(data.get("tamanho") || "").trim()}`,
      `Tipo de pedido: ${orderType.label}`,
      `Prazo do pacote: ${packageLeadTime || packageData.packageLeadTime}`,
      `Logo (URL): ${String(data.get("logoUrl") || "").trim()}`,
      `Observações: ${withFallback(String(data.get("observacoes") || "").trim())}`,
      "",
      `Observação do pacote: ${packageData.note}`,
    ];

    return lines.join("\n");
  }

  function updateSelectionSummary(page, packageKey, selectedOrderType) {
    const packageData = PACKAGES[packageKey];
    const orderType = ORDER_TYPES[selectedOrderType] || null;
    const orderTypeNote = page.querySelector("[data-bp-order-type-note]");

    if (!packageData) {
      if (orderTypeNote) {
        orderTypeNote.textContent =
          "Ao escolher um tipo de pedido, o formulário abaixo é preenchido automaticamente com a opção correspondente.";
      }
      return;
    }

    if (orderTypeNote) {
      if (packageKey === "assinatura") {
        orderTypeNote.textContent =
          "Na assinatura, a primeira remessa segue o fluxo de primeiro pedido e as próximas aproveitam a forma já pronta.";
        return;
      }

      orderTypeNote.textContent = orderType
        ? `Você selecionou "${orderType.label}", então o formulário abaixo seguirá esse fluxo.`
        : "Selecione um tipo de pedido para alinhar a regra de prazo.";
    }
  }

  function validateQuantity(packageKey, quantityField, quantityErrorField) {
    const packageData = PACKAGES[packageKey];
    const quantity = Number(quantityField.value);

    if (!packageData || !quantityField.value) {
      quantityField.removeAttribute("aria-invalid");
      quantityErrorField.textContent = "";
      return true;
    }

    if (!Number.isFinite(quantity) || quantity < packageData.minQty) {
      quantityField.setAttribute("aria-invalid", "true");
      quantityErrorField.textContent = `Este pacote exige mínimo de ${packageData.minQty} unidades.`;
      return false;
    }

    quantityField.removeAttribute("aria-invalid");
    quantityErrorField.textContent = "";
    return true;
  }

  function clearQuantityError(quantityField, quantityErrorField) {
    quantityField.removeAttribute("aria-invalid");
    quantityErrorField.textContent = "";
  }

  function setOrderType(typeRadios, orderTypeKey) {
    typeRadios.forEach((radio) => {
      radio.checked = radio.value === orderTypeKey;
    });
    updateRadioCards(typeRadios);
  }

  function getSelectedOrderType(typeRadios) {
    return typeRadios.find((radio) => radio.checked)?.value || "";
  }

  function updateRadioCards(typeRadios) {
    typeRadios.forEach((radio) => {
      const label = radio.closest(".dosim-bp-radio-card");
      if (label) {
        label.classList.toggle("is-checked", radio.checked);
      }
    });
  }

  function setDateMinValue(field) {
    if (!(field instanceof HTMLInputElement)) {
      return;
    }

    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60_000).toISOString().split("T")[0];
    field.min = localDate;
  }

  function isValidWhatsApp(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }

    if (!/^[\d\s()+-]+$/.test(trimmed)) {
      return false;
    }

    const digits = sanitizeDigits(trimmed);
    return digits.length >= 10 && digits.length <= 13;
  }

  function sanitizeDigits(value) {
    return value.replace(/\D+/g, "");
  }

  function isConfiguredWhatsAppNumber(value) {
    const digits = sanitizeDigits(value);
    return digits.length >= 12;
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Não informado";
    }

    const [year, month, day] = dateValue.split("-");
    if (!year || !month || !day) {
      return "Não informado";
    }

    return `${day}/${month}/${year}`;
  }

  function withFallback(value) {
    return value || "Não informado";
  }

  function setStatus(field, message, isError = false) {
    field.textContent = message;
    field.classList.toggle("is-error", isError);
  }

  function clearStatus(field) {
    field.textContent = "";
    field.classList.remove("is-error");
  }

  function announce(liveRegion, message) {
    if (!liveRegion) {
      return;
    }

    liveRegion.textContent = "";
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 60);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        return fallbackCopyText(text);
      }
    }

    return fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.top = "-9999px";
    document.body.appendChild(helper);
    helper.focus();
    helper.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(helper);
    return copied;
  }
})();
