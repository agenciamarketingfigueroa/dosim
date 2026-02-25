(() => {
  const WHATSAPP_BASE_URL = "https://wa.me/5531996154698";

  document.addEventListener("DOMContentLoaded", () => {
    setupOrcamentoForm();
    setupContatoRapidoForm();
  });

  function setupOrcamentoForm() {
    const form = document.getElementById("form-orcamento");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = getValue(form, "nome");
      const dataEventoRaw = getValue(form, "dataEvento");
      const tipo = getValue(form, "tipo");
      const quantidade = getValue(form, "quantidade");
      const preferencias = getValue(form, "preferencias");
      const observacoes = getValue(form, "observacoes");

      const messageLines = [
        "Olá, DoSim Confeitaria! Quero solicitar um orçamento.",
        "",
        `Nome: ${nome || "Não informado"}`,
        `Data do evento: ${formatDate(dataEventoRaw)}`,
        `Tipo: ${tipo || "Não informado"}`,
        `Quantidade estimada: ${quantidade || "Sob consulta"}`,
        `Preferências: ${preferencias || "Sob consulta"}`,
        `Observações: ${observacoes || "Sob consulta"}`,
        "",
        "Confirmamos disponibilidade no atendimento.",
      ];

      openWhatsApp(messageLines.join("\n"));
      form.reset();
    });
  }

  function setupContatoRapidoForm() {
    const form = document.getElementById("form-contato-rapido");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = getValue(form, "nome");
      const mensagem = getValue(form, "mensagem");

      const text = [
        "Olá, DoSim Confeitaria!",
        `Meu nome é ${nome || "não informado"}.`,
        `Mensagem: ${mensagem || "Sob consulta"}`,
      ].join("\n");

      openWhatsApp(text);
      form.reset();
    });
  }

  function getValue(form, fieldName) {
    const field = form.elements.namedItem(fieldName);
    return field && "value" in field ? field.value.trim() : "";
  }

  function formatDate(dateRaw) {
    if (!dateRaw) {
      return "Sob consulta";
    }

    const [year, month, day] = dateRaw.split("-");
    if (!year || !month || !day) {
      return "Sob consulta";
    }

    return `${day}/${month}/${year}`;
  }

  function openWhatsApp(message) {
    const url = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
})();
