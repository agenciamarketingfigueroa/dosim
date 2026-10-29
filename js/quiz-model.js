(function (root) {
  "use strict";
  const categories = [
    { value: "negocio", label: "Personalizado com a sua logo", description: "Sua marca em cada biscoito", icon: "business" },
    { value: "aniversario", label: "Lembrancinhas para Festa ou Aniversários", description: "Um detalhe especial para seus convidados", icon: "birthday" },
    { value: "tematico", label: "Temáticos", description: "Chá de Bebê, Natal, Batizado, Safari, Dinossauros, Halloween", icon: "star" },
    { value: "presenteavel", label: "Presenteável", description: "Caixinhas presenteáveis DoSim", icon: "gift" },
    { value: "gramatura", label: "Gramatura", description: "Para maiores quantidades", icon: "weight" },
  ];
  const helpFlavor = "Quero ajuda para escolher";
  const flavors = ["Tradicional", "Chocolate", "Canela", "Capuccino", "Ninho com Nutella", "Ovomaltine", "Misto", "Queijo", "Queijo para assar (congelado)", helpFlavor];
  const moldOptions = ["Ainda não, será o primeiro pedido", "Sim, já tenho meu molde na DoSim."];
  const quantityOptions = ["Tenho uma quantidade em mente", "Ainda não sei, preciso de ajuda"];
  const packagingOptions = ["Embalagem coletiva, para servir", "Embalados individualmente, para lembrança", "Caixa para presente", "Quero ajuda para escolher"];
  const options = (values) => values.map((value) => ({ value, label: value }));
  const initialState = () => ({ category: "", mold: "", flavors: [], quantityMode: "", quantity: "", packaging: "", date: "", name: "", notes: "" });
  function localDate(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  function availableFlavors(state) {
    return state.category === "gramatura" ? flavors : flavors.filter((flavor) => !["Queijo", "Queijo para assar (congelado)"].includes(flavor));
  }
  function steps(state) {
    const list = [{ key: "category", label: "Sua escolha", type: "radio", title: "Qual tipo de biscoito você procura?", help: "Para agilizar seu atendimento, vamos começar pela sua ideia.", options: categories }];
    if (state.category === "negocio") list.push({ key: "mold", label: "Sua logo", type: "radio", title: "Já fez biscoitos personalizados com sua logo na DoSim?", help: "Assim sabemos se você já tem um molde com a gente.", options: options(moldOptions) });
    list.push(
      { key: "flavors", label: "Os sabores", type: "checkbox", title: "Tem um sabor em mente?", help: "Pode escolher mais de um. Se preferir, a gente ajuda você a decidir.", options: options(availableFlavors(state)) },
      { key: "quantityMode", label: "A quantidade", type: "radio", title: "Você já sabe a quantidade?", help: "Uma estimativa já ajuda a preparar seu orçamento.", options: options(quantityOptions) }
    );
    if (state.quantityMode === quantityOptions[0]) {
      const isWeight = state.category === "gramatura";
      list.push({ key: "quantity", label: "A quantidade", type: "number", title: isWeight ? "Quantos gramas você gostaria?" : state.category === "presenteavel" ? "Quantas caixinhas você gostaria?" : "Quantos biscoitos você gostaria?", help: isWeight ? "Informe o peso total desejado. Por exemplo: 1 kg = 1.000 g." : "Pode ser uma estimativa. Confirmamos as opções no atendimento.", min: 1, max: 100000, step: isWeight ? 0.1 : 1, unit: isWeight ? "gramas" : state.category === "presenteavel" ? "caixinhas" : "biscoitos" });
    }
    list.push(
      { key: "packaging", label: "A apresentação", type: "radio", title: "Como gostaria de receber?", help: "Escolha a apresentação que combina com seu pedido.", options: options(packagingOptions) },
      { key: "date", label: "A data", type: "date", title: "Precisa para uma data específica?", help: "Escolha no calendário ou continue sem data definida. Vamos confirmar a disponibilidade no atendimento." },
      { key: "contact", label: "Quase pronto", type: "contact", title: "Como podemos te chamar?", help: "Só falta seu nome. Depois, é só levar o resumo para o WhatsApp." }
    );
    return list;
  }
  function toggleFlavor(selected, flavor, checked) {
    if (flavor === helpFlavor) return checked ? [helpFlavor] : [];
    const next = selected.filter((item) => item !== flavor && item !== helpFlavor);
    if (checked) next.push(flavor);
    return next;
  }
  function changeCategory(state, category) {
    if (state.category === category) return state;
    return { ...initialState(), category, date: state.date, name: state.name, notes: state.notes };
  }
  function validate(state, key, today = localDate()) {
    const step = steps(state).find((item) => item.key === key);
    if (!step) return { field: "category", message: "Escolha um tipo de biscoito para continuar." };
    const value = String(state[key] ?? "").trim();
    if (step.type === "radio" && !step.options.some((option) => option.value === value)) return { field: key, message: "Escolha uma opção para continuar." };
    if (step.type === "checkbox") {
      const selected = state.flavors;
      if (!Array.isArray(selected) || !selected.length || selected.some((flavor) => !availableFlavors(state).includes(flavor)) || new Set(selected).size !== selected.length || (selected.includes(helpFlavor) && selected.length > 1)) return { field: key, message: "Escolha pelo menos um sabor ou peça ajuda para escolher." };
    }
    if (step.type === "number") {
      const amount = Number(value);
      if (!value || !Number.isFinite(amount) || amount < step.min || amount > step.max || Math.abs(amount / step.step - Math.round(amount / step.step)) > 1e-7) return { field: key, message: step.step === 1 ? "Informe uma quantidade inteira entre 1 e 100.000." : "Informe de 1 a 100.000 gramas, com até uma casa decimal." };
    }
    if (step.type === "date" && value) {
      const date = new Date(`${value}T12:00:00`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || localDate(date) !== value || value < today) return { field: key, message: "Escolha uma data de hoje em diante ou continue sem data definida." };
    }
    if (step.type === "contact") {
      if (!String(state.name ?? "").trim() || state.name.trim().length > 80) return { field: "name", message: "Informe seu nome, com até 80 caracteres." };
      if (String(state.notes ?? "").length > 500) return { field: "notes", message: "Use até 500 caracteres nas observações." };
    }
    return null;
  }
  function summary(state) {
    const rows = [];
    const add = (label, value) => { if (String(value ?? "").trim()) rows.push([label, String(value).trim()]); };
    add("Nome", state.name);
    add("Tipo de biscoito", categories.find((category) => category.value === state.category)?.label);
    if (state.category === "negocio") add("Molde", state.mold);
    add("Sabores", state.flavors.join(", "));
    const unit = state.category === "gramatura" ? "g no total" : state.category === "presenteavel" ? "caixinha(s)" : "biscoito(s)";
    add("Quantidade", state.quantityMode === quantityOptions[0] ? `${Number(state.quantity).toLocaleString("pt-BR")} ${unit}` : "A definir com a DoSim");
    add("Apresentação", state.packaging);
    add("Data desejada", state.date ? state.date.split("-").reverse().join("/") : "Sem data definida");
    add("Observações", state.notes);
    return rows;
  }
  function message(state) {
    return ["Olá, DoSim! Respondi ao quiz do site e gostaria de um orçamento.", "", ...summary(state).map(([label, value]) => `${label}: ${value}`), "", "Podem confirmar as opções, os valores e a disponibilidade?"].join("\n");
  }
  const whatsappUrl = (state) => `https://wa.me/5531996154698?text=${encodeURIComponent(message(state))}`;
  const api = { categories, initialState, steps, validate, summary, message, whatsappUrl, localDate, toggleFlavor, changeCategory, helpFlavor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DoSimQuiz = api;
})(globalThis);
