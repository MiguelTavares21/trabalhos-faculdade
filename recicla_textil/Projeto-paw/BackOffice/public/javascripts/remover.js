function confirmRemove(entidadeId) {
    const modal = document.getElementById("modal");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    // Exibir o modal quando o botão "Remover" for clicado
    modal.style.display = "block";

    // Configurar ação para o botão "Confirmar"
    confirmButton.addEventListener("click", function () {
        document.getElementById("removeForm_" + entidadeId).submit();
        modal.style.display = "none";
    });

    // Configurar ação para o botão "Cancelar"
    cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
    });
}
