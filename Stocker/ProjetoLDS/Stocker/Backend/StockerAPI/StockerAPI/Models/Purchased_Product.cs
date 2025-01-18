using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa um produto adquirido em uma compra, incluindo o preço e a quantidade do produto comprado.
    /// </summary>
    public class Purchased_Product
    {
        /// <summary>
        /// Identificador do produto adquirido. Este campo é obrigatório e estabelece a relação com o produto na tabela `Product`.
        /// </summary>
        [Required]
        [ForeignKey("Product")]
        public int Product_Id { get; set; }

        /// <summary>
        /// Identificador da compra à qual o produto foi adquirido. Este campo é obrigatório e estabelece a relação com a compra na tabela `Purchase`.
        /// </summary>
        [Required]
        [ForeignKey("Purchase")]
        public int Purchase_Id { get; set; }

        /// <summary>
        /// Preço do produto no momento da compra. Este campo é obrigatório e deve ser maior ou igual a 0.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a 0.")]
        public float Price { get; set; }

        /// <summary>
        /// Quantidade do produto adquirido. Este campo é obrigatório e deve ser maior que 0.
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

        /// <summary>
        /// Navegação para o objeto `Purchase` (Compra) associado a este produto adquirido.
        /// </summary>
        public virtual Purchase Purchase { get; set; }

        /// <summary>
        /// Navegação para o objeto `Product` (Produto) associado a esta entrada de produto adquirido.
        /// </summary>
        public virtual Product Product { get; set; }
    }
}
