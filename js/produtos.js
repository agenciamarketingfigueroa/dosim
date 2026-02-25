(() => {
  const TABLE_BODY_ID = "precos-table-body";
  const CARDS_ID = "precos-cards";
  const WHATSAPP_BASE_URL = "https://wa.me/5531996154698";

  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById(TABLE_BODY_ID);
    const cardsContainer = document.getElementById(CARDS_ID);

    if (!tableBody || !cardsContainer) {
      return;
    }

    fetch("data/precos.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar JSON de preços");
        }
        return response.json();
      })
      .then((items) => {
        renderTable(items, tableBody);
        renderCards(items, cardsContainer);
      })
      .catch(() => {
        tableBody.innerHTML =
          '<tr><td colspan="5">Não foi possível carregar os preços agora. Chame no WhatsApp para receber o catálogo.</td></tr>';
        cardsContainer.innerHTML =
          '<p class="text-small">Catálogo em atualização. Fale com a DoSim no WhatsApp para consultar os valores.</p>';
      });
  });

  function renderTable(items, tableBody) {
    const money = getMoneyFormatter();

    tableBody.innerHTML = items
      .map(
        (item) => `
          <tr>
            <td>${item.nome}</td>
            <td>${item.unidades}</td>
            <td>${item.descricao}</td>
            <td>${money.format(item.precoVenda)}</td>
            <td>
              <a
                class="btn btn-secondary"
                href="${buildProductMessageLink(item.nome)}"
                target="_blank"
                rel="noopener noreferrer"
                >Quero orçamento</a
              >
            </td>
          </tr>
        `
      )
      .join("");
  }

  function renderCards(items, cardsContainer) {
    const money = getMoneyFormatter();

    cardsContainer.innerHTML = items
      .map(
        (item) => `
          <article class="card price-card">
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <p class="meta">${item.unidades} unidade(s)</p>
            <p class="value">${money.format(item.precoVenda)}</p>
            <a
              class="btn btn-primary"
              href="${buildProductMessageLink(item.nome)}"
              target="_blank"
              rel="noopener noreferrer"
              >Pedir este combo</a
            >
          </article>
        `
      )
      .join("");
  }

  function buildProductMessageLink(productName) {
    const message = `Olá, DoSim Confeitaria! Quero orçamento do combo "${productName}".`;
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  }

  function getMoneyFormatter() {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
})();
