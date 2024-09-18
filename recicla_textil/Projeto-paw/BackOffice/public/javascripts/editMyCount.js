async function confirmEditFuncionario() {
    const nome = document.getElementById('nome').value.trim();
    const apelido = document.getElementById('apelido').value.trim();
    const email = document.getElementById('email').value.trim();
    const contacto = document.getElementById('contacto').value.trim();
    const morada = document.getElementById('morada').value.trim();
    const senhaAtual = document.getElementById('senhaAtual').value.trim();
    const novaSenha = document.getElementById('novaSenha').value.trim();

    if (!nome || !apelido || !email || !contacto || !morada) {
        createPopup('Por favor, preencha todos os campos.');
        return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        createPopup('Por favor, insira um email válido.');
        return;
    }

    const telefoneRegex = /^[9][0-9]{8}$/;
    if (!telefoneRegex.test(contacto)) {
        createPopup('Por favor, insira um número de telefone válido.');
        return;
    }

    const body = {
        nome: nome,
        apelido: apelido,
        email: email,
        contacto: contacto,
        morada: morada,
        senhaAtual: senhaAtual,
        novaSenha: novaSenha
    };

    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', async function() {
        try {
            const response = await fetch(`/myCount/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erro ao editar funcionário');
            }

           // Exibir popup de sucesso
           createPopup('Os seus dados foram editados com sucesso.', true);

        // Redirecionar após um curto intervalo de tempo
        setTimeout(() => {
            window.location.href = '/myCount';
        }, 2000);

        } catch (error) {
            console.error('Erro ao editar funcionário:', error);
            const errorMessage = error.message || 'Erro ao editar funcionário. Por favor, tente novamente.';
            createPopup(errorMessage);
        } finally {
            document.getElementById('modal').style.display = 'none';
        }
    });
    
    document.getElementById('cancelButton').addEventListener('click', fecharModal);
}


function createPopup(message, isSuccess = false) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    if (isSuccess) {
        popup.style.backgroundColor = "green";
        popup.classList.add('success');
    }
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}



function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}
