let dadosSalario = JSON.parse(localStorage.getItem("salario")) || {
    salario: 0,
    rendaExtra: 0
};

function salvarSalario() {
    const salarioInput = document.getElementById("salario");
    const rendaExtraInput = document.getElementById("rendaExtra");

    const salario = Number(salarioInput.value);
    const rendaExtra = Number(rendaExtraInput.value);

    if (salario < 0 || rendaExtra < 0) {
        alert("Valores inválidos");
        return;
    }

    dadosSalario = { salario, rendaExtra };

    localStorage.setItem("salario", JSON.stringify(dadosSalario));

    alert("💾 Salário salvo com sucesso!");
}

function carregarSalario() {
    document.getElementById("salario").value = dadosSalario.salario || "";
    document.getElementById("rendaExtra").value = dadosSalario.rendaExtra || "";
}

// carregar ao abrir
carregarSalario();
