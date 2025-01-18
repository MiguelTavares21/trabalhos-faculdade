namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de um registo de utilização de um produto, incluindo o identificador do produto, a quantidade utilizada e a data da utilização.
    /// </summary>
    public class ProductUseLogDto
    {
        /// <summary>
        /// Identificador único do produto utilizado.
        /// Este campo é obrigatório e deve corresponder ao identificador de um produto no sistema.
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Quantidade do produto utilizada.
        /// Este campo é obrigatório e deve ser um valor maior que zero.
        /// </summary>
        public float Quantity { get; set; }

        /// <summary>
        /// Data em que o produto foi utilizado.
        /// Este campo é obrigatório e representa o momento da utilização do produto.
        /// </summary>
        public DateTime Date { get; set; }
    }
}
