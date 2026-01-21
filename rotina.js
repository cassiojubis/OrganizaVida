let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const lista = document.getElementById("listaTarefas");

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// hora atual HH:MM
function horaAtual() {
    return new Date().toTimeString().slice(0, 5);
}

/*
 ORDENAR:
 - Pendentes primeiro
 - Pendentes por horário
 - Concluídas por último
*/
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

    tarefasOrdenadas.forEach(tarefa => {
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

    salvarTarefas();
}

function adicionarTarefa() {
    const nome = document.getElementById("tarefa");
    const hora = document.getElementById("hora");

    if (!nome.value || !hora.value) return;

    tarefas.push({
        id: Date.now(),
        nome: nome.value,
        hora: hora.value,
        concluida: false
    });

    nome.value = "";
    hora.value = "";

    renderizarTarefas();
}

function toggleTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        renderizarTarefas();
    }
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    renderizarTarefas();
}

// atualiza atraso automaticamente
setInterval(renderizarTarefas, 60000);

// carregar ao abrir
renderizarTarefas();
