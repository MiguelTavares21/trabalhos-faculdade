using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de um produto a ser adicionado a uma receita, incluindo o nome do produto e a quantidade necessária.
    /// </summary>
    public class ProductAddToRecipeDto
    {
        /// <summary>
        /// Nome do produto. Este campo deve ser preenchido com o nome do produto a ser adicionado à receita.
        /// </summary>
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade do produto necessária para a receita. Este campo deve ser preenchido com a quantidade do produto.
        /// </summary>
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }
    }
}
