function confirmRemoveFuncionario(funcionarioId) {
    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', async function() {
        try {
            const response = await fetch('/users/remover_funcionario', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ funcionarioId: funcionarioId })
            });

            if (!response.ok) {
                const responseData = await response.json();
                if (response.status === 400) {
                    createPopup(responseData.message);
                } else {
                    throw new Error('Erro ao remover funcionário');
                }
            } else {
                window.location.href = '/users/ver_todos_funcionarios';
            }
        } catch (error) {
            console.error('Erro:', error);
            createPopup('Erro');
        } finally {
            document.getElementById('modal').style.display = 'none';
        }
    });

    document.getElementById('cancelButton').addEventListener('click', fecharModal);
}


function confirmRemoveDoador(doadorId) {
    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', async function() {
        try {
            const response = await fetch('/users/remover_doador', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ doadorId: doadorId })
            });

            if (!response.ok) {
                throw new Error('Erro ao remover doador');
            }

            window.location.href = '/users/ver_todos_doadores'
        } catch (error) {
            console.error('Erro:', error);
            createPopup('Erro');
        } finally {
            document.getElementById('modal').style.display = 'none';
        }
    });

    document.getElementById('cancelButton').addEventListener('click', fecharModal);
}


async function confirmEditFuncionario(funcionarioId) {
    const isAdmin = document.getElementById('admin').checked;
    const nome = document.getElementById('nome').value.trim();
    const apelido = document.getElementById('apelido').value.trim();
    const email = document.getElementById('email').value.trim();
    const contacto = document.getElementById('contacto').value.trim();
    const morada = document.getElementById('morada').value.trim();
 
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

    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', async function() {

    try {
        const response = await fetch(`/users/editar_funcionario/${funcionarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                apelido: apelido,
                email: email,
                contacto: contacto,
                morada: morada,
                admin: isAdmin
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Erro ao editar funcionário');
        }

        const data = await response.json();
        if (data && data.message) {
            window.location.href = '/users/ver_todos_funcionarios';
        }
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



async function confirmEditDoador(DoadorId) {
    const nome = document.getElementById('nome').value.trim();
    const apelido = document.getElementById('apelido').value.trim();
    const email = document.getElementById('email').value.trim();
    const nif = document.getElementById('nif').value.trim();
    const morada = document.getElementById('morada').value.trim();
    const contacto = document.getElementById('contacto').value.trim();

    if (!nome || !apelido || !email || !nif || !morada) {
        createPopup('Por favor, preencha todos os campos.');
        return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        createPopup('Por favor, insira um email válido.');
        return;
    }

    const telefoneRegex = /^[9][0-9]{8}$/;
    if (contacto && !telefoneRegex.test(contacto)) {
        createPopup('Por favor, insira um número de telefone válido.');
        return;
    }

    const NifRegex =/^[0-9]{9}$/;
    if (!NifRegex.test(nif)) {
        createPopup('Por favor, insira um nif válido.');
        return;
    }

    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', async function() {
        try {
            const formData = new FormData();

            formData.append('nome', nome);
            formData.append('apelido', apelido);
            formData.append('email', email);
            formData.append('nif', nif);
            formData.append('morada', morada);
            formData.append('contacto', contacto);

            const fotoPerfilInput = document.getElementById('novafotoPerfil');
            if (fotoPerfilInput.files.length > 0) {
                formData.append('novafotoPerfil', fotoPerfilInput.files[0]);
            }

            const response = await fetch(`/users/editar_doador/${DoadorId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erro ao editar funcionário');
            }

            const data = await response.json();
            if (data && data.message) {
                window.location.href = '/users/ver_todos_doadores';
            }
        } catch (error) {
            console.error('Erro ao editar doador:', error);
            const errorMessage = error.message || 'Erro ao editar doador. Por favor, tente novamente.';
            createPopup(errorMessage);
        } finally {
            document.getElementById('modal').style.display = 'none';
        }
    });

    document.getElementById('cancelButton').addEventListener('click', fecharModal);
}





function createPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}



function mostrarNovaFotoPerfil(event) {
    const novaFotoPerfil = event.target.files[0];
    const fotoPerfil = document.getElementById('fotoPerfil');
    fotoPerfil.src = URL.createObjectURL(novaFotoPerfil);
}


let fotosRemovidas = [];

async function removerFoto(event) {
    const fotoId = event.target.dataset.fotoId;

    fotosRemovidas.push(fotoId);

    event.target.parentNode.remove();

    document.getElementById('fotosRemovidas').value = JSON.stringify(fotosRemovidas);
}


function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}



function confirmEdit() {
    var nome = document.getElementById('nome').value;
    var descricao = document.getElementById('descricao').value;
    var email = document.getElementById('email').value;
    var contacto = document.getElementById('contacto').value;
    var morada = document.getElementById('morada').value;

    if (nome.trim() === '' || descricao.trim() === '' || email.trim() === '' || contacto.trim() === '' || morada.trim() === '') {
        createPopup('Por favor, preencha todos os campos.');
        return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        createPopup('Por favor, insira um email válido.');
        return;
    }

    const telefoneRegex = /^[9][0-9]{8}$/;
    if (contacto && !telefoneRegex.test(contacto)) {
        createPopup('Por favor, insira um número de telefone válido.');
        return;
    }

    document.getElementById('modal').style.display = 'block';

    document.getElementById('confirmButton').addEventListener('click', function() {

        document.querySelector('form').submit();
        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('cancelButton').addEventListener('click', fecharModal);
}

