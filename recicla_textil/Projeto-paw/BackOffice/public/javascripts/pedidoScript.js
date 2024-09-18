document.getElementById('kilos').addEventListener('input', function() {
    const kilosInput = parseFloat(this.value);
    const errorElement = document.getElementById('kilosError');
    if (isNaN(kilosInput) || kilosInput <= 0) {
        errorElement.style.display = 'inline';
        this.setCustomValidity('Por favor, insira um valor numérico positivo maior que zero.');
    } else {
        errorElement.style.display = 'none';
        this.setCustomValidity('');
    }
});

const inputsToValidate = ['pecasCrianca', 'pecasAdolescente', 'pecasAdulto', 'pecasTipoInterior', 'pecasTipoTronco', 'pecasTipoInferior', 'pecasTipoCalcado'];

inputsToValidate.forEach(function(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', function() {
        const inputValue = parseInt(this.value);
        if (isNaN(inputValue) || inputValue < 0) {
            this.setCustomValidity('Por favor, insira um valor numérico positivo maior que zero.');
        } else {
            this.setCustomValidity('');
        }
    });
});

function verificarSomaPecas() {
    var pecasCrianca = parseInt(document.getElementById("pecasCrianca").value) || 0;
    var pecasAdolescente = parseInt(document.getElementById("pecasAdolescente").value) || 0;
    var pecasAdulto = parseInt(document.getElementById("pecasAdulto").value) || 0;
    var totalFaixaEtaria = pecasCrianca + pecasAdolescente + pecasAdulto;

    var pecasTipoInterior = parseInt(document.getElementById("pecasTipoInterior").value) || 0;
    var pecasTipoTronco = parseInt(document.getElementById("pecasTipoTronco").value) || 0;
    var pecasTipoInferior = parseInt(document.getElementById("pecasTipoInferior").value) || 0;
    var pecasTipoCalcado = parseInt(document.getElementById("pecasTipoCalcado").value) || 0;
    var totalTipoRoupa = pecasTipoInterior + pecasTipoTronco + pecasTipoInferior + pecasTipoCalcado;

    if (totalFaixaEtaria !== totalTipoRoupa) {
        createPopup("A soma do número de peças por faixa etária deve ser igual à soma das peças de roupa por tipo.");
        return false;
    }
    return true;
}
document.getElementById("formPedido").onsubmit = verificarSomaPecas;



function createPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}