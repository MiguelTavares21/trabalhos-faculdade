using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os detalhes de um produto presente em uma lista, incluindo seu nome, quantidade e unidade de medida.
    /// </summary>
    public class ProductInListDto
    {
        /// <summary>
        /// Identificador único do produto na lista.
        /// </summary>
        [Required]
        public int Id { get; set; }

        /// <summary>
        /// Nome do produto. Não pode exceder 100 caracteres.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade do produto na lista. Deve ser maior ou igual a 0.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Unidade de medida do produto. Pode ser 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Unities), ErrorMessage = "Unidade deve ser: 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.")]
        public string Unity { get; set; }
    }
}
