using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Classe que representa a relação entre um produto e uma receita.
    /// Esta tabela intermediária contém informações sobre os produtos utilizados em uma receita, incluindo a quantidade necessária.
    /// </summary>
    public class Recipe_Product
    {
        /// <summary>
        /// Identificador do produto associado à receita.
        /// </summary>
        [Required]
        [ForeignKey("Product")]
        public int Product_Id { get; set; }

        /// <summary>
        /// Identificador da receita à qual o produto pertence.
        /// </summary>
        [Required]
        [ForeignKey("Recipe")]
        public int Recipe_Id { get; set; }

        /// <summary>
        /// Quantidade do produto necessário para a receita.
        /// O valor deve ser maior que 0.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior que 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Navegação para o objeto Product (Produto).
        /// </summary>
        public virtual Product Product { get; set; }

        /// <summary>
        /// Navegação para o objeto Recipe (Receita).
        /// </summary>
        public virtual Recipe Recipe { get; set; }
    }
}
