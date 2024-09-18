var pedidos = JSON.parse(document.currentScript.getAttribute('data-pedidos'));

function preencherTabelas() {
    document.getElementById("por-iniciar-table").getElementsByTagName("tbody")[0].innerHTML = "";
    document.getElementById("a-realizar-table").getElementsByTagName("tbody")[0].innerHTML = "";
    document.getElementById("validado-table").getElementsByTagName("tbody")[0].innerHTML = "";
    document.getElementById("cancelado-table").getElementsByTagName("tbody")[0].innerHTML = "";

    pedidos.forEach(function(pedido) {
        if (pedido.estado === "Por iniciar") {
            adicionarPedidoATabela(pedido, "por-iniciar-table");
        } else if (pedido.estado === "A realizar") {
            adicionarPedidoATabela(pedido, "a-realizar-table");
        } else if (pedido.estado === "Validado") {
            adicionarPedidoATabela(pedido, "validado-table");
        }else if (pedido.estado === "Cancelado") {
            adicionarPedidoATabela(pedido, "cancelado-table");
        }
    });
}


function adicionarPedidoATabela(pedido, tabelaId) {
    var table = document.getElementById(tabelaId).getElementsByTagName("tbody")[0];
    var row = table.insertRow();

    var campos = [
        pedido._id,
        pedido.email,
        pedido.entidade,
        pedido.pontos,
        pedido.kilos,
        pedido.numeroPecas,
        pedido.pecasCrianca,
        pedido.pecasAdulto,
        pedido.pecasAdolescente,
        pedido.pecasTipoInterior,
        pedido.pecasTipoInferior,
        pedido.pecasTipoTronco,
        pedido.pecasTipoCalcado,
        pedido.data,
    ];

    for (var i = 0; i < campos.length; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = campos[i];
    }

    var cellAcoes = row.insertCell(campos.length);
    if (tabelaId !== "validado-table" && tabelaId !== "cancelado-table") {
        var botaoEditarPedido = "<a href='/requests/updateRequest/" + pedido._id + "' class='edit-button'>Editar Pedido</a>";
        cellAcoes.innerHTML = botaoEditarPedido;
    } else {
        var botaoVerDoacao = "<a href='/requests/criarPedidoRecolha/" + pedido._id + "' class='edit-button'>Ver Doação</a>";
        cellAcoes.innerHTML = botaoVerDoacao;
    }
}


preencherTabelas();