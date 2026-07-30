(() => {
  const STORAGE_KEY = "dosim_orders_v1";
  const AUTH_KEY = "dosim_orders_authenticated_v1";
  const AUTH_HASH = "5b33003a928495b97792ac286d477b54dd20eb773c74ae2fb3653bc5950ad6dd";
  const FLAVORS = [
    "Tradicional",
    "Chocolate",
    "Canela",
    "Cappuccino",
    "Ninho com Nutella",
    "Ovomaltine",
    "Queijo",
    "Queijo para Assar",
  ];

  document.addEventListener("DOMContentLoaded", () => {
    const loginPanel = document.querySelector("[data-orders-login]");
    const dashboard = document.querySelector("[data-orders-dashboard]");
    const loginForm = document.querySelector("[data-orders-login-form]");
    const passwordInput = document.querySelector("[data-orders-password]");
    const loginError = document.querySelector("[data-orders-login-error]");
    const orderForm = document.querySelector("[data-orders-form]");
    const customerInput = document.querySelector("[data-orders-customer]");
    const deliveryDateInput = document.querySelector("[data-orders-delivery-date]");
    const flavorsContainer = document.querySelector("[data-orders-flavors]");
    const formError = document.querySelector("[data-orders-form-error]");
    const formTitle = document.querySelector("[data-orders-form-title]");
    const formEyebrow = document.querySelector("[data-orders-form-eyebrow]");
    const numberPreview = document.querySelector("[data-orders-number-preview]");
    const submitButton = document.querySelector("[data-orders-submit]");
    const cancelEditButton = document.querySelector("[data-orders-cancel-edit]");
    const list = document.querySelector("[data-orders-list]");
    const emptyMessage = document.querySelector("[data-orders-empty]");
    const filterSelect = document.querySelector("[data-orders-filter]");
    const openCount = document.querySelector("[data-orders-open-count]");
    const todayCount = document.querySelector("[data-orders-today-count]");
    const nextDate = document.querySelector("[data-orders-next-date]");
    const exportButton = document.querySelector("[data-orders-export]");
    const importInput = document.querySelector("[data-orders-import]");
    const logoutButton = document.querySelector("[data-orders-logout]");
    const toast = document.querySelector("[data-orders-toast]");

    if (
      !(loginPanel instanceof HTMLElement) ||
      !(dashboard instanceof HTMLElement) ||
      !(loginForm instanceof HTMLFormElement) ||
      !(passwordInput instanceof HTMLInputElement) ||
      !(orderForm instanceof HTMLFormElement) ||
      !(customerInput instanceof HTMLInputElement) ||
      !(deliveryDateInput instanceof HTMLInputElement) ||
      !(flavorsContainer instanceof HTMLElement) ||
      !(list instanceof HTMLElement)
    ) {
      return;
    }

    let state = loadState();
    let editingId = null;
    let toastTimer = null;

    const formatOrderNumber = (number) => `DS-${String(number).padStart(4, "0")}`;

    const getLocalDateKey = () => {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${now.getFullYear()}-${month}-${day}`;
    };

    const formatDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const [year, month, day] = value.split("-").map(Number);
      return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
        new Date(year, month - 1, day)
      );
    };

    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const showToast = (message) => {
      if (!(toast instanceof HTMLElement)) return;
      globalThis.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.hidden = false;
      toastTimer = globalThis.setTimeout(() => {
        toast.hidden = true;
      }, 2600);
    };

    const setAuthenticatedView = (authenticated) => {
      loginPanel.hidden = authenticated;
      dashboard.hidden = !authenticated;
      if (authenticated) {
        renderAll();
        customerInput.focus();
      } else {
        passwordInput.value = "";
        passwordInput.focus();
      }
    };

    const digest = async (value) => {
      if (!globalThis.crypto?.subtle) throw new Error("Autenticação indisponível neste navegador.");
      const bytes = new TextEncoder().encode(value);
      const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    };

    const createFlavorFields = () => {
      flavorsContainer.innerHTML = FLAVORS.map(
        (flavor, index) => `
          <div class="orders-flavor" data-flavor-row="${index}">
            <label class="orders-flavor-choice">
              <input type="checkbox" value="${escapeHtml(flavor)}" data-flavor-check="${index}" />
              <span>${escapeHtml(flavor)}</span>
            </label>
            <div class="orders-flavor-qty">
              <button type="button" data-flavor-step="${index}" data-step="-1" disabled aria-label="Diminuir ${escapeHtml(flavor)}">−</button>
              <input type="number" min="1" step="1" value="1" data-flavor-qty="${index}" disabled aria-label="Quantidade de ${escapeHtml(flavor)}" />
              <button type="button" data-flavor-step="${index}" data-step="1" disabled aria-label="Aumentar ${escapeHtml(flavor)}">+</button>
            </div>
          </div>
        `
      ).join("");
    };

    const updateFlavorRow = (index) => {
      const checkbox = flavorsContainer.querySelector(`[data-flavor-check="${index}"]`);
      const row = flavorsContainer.querySelector(`[data-flavor-row="${index}"]`);
      const quantity = flavorsContainer.querySelector(`[data-flavor-qty="${index}"]`);
      const stepButtons = Array.from(flavorsContainer.querySelectorAll(`[data-flavor-step="${index}"]`));
      if (!(checkbox instanceof HTMLInputElement) || !(row instanceof HTMLElement) || !(quantity instanceof HTMLInputElement)) return;

      row.classList.toggle("is-selected", checkbox.checked);
      quantity.disabled = !checkbox.checked;
      stepButtons.forEach((button) => {
        if (button instanceof HTMLButtonElement) button.disabled = !checkbox.checked;
      });
    };

    const collectItems = () =>
      FLAVORS.map((flavor, index) => {
        const checkbox = flavorsContainer.querySelector(`[data-flavor-check="${index}"]`);
        const quantity = flavorsContainer.querySelector(`[data-flavor-qty="${index}"]`);
        if (!(checkbox instanceof HTMLInputElement) || !(quantity instanceof HTMLInputElement) || !checkbox.checked) return null;
        const parsedQuantity = Number.parseInt(quantity.value, 10);
        return { flavor, quantity: Number.isFinite(parsedQuantity) ? Math.max(1, parsedQuantity) : 1 };
      }).filter(Boolean);

    const resetForm = () => {
      editingId = null;
      orderForm.reset();
      Array.from(flavorsContainer.querySelectorAll("[data-flavor-row]")).forEach((_, index) => updateFlavorRow(index));
      if (formError instanceof HTMLElement) formError.textContent = "";
      if (formTitle instanceof HTMLElement) formTitle.textContent = "Adicionar pedido";
      if (formEyebrow instanceof HTMLElement) formEyebrow.textContent = "Novo registro";
      if (submitButton instanceof HTMLButtonElement) submitButton.textContent = "Salvar pedido";
      if (cancelEditButton instanceof HTMLButtonElement) cancelEditButton.hidden = true;
      updateNumberPreview();
    };

    const updateNumberPreview = () => {
      if (!(numberPreview instanceof HTMLElement)) return;
      const currentOrder = editingId ? state.orders.find((order) => order.id === editingId) : null;
      numberPreview.textContent = formatOrderNumber(currentOrder?.number || state.lastNumber + 1);
    };

    const getFilteredOrders = () => {
      const filter = filterSelect instanceof HTMLSelectElement ? filterSelect.value : "open";
      return state.orders
        .filter((order) => filter === "all" || (filter === "completed" ? order.completed : !order.completed))
        .sort((left, right) => {
          if (filter === "all" && left.completed !== right.completed) return left.completed ? 1 : -1;
          return left.deliveryDate.localeCompare(right.deliveryDate) || left.number - right.number;
        });
    };

    const renderStats = () => {
      const today = getLocalDateKey();
      const openOrders = state.orders.filter((order) => !order.completed);
      const nextOrder = [...openOrders].sort(
        (left, right) => left.deliveryDate.localeCompare(right.deliveryDate) || left.number - right.number
      )[0];
      if (openCount instanceof HTMLElement) openCount.textContent = String(openOrders.length);
      if (todayCount instanceof HTMLElement) {
        todayCount.textContent = String(openOrders.filter((order) => order.deliveryDate === today).length);
      }
      if (nextDate instanceof HTMLElement) nextDate.textContent = nextOrder ? formatDate(nextOrder.deliveryDate) : "—";
    };

    const renderOrders = () => {
      const orders = getFilteredOrders();
      if (emptyMessage instanceof HTMLElement) emptyMessage.hidden = orders.length > 0;
      list.innerHTML = orders
        .map((order) => {
          const total = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return `
            <article class="order-card ${order.completed ? "is-completed" : ""}" data-order-id="${escapeHtml(order.id)}">
              <div class="order-card-head">
                <span class="order-card-number">${formatOrderNumber(order.number)}</span>
                <time class="order-card-date" datetime="${escapeHtml(order.deliveryDate)}">${escapeHtml(formatDate(order.deliveryDate))}</time>
              </div>
              <h3>${escapeHtml(order.customer)}</h3>
              <div class="order-card-flavors">
                ${order.items.map((item) => `<span>${item.quantity}× ${escapeHtml(item.flavor)}</span>`).join("")}
              </div>
              <div class="order-card-actions">
                <span class="order-card-total">${total} unidade${total === 1 ? "" : "s"}</span>
                <button class="order-action" type="button" data-order-toggle="${escapeHtml(order.id)}">${order.completed ? "Reabrir" : "Concluir"}</button>
                <button class="order-action" type="button" data-order-edit="${escapeHtml(order.id)}">Editar</button>
                <button class="order-action is-danger" type="button" data-order-delete="${escapeHtml(order.id)}">Excluir</button>
              </div>
            </article>
          `;
        })
        .join("");
    };

    const renderAll = () => {
      updateNumberPreview();
      renderStats();
      renderOrders();
    };

    const startEditing = (id) => {
      const order = state.orders.find((item) => item.id === id);
      if (!order) return;
      editingId = id;
      customerInput.value = order.customer;
      deliveryDateInput.value = order.deliveryDate;
      FLAVORS.forEach((flavor, index) => {
        const checkbox = flavorsContainer.querySelector(`[data-flavor-check="${index}"]`);
        const quantity = flavorsContainer.querySelector(`[data-flavor-qty="${index}"]`);
        const savedItem = order.items.find((item) => item.flavor === flavor);
        if (checkbox instanceof HTMLInputElement) checkbox.checked = Boolean(savedItem);
        if (quantity instanceof HTMLInputElement) quantity.value = String(savedItem?.quantity || 1);
        updateFlavorRow(index);
      });
      if (formTitle instanceof HTMLElement) formTitle.textContent = "Editar pedido";
      if (formEyebrow instanceof HTMLElement) formEyebrow.textContent = "Atualização";
      if (submitButton instanceof HTMLButtonElement) submitButton.textContent = "Salvar alterações";
      if (cancelEditButton instanceof HTMLButtonElement) cancelEditButton.hidden = false;
      if (formError instanceof HTMLElement) formError.textContent = "";
      updateNumberPreview();
      customerInput.focus();
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
    };

    const saveOrder = (event) => {
      event.preventDefault();
      const customer = customerInput.value.trim();
      const deliveryDate = deliveryDateInput.value;
      const items = collectItems();
      if (!customer || !deliveryDate || !items.length) {
        if (formError instanceof HTMLElement) {
          formError.textContent = "Preencha cliente, data e selecione pelo menos um sabor.";
        }
        return;
      }

      if (editingId) {
        const order = state.orders.find((item) => item.id === editingId);
        if (!order) return;
        order.customer = customer;
        order.deliveryDate = deliveryDate;
        order.items = items;
        order.updatedAt = new Date().toISOString();
        showToast(`${formatOrderNumber(order.number)} atualizado.`);
      } else {
        state.lastNumber += 1;
        state.orders.push({
          id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          number: state.lastNumber,
          customer,
          deliveryDate,
          items,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showToast(`${formatOrderNumber(state.lastNumber)} adicionado.`);
      }

      saveState(state);
      resetForm();
      renderAll();
    };

    const exportBackup = () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `dosim-pedidos-${getLocalDateKey()}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showToast("Backup exportado.");
    };

    const importBackup = async () => {
      if (!(importInput instanceof HTMLInputElement) || !importInput.files?.[0]) return;
      try {
        const parsed = JSON.parse(await importInput.files[0].text());
        const imported = normalizeState(parsed);
        if (!globalThis.confirm(`Substituir os dados atuais por ${imported.orders.length} pedido(s) do backup?`)) return;
        state = imported;
        saveState(state);
        resetForm();
        renderAll();
        showToast("Backup importado.");
      } catch {
        globalThis.alert("O arquivo selecionado não é um backup válido da DoSim.");
      } finally {
        importInput.value = "";
      }
    };

    createFlavorFields();
    resetForm();

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (loginError instanceof HTMLElement) loginError.textContent = "";
      try {
        if ((await digest(passwordInput.value)) !== AUTH_HASH) {
          if (loginError instanceof HTMLElement) loginError.textContent = "Senha incorreta.";
          passwordInput.select();
          return;
        }
        sessionStorage.setItem(AUTH_KEY, "true");
        setAuthenticatedView(true);
      } catch (error) {
        if (loginError instanceof HTMLElement) {
          loginError.textContent = error instanceof Error ? error.message : "Não foi possível autenticar.";
        }
      }
    });

    flavorsContainer.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.hasAttribute("data-flavor-check")) return;
      updateFlavorRow(Number.parseInt(target.getAttribute("data-flavor-check") || "", 10));
      if (formError instanceof HTMLElement) formError.textContent = "";
    });

    flavorsContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest("[data-flavor-step]");
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      const index = Number.parseInt(button.getAttribute("data-flavor-step") || "", 10);
      const step = Number.parseInt(button.getAttribute("data-step") || "0", 10);
      const quantity = flavorsContainer.querySelector(`[data-flavor-qty="${index}"]`);
      if (!(quantity instanceof HTMLInputElement)) return;
      quantity.value = String(Math.max(1, (Number.parseInt(quantity.value, 10) || 1) + step));
    });

    orderForm.addEventListener("submit", saveOrder);
    customerInput.addEventListener("input", () => {
      if (formError instanceof HTMLElement) formError.textContent = "";
    });
    deliveryDateInput.addEventListener("change", () => {
      if (formError instanceof HTMLElement) formError.textContent = "";
    });

    if (cancelEditButton instanceof HTMLButtonElement) cancelEditButton.addEventListener("click", resetForm);
    if (filterSelect instanceof HTMLSelectElement) filterSelect.addEventListener("change", renderOrders);
    if (exportButton instanceof HTMLButtonElement) exportButton.addEventListener("click", exportBackup);
    if (importInput instanceof HTMLInputElement) importInput.addEventListener("change", importBackup);

    list.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const editButton = target.closest("[data-order-edit]");
      const toggleButton = target.closest("[data-order-toggle]");
      const deleteButton = target.closest("[data-order-delete]");

      if (editButton instanceof HTMLElement) {
        startEditing(editButton.getAttribute("data-order-edit") || "");
        return;
      }

      if (toggleButton instanceof HTMLElement) {
        const order = state.orders.find((item) => item.id === toggleButton.getAttribute("data-order-toggle"));
        if (!order) return;
        order.completed = !order.completed;
        order.updatedAt = new Date().toISOString();
        saveState(state);
        renderAll();
        showToast(`${formatOrderNumber(order.number)} ${order.completed ? "concluído" : "reaberto"}.`);
        return;
      }

      if (deleteButton instanceof HTMLElement) {
        const id = deleteButton.getAttribute("data-order-delete") || "";
        const order = state.orders.find((item) => item.id === id);
        if (!order || !globalThis.confirm(`Excluir definitivamente o pedido ${formatOrderNumber(order.number)}?`)) return;
        state.orders = state.orders.filter((item) => item.id !== id);
        saveState(state);
        if (editingId === id) resetForm();
        renderAll();
        showToast("Pedido excluído.");
      }
    });

    if (logoutButton instanceof HTMLButtonElement) {
      logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem(AUTH_KEY);
        resetForm();
        setAuthenticatedView(false);
      });
    }

    setAuthenticatedView(sessionStorage.getItem(AUTH_KEY) === "true");
  });

  function normalizeState(value) {
    if (!value || typeof value !== "object" || !Array.isArray(value.orders)) throw new Error("Estado inválido");
    const orders = value.orders.map((order) => {
      if (
        !order ||
        typeof order.id !== "string" ||
        !Number.isInteger(order.number) ||
        order.number < 1 ||
        typeof order.customer !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(order.deliveryDate) ||
        !Array.isArray(order.items)
      ) {
        throw new Error("Pedido inválido");
      }
      const items = order.items.map((item) => {
        if (!item || typeof item.flavor !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("Item inválido");
        }
        const legacyCheeseNames = ["Queijo Congelado", "Queijo (Faça Você Mesmo)"];
        const flavor = legacyCheeseNames.includes(item.flavor) ? "Queijo para Assar" : item.flavor;
        return { flavor: flavor.slice(0, 80), quantity: item.quantity };
      });
      if (!items.length) throw new Error("Pedido sem itens");
      return {
        id: order.id,
        number: order.number,
        customer: order.customer.slice(0, 80),
        deliveryDate: order.deliveryDate,
        items,
        completed: order.completed === true,
        createdAt: typeof order.createdAt === "string" ? order.createdAt : "",
        updatedAt: typeof order.updatedAt === "string" ? order.updatedAt : "",
      };
    });
    const maximumNumber = orders.reduce((maximum, order) => Math.max(maximum, order.number), 0);
    return { version: 1, lastNumber: Math.max(Number.parseInt(value.lastNumber, 10) || 0, maximumNumber), orders };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeState(JSON.parse(saved)) : { version: 1, lastNumber: 0, orders: [] };
    } catch {
      return { version: 1, lastNumber: 0, orders: [] };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
})();
