let contas = JSON.parse(localStorage.getItem("contas")) || [];

const lista = document.getElementById("listaContas");

// data de hoje (YYYY-MM-DD)
function hoje() {
    return new Date().toISOString().split("T")[0];
}

function salvarContas() {
    localStorage.setItem("contas", JSON.stringify(contas));
}

/*
 ORDENAR:
 - Pendentes primeiro
 - Mais próximas do vencimento
 - Pagas por último
*/
function ordenarContas() {
    return [...contas].sort((a, b) => {
        if (a.paga !== b.paga) {
            return a.paga ? 1 : -1;
        }
        return a.vencimento.localeCompare(b.vencimento);
    });
}

function renderizarContas() {
    lista.innerHTML = "";

    const hojeData = hoje();
    const contasOrdenadas = ordenarContas();

    contasOrdenadas.forEach(conta => {
        const li = document.createElement("li");

        const vencida = !conta.paga && conta.vencimento < hojeData;

        if (conta.paga) {
            li.className = "ok";
        } else if (vencida) {
            li.className = "perigo";
        } else {
            li.className = "alerta";
        }

        li.innerHTML = `
            <span>
                ${conta.nome} - R$ ${conta.valor.toFixed(2)}
                <br>
                <small>📅 ${conta.vencimento}</small>
            </span>

            <div>
                <button class="btn-small" onclick="toggleConta(${conta.id})">
                    ${conta.paga ? "✔" : "⏳"}
                </button>
                <button class="btn-small" onclick="excluirConta(${conta.id})">
                    🗑️
                </button>
            </div>
        `;

        lista.appendChild(li);
    });

    salvarContas();
}

function adicionarConta() {
    const nome = document.getElementById("nomeConta");
    const valor = document.getElementById("valorConta");
    const vencimento = document.getElementById("vencimentoConta");

    if (!nome.value || !valor.value || !vencimento.value) return;

    contas.push({
        id: Date.now(),
        nome: nome.value,
        valor: Number(valor.value),
        vencimento: vencimento.value,
        paga: false
    });

    nome.value = "";
    valor.value = "";
    vencimento.value = "";

    renderizarContas();
}

function toggleConta(id) {
    const conta = contas.find(c => c.id === id);
    if (conta) {
        conta.paga = !conta.paga;
        renderizarContas();
    }
}

function excluirConta(id) {
    contas = contas.filter(c => c.id !== id);
    renderizarContas();
}

// atualiza automaticamente vencidas
setInterval(renderizarContas, 60000);

// carregar ao abrir
renderizarContas();
