let transacoes = JSON.parse(localStorage.getItem("minhas_transacoes")) || [];

const formulario = document.getElementById("Fincanceiro-forms");
const elementoEntradas = document.getElementById("Total-entradas");
const elementoSaidas = document.getElementById("Total-saidas");
const elementoSaldo = document.getElementById("Total-saldo");
const listaTransacoes = document.getElementById("Transacoes-lista");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const novasTransacoes = {
    // propriedade : valor
    id: Date.now(),
    descricao: document.getElementById("Descricao").value,
    valor: Number(document.getElementById("Valor").value),
    tipo: document.getElementById("Tipo").value,
    metodoPagamento: document.getElementById("Metodo-pagamento").value,
    cartaoNome: document.getElementById("Cartao-nome")
      ? document.getElementById("Cartao-nome").value
      : "",
    categoria: document.getElementById("Categoria").value,
  };

  transacoes.push(novasTransacoes);
  localStorage.setItem("minhas_transacoes", JSON.stringify(transacoes));

  formulario.reset();
  atualizarInterface();
});

function atualizarInterface() {
  let totalEntradas = 0;
  let totalSaidas = 0;

  listaTransacoes.innerHTML = "";

  transacoes.forEach(function (item) {
    if (item.tipo === "entrada") {
      totalEntradas += item.valor;
    } else if (item.tipo === "saida") {
      totalSaidas += item.valor;
    }

    let novoItem = document.createElement("li");
    novoItem.className =
      "flex justify-between items-center p-2 border-b bg-gray-50 my-1 rounded";

    novoItem.innerHTML = `
      <div> 
        <strong class="block">${item.descricao}</strong>
        <span class="text-xs text-gray-500">${item.categoria} - ${item.metodoPagamento}</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="${item.tipo === "entrada" ? "text-green-500" : "text-red-500"} font-bold">
        ${item.tipo === "entrada" ? "+" : "-"} R$ ${item.valor.toFixed(2)}
        </span>
        <button onclick="deletarTransacao(${item.id})" class="text-red-500 font-bold px-2 py-1">
        ✕
        </button>
      </div>
    `;

    listaTransacoes.appendChild(novoItem);
  });

  let saldo = totalEntradas - totalSaidas;
  elementoEntradas.textContent = `R$ ${totalEntradas.toFixed(2)}`;
  elementoSaidas.textContent = `R$ ${totalSaidas.toFixed(2)}`;
  elementoSaldo.textContent = `R$ ${saldo.toFixed(2)}`;
}

function limparTransacao(idParaDeletar) {
  transacoes = transacoes.filter((item) => item.id !== idParaDeletar);
  localStorage.setItem("minhas_transacoes", JSON.stringify(transacoes));
  atualizarInterface();
}
atualizarInterface();
