using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de uma compra, incluindo o grupo ao qual a compra pertence, a data e o valor total da compra.
    /// </summary>
    public class PurchaseDto
    {
        /// <summary>
        /// Identificador único da compra.
        /// Este campo é gerado automaticamente pelo sistema.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Identificador do grupo ao qual a compra pertence.
        /// Este campo é obrigatório e deve corresponder ao identificador de um grupo no sistema.
        /// </summary>
        [Required]
        public int Group_Id { get; set; }

        /// <summary>
        /// Data da compra.
        /// Este campo é obrigatório e deve refletir o momento em que a compra foi realizada.
        /// </summary>
        [Required]
        public DateTime Date { get; set; }

        /// <summary>
        /// Valor total da compra.
        /// Este campo é obrigatório e deve ser um valor maior ou igual a zero.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a 0.")]
        public float Price { get; set; }
    }
}
