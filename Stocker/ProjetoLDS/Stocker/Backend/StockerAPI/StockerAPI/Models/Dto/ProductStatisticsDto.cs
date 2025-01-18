namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa as estatísticas relacionadas a um produto, incluindo o total gasto, a quantidade total comprada, o número de compras e a média gasta por produto.
    /// </summary>
    public class ProductStatisticsDto
    {
        /// <summary>
        /// Identificador único do produto.
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Total gasto na compra do produto. Representa o valor total de todas as compras desse produto.
        /// </summary>
        public double TotalSpent { get; set; }

        /// <summary>
        /// Quantidade total comprada do produto. Representa o total de unidades adquiridas do produto.
        /// </summary>
        public double TotalQuantity { get; set; }

        /// <summary>
        /// Número total de compras realizadas para o produto.
        /// </summary>
        public int TotalPurchases { get; set; }

        /// <summary>
        /// Média gasta por cada unidade do produto adquirido.
        /// </summary>
        public double AverageSpentByProduct { get; set; }
    }
}
