using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para criar um produto comprado, incluindo o identificador do produto, preço e quantidade.
    /// </summary>
    public class Purchased_ProductCreateDto
    {
        /// <summary>
        /// Identificador único do produto.
        /// Este campo é obrigatório e deve corresponder ao identificador de um produto no sistema.
        /// </summary>
        [Required]
        public int Product_Id { get; set; }

        /// <summary>
        /// Preço do produto.
        /// Este campo é obrigatório e deve ser um valor maior ou igual a zero.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a 0.")]
        public float Price { get; set; }

        /// <summary>
        /// Quantidade do produto comprado.
        /// Este campo é obrigatório e deve ser maior que zero.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior que 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Unidade de medida do produto (ex.: "Kilos", "Unidades", "Litros", "Gramas"). Este campo é obrigatório e deve ser um valor válido.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Unities), ErrorMessage = "Unidade deve ser: 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.")]
        public string Unity { get; set; }
    }
}
