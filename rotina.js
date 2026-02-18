let tarefas = [];

const lista = document.getElementById("listaTarefas");

function horaAtual() {
    return new Date().toTimeString().slice(0, 5);
}

function ordenarTarefas() {
    return [...tarefas].sort((a, b) => {
        if (a.concluida !== b.concluida) {
            return a.concluida ? 1 : -1;
        }
        return a.hora.localeCompare(b.hora);
    });
}

function renderizarTarefas() {
    lista.innerHTML = "";

    const agora = horaAtual();
    const tarefasOrdenadas = ordenarTarefas();

    tarefasOrdenadas.forEach((tarefa) => {
        const li = document.createElement("li");

        const atrasada = !tarefa.concluida && tarefa.hora < agora;

        if (tarefa.concluida) {
            li.className = "ok";
        } else if (atrasada) {
            li.className = "perigo";
        } else {
            li.className = "alerta";
        }

        li.innerHTML = `
            <span>
                <strong>${tarefa.nome}</strong><br>
                <small>⏰ ${tarefa.hora}</small>
            </span>
            <div>
                <button class="btn-small" onclick="toggleTarefa(${tarefa.id})">
                    ${tarefa.concluida ? "✔" : "⏳"}
                </button>
                <button class="btn-small" onclick="excluirTarefa(${tarefa.id})">
                    🗑️
                </button>
            </div>
        `;

        lista.appendChild(li);
    });
}

async function carregarTarefas() {
    const resposta = await fetch('/api/tarefas');
    tarefas = await resposta.json();
    renderizarTarefas();
}

async function adicionarTarefa() {
    const nome = document.getElementById("tarefa");
    const hora = document.getElementById("hora");

    if (!nome.value || !hora.value) return;

    await fetch('/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.value, hora: hora.value })
    });

    nome.value = "";
    hora.value = "";

    await carregarTarefas();
}

async function toggleTarefa(id) {
    await fetch(`/api/tarefas/${id}/toggle`, { method: 'PATCH' });
    await carregarTarefas();
}

async function excluirTarefa(id) {
    await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
    await carregarTarefas();
}

setInterval(renderizarTarefas, 60000);

window.adicionarTarefa = adicionarTarefa;
window.toggleTarefa = toggleTarefa;
window.excluirTarefa = excluirTarefa;

carregarTarefas();
