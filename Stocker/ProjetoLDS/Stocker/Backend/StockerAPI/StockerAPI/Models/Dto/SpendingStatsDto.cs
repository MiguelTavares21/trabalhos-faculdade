namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa as estatísticas de gastos, incluindo o total gasto, o número total de compras e o gasto médio.
    /// </summary>
    public class SpendingStatisticsDto
    {
        /// <summary>
        /// Total gasto em todas as compras.
        /// Representa o valor total gasto em todas as transações de compra.
        /// </summary>
        public double TotalSpent { get; set; }

        /// <summary>
        /// Número total de compras realizadas.
        /// Indica quantas compras foram feitas no total.
        /// </summary>
        public int TotalPurchases { get; set; }

        /// <summary>
        /// Gasto médio por compra.
        /// Representa o valor médio gasto por transação de compra.
        /// </summary>
        public double AverageSpent { get; set; }
    }
}
