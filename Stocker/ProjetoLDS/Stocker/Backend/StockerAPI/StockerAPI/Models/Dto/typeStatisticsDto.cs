namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa as estatísticas de um tipo de produto, incluindo o total gasto, quantidade comprada, número de compras e a média gasta.
    /// </summary>
    public class TypeStatisticsDto
    {
        /// <summary>
        /// Tipo de produto.
        /// Indica a categoria ou tipo do produto, como "Frutas", "Laticínios", etc.
        /// </summary>
        public string ProductType { get; set; }

        /// <summary>
        /// Total gasto em compras desse tipo de produto.
        /// Representa o valor total gasto em todas as compras do tipo de produto.
        /// </summary>
        public double TotalSpent { get; set; }

        /// <summary>
        /// Quantidade total comprada do tipo de produto.
        /// Representa a quantidade total de produtos adquiridos para o tipo de produto.
        /// </summary>
        public double TotalQuantity { get; set; }

        /// <summary>
        /// Número total de compras realizadas para o tipo de produto.
        /// Indica quantas vezes o tipo de produto foi comprado.
        /// </summary>
        public int TotalPurchases { get; set; }

        /// <summary>
        /// Média gasta por compra no tipo de produto.
        /// Representa o valor médio gasto em cada compra do tipo de produto.
        /// </summary>
        public double AverageSpent { get; set; }
    }
}
