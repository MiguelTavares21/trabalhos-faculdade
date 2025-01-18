namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de consumo de um produto, incluindo o total consumido e a porcentagem de consumo em relação ao stock.
    /// </summary>
    public class ProductConsumptionDto
    {
        /// <summary>
        /// Identificador único do produto. Este campo é necessário para referenciar o produto.
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Nome do produto. Este campo é opcional, pois pode ser nulo.
        /// </summary>
        public string? ProductName { get; set; }

        /// <summary>
        /// Quantidade total do produto consumido. Este campo representa o total de consumo do produto durante o período.
        /// </summary>
        public float TotalConsumed { get; set; }

        /// <summary>
        /// Percentual de consumo do produto em relação ao stock inicial. Este campo representa a fração do produto consumido em termos percentuais.
        /// </summary>
        public float ConsumptionPercentage { get; set; }
    }

}
