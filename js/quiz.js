(() => {
  "use strict";
  const model = globalThis.DoSimQuiz;
  const form = document.getElementById("quiz-form");
  if (!model || !form) return;
  const fields = document.getElementById("step-fields"), error = document.getElementById("quiz-error"), title = document.getElementById("step-title"), next = document.getElementById("quiz-next"), back = document.getElementById("quiz-back");
  let state = model.initialState();
  let key = "category";
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const iconPaths = {
    business: '<rect x="5" y="7" width="14" height="14" rx="2"/><path d="M9 7V4h6v3M9 12h1m4 0h1m-6 4h1m4 0h1M10 21v-2h4v2"/>',
    birthday: '<path d="M4 13h16v8H4zM4 16c2 3 3-2 5 0s3 2 4 0 3 3 7 0M7 13V9m5 4V8m5 5V9M7 5v1m5-3v2m5 0v1"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
    gift: '<path d="M5 11v10h14V11M3 7h18v4H3zM12 7v14"/><path d="M12 7C3 7 6 0 10 3l2 4c9 0 6-7 2-4z"/>',
    weight: '<path d="M7 7h10l4 14H3z"/><circle cx="12" cy="4" r="3"/><path d="M9 13v4m0-2 3-2m-3 2 3 2m3-4v4"/>',
  };
  function updateSummary() {
    const target = document.getElementById("quiz-summary");
    if (target) target.innerHTML = model.summary(state).map(([label, value]) => `<div class="summary-row"><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join("");
  }
  function render(focus = false) {
    const steps = model.steps(state), index = steps.findIndex((step) => step.key === key), step = steps[index];
    document.getElementById("step-count").textContent = `PERGUNTA ${String(index + 1).padStart(2, "0")}`;
    document.getElementById("step-label").textContent = step.label;
    const progress = document.getElementById("quiz-progress");
    progress.max = steps.length; progress.value = index + 1;
    progress.setAttribute("aria-valuetext", `Pergunta ${index + 1} de ${steps.length}`);
    title.textContent = step.title;
    document.getElementById("step-help").textContent = step.help;
    error.hidden = true;
    back.hidden = index === 0;
    next.innerHTML = key === "contact" ? 'Levar meu pedido ao WhatsApp <span aria-hidden="true">↗</span>' : key === "date" && !state.date ? 'Continuar sem data definida <span aria-hidden="true">→</span>' : 'Continuar <span aria-hidden="true">→</span>';
    document.getElementById("handoff-help").hidden = key !== "contact";
    form.dataset.step = key;
    if (step.type === "radio" || step.type === "checkbox") {
      fields.innerHTML = `<fieldset class="choices ${step.type === "checkbox" ? "multi-choices" : ""}" aria-labelledby="step-title">${step.options.map((option, i) => {
        const checked = step.type === "checkbox" ? state.flavors.includes(option.value) : state[key] === option.value;
        const icon = option.icon ? `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[option.icon]}</svg>` : String.fromCharCode(65 + i);
        return `<label class="choice"><input type="${step.type}" name="${key}" value="${escape(option.value)}" ${checked ? "checked" : ""} /><span class="choice-icon" aria-hidden="true">${icon}</span><span class="choice-text"><strong>${escape(option.label)}</strong>${option.description ? `<small>${escape(option.description)}</small>` : ""}</span><span class="choice-mark" aria-hidden="true">✓</span></label>`;
      }).join("")}</fieldset>${step.type === "checkbox" ? '<p class="selection-hint" id="selection-hint" aria-live="polite"></p>' : ""}`;
      if (step.type === "checkbox") updateFlavorHint();
    } else if (step.type === "number") {
      fields.innerHTML = `<div class="amount-field"><label class="sr-only" for="quiz-quantity">${escape(step.title)}</label><input id="quiz-quantity" name="quantity" type="number" min="${step.min}" max="${step.max}" step="${step.step}" inputmode="${step.step === 1 ? "numeric" : "decimal"}" value="${escape(state.quantity)}" placeholder="Ex.: ${state.category === "gramatura" ? "500" : "50"}" required /><span>${step.unit}</span></div>`;
    } else if (step.type === "date") {
      fields.innerHTML = `<div class="field date-field"><label class="sr-only" for="quiz-date">Data desejada</label><input type="date" id="quiz-date" name="date" value="${escape(state.date)}" min="${model.localDate()}" /><button class="text-button" id="clear-date" type="button">Ainda não tenho uma data</button></div>`;
      document.getElementById("clear-date").addEventListener("click", () => { state.date = ""; render(); document.getElementById("quiz-date").focus(); });
    } else {
      const placeholder = state.category === "negocio" ? "Nome da empresa, detalhes da logo ou alguma dúvida…" : state.category === "presenteavel" ? "Modelo de caixinha, ocasião ou mensagem especial…" : "Tema, nome do aniversariante, cores ou alguma dúvida…";
      fields.innerHTML = `<div class="field"><label for="quiz-name">Seu nome</label><input id="quiz-name" name="name" autocomplete="given-name" type="text" maxlength="80" value="${escape(state.name)}" placeholder="Digite seu nome" required /></div><div class="field"><label for="quiz-notes">Observações <span>(opcional)</span></label><textarea id="quiz-notes" name="notes" maxlength="500" placeholder="${placeholder}">${escape(state.notes)}</textarea></div><details class="summary"><summary>Conferir o resumo do meu pedido</summary><dl id="quiz-summary"></dl></details>`;
      updateSummary();
    }
    if (focus) { title.focus({ preventScroll: true }); document.getElementById("quiz-app").scrollIntoView({ block: "start", behavior: "auto" }); }
  }
  function updateFlavorHint() {
    const hint = document.getElementById("selection-hint");
    if (hint) hint.textContent = state.flavors.includes(model.helpFlavor) ? "Vamos escolher os sabores juntos." : `${state.flavors.length} ${state.flavors.length === 1 ? "sabor selecionado" : "sabores selecionados"}`;
  }
  function collect() {
    if (["quantity", "date", "contact"].includes(key)) for (const [field, value] of new FormData(form)) state[field] = String(value).trim();
  }
  form.addEventListener("change", (event) => {
    const input = event.target;
    if (input.name === "category") state = model.changeCategory(state, input.value);
    else if (input.name === "flavors") {
      state.flavors = model.toggleFlavor(state.flavors, input.value, input.checked);
      for (const checkbox of form.querySelectorAll('[name="flavors"]')) checkbox.checked = state.flavors.includes(checkbox.value);
      updateFlavorHint();
    } else if (input.type === "radio") state[input.name] = input.value;
    else collect();
    error.hidden = true;
    if (key === "date") next.innerHTML = `${state.date ? "Continuar" : "Continuar sem data definida"} <span aria-hidden="true">→</span>`;
  });
  form.addEventListener("input", (event) => {
    if (["quantity", "date", "name", "notes"].includes(event.target.name)) {
      state[event.target.name] = event.target.value;
      event.target.removeAttribute("aria-invalid");
      error.hidden = true;
      if (key === "contact") updateSummary();
    }
  });
  function showError(problem) {
    error.textContent = problem.message; error.hidden = false;
    const input = form.querySelector(`[name="${problem.field}"]`);
    if (input) { input.setAttribute("aria-invalid", "true"); input.focus(); }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault(); collect();
    const problem = model.validate(state, key);
    if (problem) { showError(problem); return; }
    const steps = model.steps(state), index = steps.findIndex((step) => step.key === key);
    if (index < steps.length - 1) { key = steps[index + 1].key; render(true); return; }
    for (const step of steps) {
      const invalid = model.validate(state, step.key);
      if (invalid) { key = step.key; render(true); showError(invalid); return; }
    }
    window.location.assign(model.whatsappUrl(state));
  });
  back.addEventListener("click", () => {
    collect();
    const steps = model.steps(state), index = steps.findIndex((step) => step.key === key);
    key = steps[Math.max(0, index - 1)].key; render(true);
  });
  document.getElementById("quiz-app").hidden = false;
  render();
})();
