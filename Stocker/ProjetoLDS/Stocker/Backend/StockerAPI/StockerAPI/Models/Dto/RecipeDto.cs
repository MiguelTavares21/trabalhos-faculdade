using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa uma receita com um identificador único e um nome.
    /// </summary>
    public class RecipeDto
    {
        /// <summary>
        /// Identificador único da receita.
        /// Este campo é gerado automaticamente no banco de dados e identifica de forma única cada receita.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome da receita.
        /// Este campo é obrigatório e deve representar o título ou nome da receita.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
