let contas = [];

const lista = document.getElementById("listaContas");

function hoje() {
    return new Date().toISOString().split("T")[0];
}

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

    contasOrdenadas.forEach((conta) => {
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
}

async function carregarContas() {
    const resposta = await fetch('/api/contas');
    contas = await resposta.json();
    renderizarContas();
}

async function adicionarConta() {
    const nome = document.getElementById("nomeConta");
    const valor = document.getElementById("valorConta");
    const vencimento = document.getElementById("vencimentoConta");

    if (!nome.value || !valor.value || !vencimento.value) return;

    await fetch('/api/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: nome.value,
            valor: Number(valor.value),
            vencimento: vencimento.value
        })
    });

    nome.value = "";
    valor.value = "";
    vencimento.value = "";

    await carregarContas();
}

async function toggleConta(id) {
    await fetch(`/api/contas/${id}/toggle`, { method: 'PATCH' });
    await carregarContas();
}

async function excluirConta(id) {
    await fetch(`/api/contas/${id}`, { method: 'DELETE' });
    await carregarContas();
}

setInterval(renderizarContas, 60000);

window.adicionarConta = adicionarConta;
window.toggleConta = toggleConta;
window.excluirConta = excluirConta;

carregarContas();
