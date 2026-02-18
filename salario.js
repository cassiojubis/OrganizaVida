let dadosSalario = {
    salario: 0,
    rendaExtra: 0
};

async function salvarSalario() {
    const salarioInput = document.getElementById("salario");
    const rendaExtraInput = document.getElementById("rendaExtra");

    const salario = Number(salarioInput.value);
    const rendaExtra = Number(rendaExtraInput.value);

    if (salario < 0 || rendaExtra < 0) {
        alert("Valores inválidos");
        return;
    }

    const resposta = await fetch('/api/salario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salario, rendaExtra })
    });

    dadosSalario = await resposta.json();

    alert("💾 Salário salvo com sucesso!");
}

async function carregarSalario() {
    const resposta = await fetch('/api/salario');
    dadosSalario = await resposta.json();

    document.getElementById("salario").value = dadosSalario.salario || "";
    document.getElementById("rendaExtra").value = dadosSalario.rendaExtra || "";
}

window.salvarSalario = salvarSalario;
carregarSalario();
