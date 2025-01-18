using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa as informações de um produto, incluindo detalhes como nome, quantidade, unidade, pontos de encomenda, e tipo.
    /// </summary>
    public class ProductDto
    {
        /// <summary>
        /// Identificador único do produto.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome do produto. Não pode exceder 100 caracteres.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade do produto disponível. Deve ser maior ou igual a 0.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Unidade de medida do produto. Pode ser: 'Kilos', 'Unidades', 'Litros', ou 'Gramas'.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Unities), ErrorMessage = "Unidade deve ser: 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.")]
        public string Unity { get; set; }

        /// <summary>
        /// Ponto de encomenda do produto. Este valor deve ser maior que 0.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        public float? Order_Point { get; set; }

        /// <summary>
        /// Ponto ideal de estoque do produto. Deve ser maior que o ponto de encomenda.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        [IdealPointGreaterThanOrderPoint(ErrorMessage = "Ponto ideal deve ser maior que ponto de encomenda.")]
        public float? Ideal_Point { get; set; }

        /// <summary>
        /// Tipo de produto. O valor deve ser válido de acordo com o tipo especificado.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Types), ErrorMessage = "Tipo deve ser válido.")]
        public string Type { get; set; }

        /// <summary>
        /// Indica se o produto está na lista ou não. Este campo é obrigatório.
        /// </summary>
        [Required]
        public bool In_List { get; set; }

        /// <summary>
        /// Identificador do grupo ao qual o produto pertence.
        /// </summary>
        [Required]
        public int Group_Id { get; set; }
    }
}
