using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para criar uma nova receita.
    /// </summary>
    public class RecipeCreateDto
    {
        /// <summary>
        /// Nome da receita.
        /// Este campo é obrigatório e deve representar o título ou nome da receita a ser criada.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
