using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para criar um novo produto no sistema, incluindo informações como nome, quantidade, unidade, pontos de encomenda e tipo.
    /// </summary>
    public class ProductCreateDto
    {
        /// <summary>
        /// Nome do produto. Este campo é obrigatório e não pode exceder 100 caracteres.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade inicial do produto no estoque. Este campo é obrigatório e deve ser maior ou igual a 0.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Unidade de medida do produto. Este campo é obrigatório e deve ser um valor válido, como 'Kilos', 'Unidades', 'Litros', ou 'Gramas'.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Unities), ErrorMessage = "Unidade deve ser: 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.")]
        public string Unity { get; set; }

        /// <summary>
        /// Ponto de encomenda do produto, que define o nível de estoque necessário para iniciar um novo pedido. Deve ser maior que 0.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        public float? Order_Point { get; set; }

        /// <summary>
        /// Ponto ideal de estoque do produto, que deve ser maior que o ponto de encomenda.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        [IdealPointGreaterThanOrderPoint(ErrorMessage = "Ponto ideal deve ser maior que ponto de encomenda.")]
        public float? Ideal_Point { get; set; }

        /// <summary>
        /// Tipo do produto. Este campo é obrigatório e deve ter um valor válido de acordo com a enumeração `Types` (exemplo: 'Alimento', 'Material', etc.).
        /// </summary>
        [Required]
        [EnumDataType(typeof(Types), ErrorMessage = "Tipo deve ser válido.")]
        public string Type { get; set; }

    }
}
