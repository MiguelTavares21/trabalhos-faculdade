function confirmEdit() {
    const kilosInput = parseFloat(document.getElementById('kilos').value);
    if (isNaN(kilosInput) || kilosInput <= 0) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = 'Por favor, insira um valor numérico positivo maior que zero.';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 3000);
        return false;
    }

    const inputsToValidate = ['pecasCrianca', 'pecasAdolescente', 'pecasAdulto', 'pecasTipoInterior', 'pecasTipoTronco', 'pecasTipoInferior', 'pecasTipoCalcado'];
    for (let i = 0; i < inputsToValidate.length; i++) {
        const inputId = inputsToValidate[i];
        const inputValue = parseInt(document.getElementById(inputId).value);
        if (isNaN(inputValue) || inputValue < 0) {
            const popup = document.createElement('div');
            popup.className = 'popup';
            popup.textContent = 'Por favor, insira um valor numérico positivo maior ou igual a zero.';
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 3000);
            return false;
        }
    }

    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', function() {
        const formData = new FormData(document.querySelector('form'));
        const jsonData = {};
    
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
    
        fetch(`/requests/editar_request/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Erro desconhecido ao enviar o formulário');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data && data.message) {
                window.location.href = '/requests';
            }
        })
        .catch(error => {
            const errorMessage = error.message || 'Erro desconhecido ao enviar o formulário';
            const popup = document.createElement('div');
            popup.className = 'popup';
            popup.textContent = errorMessage;
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 3000);
        });
    });
    document.getElementById('cancelButton').addEventListener('click', fecharModal);
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

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