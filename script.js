// ==========================================
// 1. MEMÓRIA (Guardar e Carregar Dados)
// ==========================================

// Pega as transações salvas no navegador (localStorage).
// Se não existir nada salvo ainda, cria uma lista vazia [].
let transacoes = JSON.parse(localStorage.getItem("minhas_transacoes")) || [];

// ==========================================
// 2. CAPTURAR OS ELEMENTOS NA TELA (HTML)
// ==========================================

// Pegamos os campos da tela usando o ID do HTML para podermos mexer neles pelo JS:
const formulario = document.getElementById("Fincanceiro-forms");
const elementoEntradas = document.getElementById("Total-entradas");
const elementoSaidas = document.getElementById("Total-saidas");
const elementoSaldo = document.getElementById("Total-saldo");
const listaTransacoes = document.getElementById("Transacoes-lista");

// Pegamos as duas partes do botão de Mudar Cor (o fundo oval e a bolinha):
const mudarCorBtn = document.getElementById("mudar-cor");
const bolinhaToggle = document.getElementById("bolinha-toggle");

// ==========================================
// 3. EVENTO DO BOTÃO (Mudar a Cor da Página)
// ==========================================

// Fica "vigiando" o botão. Quando o usuário clica, ele roda o código abaixo:
mudarCorBtn.addEventListener("click", () => {
  // 1. Desliza a bolinha para a direita (se clicar de novo, volta pra esquerda)
  bolinhaToggle.classList.toggle("translate-x-full");

  // 2. Liga/desliga a classe "dark" no corpo da página para atuar o modo escuro
  document.body.classList.toggle("dark");

  // 3. Troca a cor do fundo do próprio botão (de azul para cinza)
  mudarCorBtn.classList.toggle("bg-blue-600");
  mudarCorBtn.classList.toggle("bg-gray-300");

  // 4. Troca o fundo da página de CINZA CLARO (gray-100) para PRETO/CINZA ESCURO (gray-900)
  document.body.classList.toggle("bg-gray-100");
  document.body.classList.toggle("bg-gray-900");
});

// ==========================================
// 4. EVENTO DO FORMULÁRIO (Cadastrar Transação)
// ==========================================

// Fica "vigiando" o formulário. Quando o usuário clica em "Adicionar Transação":
formulario.addEventListener("submit", function (event) {
  // Impede a página de recarregar (comportamento padrão de formulários no navegador)
  event.preventDefault();

  // Pega o que o usuário digitou no método e no nome do cartão
  const metodo = document.getElementById("Metodo-pagamento").value;
  const cartao = document.getElementById("Cartao-nome").value;

  // Cria um "pacotinho de dados" (objeto) com tudo que foi preenchido
  const novasTransacoes = {
    id: Date.now(), // Gera um número único usando o relógio do computador
    descricao: document.getElementById("Descricao").value,
    valor: Number(document.getElementById("Valor").value), // Transforma texto em número
    tipo: document.getElementById("Tipo").value,
    categoria: document.getElementById("Categoria").value || "Geral", // Se tiver vazio, grava "Geral"
    metodoPagamento: metodo || "Outro", // Se tiver vazio, grava "Outro"
    cartaoNome: cartao ? `(${cartao})` : "", // Se digitou cartão, põe entre parênteses
  };

  // Guarda esse pacotinho dentro da lista geral de transações
  transacoes.push(novasTransacoes);

  // Salva a lista atualizada dentro da memória do navegador (localStorage)
  localStorage.setItem("minhas_transacoes", JSON.stringify(transacoes));

  // Limpa todos os campos do formulário para o usuário poder digitar de novo
  formulario.reset();

  // Redesenha a tela com os novos dados
  atualizarInterface();
});

// ==========================================
// 5. DESENHAR A INTERFACE (Desenha os valores na tela)
// ==========================================

function atualizarInterface() {
  // Criamos duas variáveis zeradas para fazer as somas das contas
  let totalEntradas = 0;
  let totalSaidas = 0;

  // Limpa a lista na tela antes de redesenhar (para não duplicar os itens)
  listaTransacoes.innerHTML = "";

  // SE NÃO TIVER NENHUMA TRANSAÇÃO GUARDADA:
  if (transacoes.length === 0) {
    listaTransacoes.innerHTML = `
      <li class="text-center text-gray-400 py-6">
        Nenhuma transação cadastrada ainda.
      </li>`;
  } else {
    // SE TIVER TRANSAÇÃO: Pega item por item da lista e faz o seguinte:
    transacoes.forEach((item) => {
      // Se for "entrada", soma no pote de entradas. Se for "saida", soma no de saídas.
      if (item.tipo === "entrada") {
        totalEntradas += item.valor;
      } else if (item.tipo === "saida") {
        totalSaidas += item.valor;
      }

      // Cria uma nova linha <li> no HTML
      const novoItem = document.createElement("li");
      novoItem.className =
        "flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-lg my-1";

      // Preenche essa linha <li> com o texto e o botão de deletar
      novoItem.innerHTML = `
        <div> 
          <strong class="block text-gray-800 dark:text-white font-semibold">${item.descricao}</strong>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            ${item.categoria} • ${item.metodoPagamento} ${item.cartaoNome}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <span class="${item.tipo === "entrada" ? "text-green-600" : "text-red-600"} font-bold text-sm md:text-base">
            ${item.tipo === "entrada" ? "+" : "-"} R$ ${item.valor.toFixed(2)}
          </span>
          <button onclick="deletarTransacao(${item.id})" title="Excluir" class="text-gray-400 hover:text-red-500 font-bold px-2 py-1 transition">
            ✕
          </button>
        </div>
      `;

      // Coloca essa linha recém-criada dentro do HTML da lista no site
      listaTransacoes.appendChild(novoItem);
    });
  }

  // Faz a conta do Saldo (Entradas menos Saídas)
  const saldo = totalEntradas - totalSaidas;

  // Escreve os resultados finais dentro das caixas de texto do topo do site
  elementoEntradas.textContent = `R$ ${totalEntradas.toFixed(2)}`;
  elementoSaidas.textContent = `R$ ${totalSaidas.toFixed(2)}`;
  elementoSaldo.textContent = `R$ ${saldo.toFixed(2)}`;

  // Se o saldo ficar negativo (menor que zero), deixa o texto vermelho!
  if (saldo < 0) {
    elementoSaldo.className = "text-2xl font-bold text-red-600 mt-1";
  } else {
    elementoSaldo.className =
      "text-2xl font-bold text-gray-800 dark:text-white mt-1";
  }
}

// ==========================================
// 6. APAGAR TRANSAÇÃO
// ==========================================

function deletarTransacao(idParaDeletar) {
  // Mantém no array apenas as transações que têm o ID DIFERENTE daquela que clicamos pra apagar
  transacoes = transacoes.filter((item) => item.id !== idParaDeletar);

  // Re-salva a lista atualizada (sem o item apagado) no localStorage
  localStorage.setItem("minhas_transacoes", JSON.stringify(transacoes));

  // Redesenha a tela
  atualizarInterface();
}

// ==========================================
// 7. INICIALIZAÇÃO
// ==========================================

// Assim que abre o site, roda essa função para carregar na tela os dados do localStorage
atualizarInterface();
