document.getElementById('formDashboard').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const ano = document.getElementById('ano').value;
    const response = await fetch(`/dashboard/pedidosPorMes?ano=${ano}`);
    const data = await response.json();

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const pedidosPorMes = Array.from({ length: 12 }).fill(0); // Inicializa um array de 12 posições com valor 0

    data.pedidosPorMes.forEach(pedido => {
        const indiceMes = pedido._id - 1; // O MongoDB retorna os meses como 1 para Janeiro, 2 para Fevereiro, etc.
        pedidosPorMes[indiceMes] = pedido.total;
    });

    const ctx = document.getElementById('graficoPedidosPorMes').getContext('2d');
    const grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Pedidos',
                data: pedidosPorMes,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    // Oculta o formulário após o envio
    document.getElementById('formDashboard').style.display = 'none';
});