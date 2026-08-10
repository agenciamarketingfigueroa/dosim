(() => {
  const STORAGE_KEY = "dosim_cash_v1";
  const BACKUP_APP = "dosim-caixa";
  const MAX_BACKUP_SIZE = 5 * 1024 * 1024;
  const CATEGORIES = {
    sale: ["Encomendas", "Pronta entrega", "Evento ou corporativo", "Frete cobrado", "Outras vendas"],
    expense: ["Ingredientes", "Embalagens", "Entrega ou frete", "Marketing", "Equipamentos", "Taxas", "Outras despesas"],
  };
  const PAYMENT_METHODS = [
    "Pix",
    "Dinheiro",
    "Cartão de crédito",
    "Cartão de débito",
    "Transferência",
    "Outro",
  ];

  document.addEventListener("DOMContentLoaded", () => {
    const auth = globalThis.DoSimInternalAuth;
    if (!auth?.isAuthenticated()) {
      globalThis.location.replace("/area-interna");
      return;
    }

    const dashboard = document.querySelector("[data-cash-dashboard]");
    const form = document.querySelector("[data-cash-form]");
    const typeInputs = Array.from(document.querySelectorAll("[data-cash-type]"));
    const dateInput = document.querySelector("[data-cash-date]");
    const descriptionInput = document.querySelector("[data-cash-description]");
    const categorySelect = document.querySelector("[data-cash-category]");
    const paymentSelect = document.querySelector("[data-cash-payment]");
    const amountInput = document.querySelector("[data-cash-amount]");
    const notesInput = document.querySelector("[data-cash-notes]");
    const formError = document.querySelector("[data-cash-form-error]");
    const formEyebrow = document.querySelector("[data-cash-form-eyebrow]");
    const formTitle = document.querySelector("[data-cash-form-title]");
    const submitButton = document.querySelector("[data-cash-submit]");
    const cancelEditButton = document.querySelector("[data-cash-cancel-edit]");
    const monthInput = document.querySelector("[data-cash-month]");
    const currentMonthButton = document.querySelector("[data-cash-current-month]");
    const allPeriodsButton = document.querySelector("[data-cash-all-periods]");
    const periodLabel = document.querySelector("[data-cash-period-label]");
    const salesTotal = document.querySelector("[data-cash-sales]");
    const salesCount = document.querySelector("[data-cash-sales-count]");
    const expensesTotal = document.querySelector("[data-cash-expenses]");
    const expensesCount = document.querySelector("[data-cash-expenses-count]");
    const balanceTotal = document.querySelector("[data-cash-balance]");
    const averageTotal = document.querySelector("[data-cash-average]");
    const list = document.querySelector("[data-cash-list]");
    const emptyMessage = document.querySelector("[data-cash-empty]");
    const searchInput = document.querySelector("[data-cash-search]");
    const typeFilter = document.querySelector("[data-cash-type-filter]");
    const exportButton = document.querySelector("[data-cash-export]");
    const importInput = document.querySelector("[data-cash-import]");
    const logoutButton = document.querySelector("[data-cash-logout]");
    const toast = document.querySelector("[data-cash-toast]");

    if (
      !(dashboard instanceof HTMLElement) ||
      !(form instanceof HTMLFormElement) ||
      !(dateInput instanceof HTMLInputElement) ||
      !(descriptionInput instanceof HTMLInputElement) ||
      !(categorySelect instanceof HTMLSelectElement) ||
      !(paymentSelect instanceof HTMLSelectElement) ||
      !(amountInput instanceof HTMLInputElement) ||
      !(notesInput instanceof HTMLInputElement) ||
      !(monthInput instanceof HTMLInputElement) ||
      !(list instanceof HTMLElement)
    ) {
      return;
    }

    let state = loadState();
    let editingId = null;
    let selectedMonth = getLocalDateKey().slice(0, 7);
    let toastTimer = null;

    const getSelectedType = () => {
      const selected = typeInputs.find((input) => input instanceof HTMLInputElement && input.checked);
      return selected instanceof HTMLInputElement && selected.value === "expense" ? "expense" : "sale";
    };

    const setSelectedType = (type) => {
      typeInputs.forEach((input) => {
        if (input instanceof HTMLInputElement) input.checked = input.value === type;
      });
    };

    const updateCategories = (preferredCategory = "") => {
      const type = getSelectedType();
      categorySelect.innerHTML = CATEGORIES[type]
        .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
        .join("");
      categorySelect.value = CATEGORIES[type].includes(preferredCategory) ? preferredCategory : CATEGORIES[type][0];
    };

    const showToast = (message) => {
      if (!(toast instanceof HTMLElement)) return;
      globalThis.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.hidden = false;
      toastTimer = globalThis.setTimeout(() => {
        toast.hidden = true;
      }, 2800);
    };

    const setFormError = (message = "") => {
      if (formError instanceof HTMLElement) formError.textContent = message;
    };

    const resetForm = () => {
      editingId = null;
      form.reset();
      setSelectedType("sale");
      updateCategories();
      dateInput.value = getLocalDateKey();
      setFormError();
      if (formEyebrow instanceof HTMLElement) formEyebrow.textContent = "Novo lançamento";
      if (formTitle instanceof HTMLElement) formTitle.textContent = "Registrar movimentação";
      if (submitButton instanceof HTMLButtonElement) submitButton.textContent = "Salvar lançamento";
      if (cancelEditButton instanceof HTMLButtonElement) cancelEditButton.hidden = true;
    };

    const getPeriodEntries = () =>
      state.entries.filter((entry) => !selectedMonth || entry.date.startsWith(`${selectedMonth}-`));

    const updatePeriodControls = () => {
      monthInput.value = selectedMonth;
      if (!(periodLabel instanceof HTMLElement)) return;
      if (!selectedMonth) {
        periodLabel.textContent = "Todo o período";
        return;
      }
      const [year, month] = selectedMonth.split("-").map(Number);
      periodLabel.textContent = capitalize(
        new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1))
      );
    };

    const renderStats = () => {
      const entries = getPeriodEntries();
      const sales = entries.filter((entry) => entry.type === "sale");
      const expenses = entries.filter((entry) => entry.type === "expense");
      const salesCents = sales.reduce((total, entry) => total + entry.amountCents, 0);
      const expensesCents = expenses.reduce((total, entry) => total + entry.amountCents, 0);
      const balanceCents = salesCents - expensesCents;

      if (salesTotal instanceof HTMLElement) salesTotal.textContent = formatMoney(salesCents);
      if (salesCount instanceof HTMLElement) salesCount.textContent = pluralize(sales.length, "venda", "vendas");
      if (expensesTotal instanceof HTMLElement) expensesTotal.textContent = formatMoney(expensesCents);
      if (expensesCount instanceof HTMLElement) {
        expensesCount.textContent = pluralize(expenses.length, "lançamento", "lançamentos");
      }
      if (balanceTotal instanceof HTMLElement) {
        balanceTotal.textContent = formatMoney(balanceCents);
        balanceTotal.closest("article")?.classList.toggle("is-negative", balanceCents < 0);
      }
      if (averageTotal instanceof HTMLElement) {
        averageTotal.textContent = formatMoney(sales.length ? Math.round(salesCents / sales.length) : 0);
      }
    };

    const getVisibleEntries = () => {
      const query = searchInput instanceof HTMLInputElement ? normalizeSearch(searchInput.value) : "";
      const filter = typeFilter instanceof HTMLSelectElement ? typeFilter.value : "all";
      return getPeriodEntries()
        .filter((entry) => filter === "all" || entry.type === filter)
        .filter((entry) => {
          if (!query) return true;
          return normalizeSearch(`${entry.description} ${entry.category} ${entry.paymentMethod} ${entry.notes}`).includes(query);
        })
        .sort((left, right) => right.date.localeCompare(left.date) || right.createdAt.localeCompare(left.createdAt));
    };

    const renderEntries = () => {
      const entries = getVisibleEntries();
      if (emptyMessage instanceof HTMLElement) emptyMessage.hidden = entries.length > 0;
      list.innerHTML = entries
        .map(
          (entry) => `
            <article class="cash-entry ${entry.type === "expense" ? "is-expense" : "is-sale"}">
              <div class="cash-entry-main">
                <div class="cash-entry-meta">
                  <time datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>
                  <span>${escapeHtml(entry.category)}</span>
                  <span>${escapeHtml(entry.paymentMethod)}</span>
                </div>
                <h3>${escapeHtml(entry.description)}</h3>
                ${entry.notes ? `<p class="cash-entry-note">${escapeHtml(entry.notes)}</p>` : ""}
              </div>
              <strong class="cash-entry-value">${entry.type === "expense" ? "−" : "+"} ${formatMoney(entry.amountCents)}</strong>
              <div class="cash-entry-actions">
                <button class="order-action" type="button" data-cash-edit="${escapeHtml(entry.id)}">Editar</button>
                <button class="order-action is-danger" type="button" data-cash-delete="${escapeHtml(entry.id)}">Excluir</button>
              </div>
            </article>
          `
        )
        .join("");
    };

    const renderAll = () => {
      updatePeriodControls();
      renderStats();
      renderEntries();
    };

    const startEditing = (id) => {
      const entry = state.entries.find((item) => item.id === id);
      if (!entry) return;
      editingId = id;
      setSelectedType(entry.type);
      updateCategories(entry.category);
      dateInput.value = entry.date;
      descriptionInput.value = entry.description;
      paymentSelect.value = entry.paymentMethod;
      amountInput.value = formatInputMoney(entry.amountCents);
      notesInput.value = entry.notes;
      setFormError();
      if (formEyebrow instanceof HTMLElement) formEyebrow.textContent = "Atualização";
      if (formTitle instanceof HTMLElement) formTitle.textContent = "Editar lançamento";
      if (submitButton instanceof HTMLButtonElement) submitButton.textContent = "Salvar alterações";
      if (cancelEditButton instanceof HTMLButtonElement) cancelEditButton.hidden = false;
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
      descriptionInput.focus();
    };

    const saveEntry = (event) => {
      event.preventDefault();
      const type = getSelectedType();
      const description = descriptionInput.value.trim();
      const amountCents = parseMoney(amountInput.value);
      if (!isValidDate(dateInput.value) || !description || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
        setFormError("Preencha a data, a descrição e um valor maior que zero.");
        return;
      }

      const now = new Date().toISOString();
      let nextState;
      let successMessage;
      if (editingId) {
        const entry = state.entries.find((item) => item.id === editingId);
        if (!entry) return;
        nextState = {
          ...state,
          entries: state.entries.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  type,
                  date: dateInput.value,
                  description,
                  category: categorySelect.value,
                  paymentMethod: paymentSelect.value,
                  amountCents,
                  notes: notesInput.value.trim(),
                  updatedAt: now,
                }
              : item
          ),
        };
        successMessage = "Lançamento atualizado.";
      } else {
        nextState = {
          ...state,
          entries: [
            ...state.entries,
            {
              id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              type,
              date: dateInput.value,
              description,
              category: categorySelect.value,
              paymentMethod: paymentSelect.value,
              amountCents,
              notes: notesInput.value.trim(),
              createdAt: now,
              updatedAt: now,
            },
          ],
        };
        successMessage = type === "sale" ? "Venda registrada." : "Saída registrada.";
      }

      if (!saveState(nextState)) {
        setFormError("Não foi possível salvar. Exporte um backup e libere espaço no navegador.");
        return;
      }
      state = nextState;
      resetForm();
      renderAll();
      showToast(successMessage);
    };

    const exportSession = () => {
      const backup = {
        app: BACKUP_APP,
        version: 1,
        exportedAt: new Date().toISOString(),
        data: state,
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `dosim-caixa-${getLocalDateKey()}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showToast("Sessão do caixa exportada.");
    };

    const importSession = async () => {
      if (!(importInput instanceof HTMLInputElement) || !importInput.files?.[0]) return;
      const file = importInput.files[0];
      try {
        if (file.size > MAX_BACKUP_SIZE) throw new Error("Arquivo muito grande");
        const parsed = JSON.parse(await file.text());
        if (parsed?.app !== BACKUP_APP || parsed?.version !== 1) throw new Error("Backup incompatível");
        const imported = normalizeState(parsed.data);
        const message = `Esta importação substituirá os dados atuais por ${pluralize(
          imported.entries.length,
          "lançamento",
          "lançamentos"
        )}. Deseja continuar?`;
        if (!globalThis.confirm(message)) return;
        if (!saveState(imported)) throw new Error("Falha ao salvar");
        state = imported;
        resetForm();
        renderAll();
        showToast("Sessão importada com sucesso.");
      } catch {
        globalThis.alert("O arquivo selecionado não é uma sessão válida do caixa DoSim.");
      } finally {
        importInput.value = "";
      }
    };

    typeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        updateCategories();
        setFormError();
      });
    });
    form.addEventListener("submit", saveEntry);
    form.addEventListener("input", () => setFormError());
    amountInput.addEventListener("blur", () => {
      const amountCents = parseMoney(amountInput.value);
      if (Number.isSafeInteger(amountCents) && amountCents > 0) amountInput.value = formatInputMoney(amountCents);
    });
    monthInput.addEventListener("change", () => {
      selectedMonth = /^\d{4}-\d{2}$/.test(monthInput.value) ? monthInput.value : "";
      renderAll();
    });
    currentMonthButton?.addEventListener("click", () => {
      selectedMonth = getLocalDateKey().slice(0, 7);
      renderAll();
    });
    allPeriodsButton?.addEventListener("click", () => {
      selectedMonth = "";
      renderAll();
    });
    searchInput?.addEventListener("input", renderEntries);
    typeFilter?.addEventListener("change", renderEntries);
    cancelEditButton?.addEventListener("click", resetForm);
    exportButton?.addEventListener("click", exportSession);
    importInput?.addEventListener("change", importSession);

    list.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const editButton = target.closest("[data-cash-edit]");
      const deleteButton = target.closest("[data-cash-delete]");
      if (editButton instanceof HTMLElement) {
        startEditing(editButton.getAttribute("data-cash-edit") || "");
        return;
      }
      if (!(deleteButton instanceof HTMLElement)) return;
      const id = deleteButton.getAttribute("data-cash-delete") || "";
      const entry = state.entries.find((item) => item.id === id);
      if (!entry || !globalThis.confirm(`Excluir o lançamento “${entry.description}”?`)) return;
      const nextState = { ...state, entries: state.entries.filter((item) => item.id !== id) };
      if (!saveState(nextState)) {
        globalThis.alert("Não foi possível excluir o lançamento.");
        return;
      }
      state = nextState;
      if (editingId === id) resetForm();
      renderAll();
      showToast("Lançamento excluído.");
    });

    logoutButton?.addEventListener("click", () => {
      auth.logout();
      globalThis.location.replace("/area-interna");
    });

    resetForm();
    renderAll();
    dashboard.hidden = false;
  });

  function getLocalDateKey() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
  }

  function formatDate(value) {
    if (!isValidDate(value)) return value;
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(year, month - 1, day)
    );
  }

  function parseMoney(value) {
    let normalized = String(value).trim().replace(/\s|R\$/gi, "");
    if (!normalized) return Number.NaN;
    const lastComma = normalized.lastIndexOf(",");
    const lastDot = normalized.lastIndexOf(".");
    if (lastComma > lastDot) normalized = normalized.replace(/\./g, "").replace(",", ".");
    else if (lastDot > lastComma && lastComma >= 0) normalized = normalized.replace(/,/g, "");
    else if (lastDot >= 0 && /^\d{1,3}(\.\d{3})+$/.test(normalized)) normalized = normalized.replace(/\./g, "");
    else if (lastComma >= 0) normalized = normalized.replace(",", ".");
    normalized = normalized.replace(/[^0-9.-]/g, "");
    const amount = Number(normalized);
    return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN;
  }

  function formatMoney(cents) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
  }

  function formatInputMoney(cents) {
    return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
  }

  function normalizeSearch(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }

  function capitalize(value) {
    return value ? `${value.charAt(0).toLocaleUpperCase("pt-BR")}${value.slice(1)}` : value;
  }

  function pluralize(count, singular, plural) {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeState(value) {
    if (!value || typeof value !== "object" || value.version !== 1 || !Array.isArray(value.entries)) {
      throw new Error("Estado inválido");
    }
    if (value.entries.length > 100000) throw new Error("Muitos lançamentos");
    const ids = new Set();
    const entries = value.entries.map((entry) => {
      if (
        !entry ||
        typeof entry.id !== "string" ||
        !entry.id ||
        ids.has(entry.id) ||
        !["sale", "expense"].includes(entry.type) ||
        !isValidDate(entry.date) ||
        typeof entry.description !== "string" ||
        !entry.description.trim() ||
        typeof entry.category !== "string" ||
        !CATEGORIES[entry.type].includes(entry.category) ||
        typeof entry.paymentMethod !== "string" ||
        !PAYMENT_METHODS.includes(entry.paymentMethod) ||
        !Number.isSafeInteger(entry.amountCents) ||
        entry.amountCents <= 0 ||
        typeof entry.notes !== "string"
      ) {
        throw new Error("Lançamento inválido");
      }
      ids.add(entry.id);
      return {
        id: entry.id.slice(0, 100),
        type: entry.type,
        date: entry.date,
        description: entry.description.trim().slice(0, 100),
        category: entry.category,
        paymentMethod: entry.paymentMethod,
        amountCents: entry.amountCents,
        notes: entry.notes.trim().slice(0, 160),
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt.slice(0, 40) : "",
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt.slice(0, 40) : "",
      };
    });
    return { version: 1, entries };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeState(JSON.parse(saved)) : { version: 1, entries: [] };
    } catch {
      return { version: 1, entries: [] };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }
})();
