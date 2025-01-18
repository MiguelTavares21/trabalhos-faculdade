using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa a associação entre um produto e uma receita, incluindo a quantidade utilizada do produto.
    /// </summary>
    public class Recipe_ProductDto
    {
        /// <summary>
        /// Identificador do produto relacionado.
        /// Este campo é obrigatório e deve corresponder ao identificador de um produto no sistema.
        /// </summary>
        [Required]
        [ForeignKey("Product")]
        public int Product_Id { get; set; }

        /// <summary>
        /// Identificador da receita relacionada.
        /// Este campo é obrigatório e deve corresponder ao identificador de uma receita no sistema.
        /// </summary>
        [Required]
        [ForeignKey("Recipe")]
        public int Recipe_Id { get; set; }

        /// <summary>
        /// Quantidade do produto necessária para a receita.
        /// Este campo é obrigatório e deve ser um valor maior que zero.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior que 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Navegação para o produto relacionado.
        /// Esta propriedade é usada para acessar os detalhes do produto associado à receita.
        /// </summary>
        public virtual Product Product { get; set; }

        /// <summary>
        /// Navegação para a receita relacionada.
        /// Esta propriedade é usada para acessar os detalhes da receita associada ao produto.
        /// </summary>
        public virtual Recipe Recipe { get; set; }
    }
}
