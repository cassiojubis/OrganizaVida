// ================= DADOS =================
const salarioData = JSON.parse(localStorage.getItem("salario")) || {
    salario: 0,
    rendaExtra: 0
};

const contas = JSON.parse(localStorage.getItem("contas")) || [];
const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// ================= FINANCEIRO =================
const salario = salarioData.salario || 0;
const rendaExtra = salarioData.rendaExtra || 0;
const totalSalario = salario + rendaExtra;

let totalGastos = 0;
let contasPagas = 0;
let contasPendentes = 0;

contas.forEach(conta => {
    totalGastos += conta.valor;
    conta.paga ? contasPagas++ : contasPendentes++;
});

const saldo = totalSalario - totalGastos;

// Atualiza HTML
document.getElementById("salario").innerText = `R$ ${salario.toFixed(2)}`;
document.getElementById("rendaExtra").innerText = `R$ ${rendaExtra.toFixed(2)}`;
document.getElementById("gastos").innerText = `R$ ${totalGastos.toFixed(2)}`;
document.getElementById("saldo").innerText = `R$ ${saldo.toFixed(2)}`;

// Cor do saldo
const saldoEl = document.getElementById("saldo");
if (saldo < 0) {
    saldoEl.style.color = "#e53935"; // vermelho
} else if (saldo < 200) {
    saldoEl.style.color = "#fbc02d"; // amarelo
} else {
    saldoEl.style.color = "#43a047"; // verde
}

// ================= CONTAS =================
document.getElementById("totalContas").innerText = contas.length;
document.getElementById("contasPagas").innerText = contasPagas;
document.getElementById("contasPendentes").innerText = contasPendentes;

// ================= CONTAS PENDENTES =================
const listaPendentes = document.getElementById("listaPendentes");

contas
    .filter(c => !c.paga)
    .forEach(conta => {
        const li = document.createElement("li");
        li.textContent = `${conta.nome} – vence ${conta.vencimento}`;
        listaPendentes.appendChild(li);
    });

// ================= ALERTAS DE VENCIMENTO =================
const alertas = document.getElementById("alertas");
const hoje = new Date();

contas.forEach(conta => {
    const li = document.createElement("li");
    const vencimento = new Date(conta.vencimento);
    const diffDias = Math.ceil(
        (vencimento - hoje) / (1000 * 60 * 60 * 24)
    );

    if (conta.paga) {
        li.textContent = `${conta.nome} – paga`;
        li.classList.add("ok");
    } 
    else if (diffDias < 0) {
        li.textContent = `${conta.nome} – vencida`;
        li.classList.add("perigo");
    } 
    else if (diffDias <= 3) {
        li.textContent = `${conta.nome} – vence em ${diffDias} dia(s)`;
        li.classList.add("alerta");
    }

    alertas.appendChild(li);
});

// ================= ROTINA =================
let tarefasOk = 0;
let tarefasPendentes = 0;

tarefas.forEach(t => {
    t.concluida ? tarefasOk++ : tarefasPendentes++;
});

document.getElementById("totalTarefas").innerText = tarefas.length;
document.getElementById("tarefasOk").innerText = tarefasOk;
document.getElementById("tarefasPendentes").innerText = tarefasPendentes;
