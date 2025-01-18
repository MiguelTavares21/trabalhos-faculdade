using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa uma receita, que contém um nome e pertence a um grupo específico.
    /// </summary>
    public class Recipe
    {
        /// <summary>
        /// Identificador único da receita. Este campo é gerado automaticamente.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Nome da receita. Este campo é obrigatório e não pode exceder os 100 caracteres.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "O nome da receita não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Identificador do grupo ao qual a receita pertence.
        /// Este campo é obrigatório e estabelece a relação com o grupo na tabela `Group`.
        /// </summary>
        [Required]
        [ForeignKey("Group")]
        public int Group_Id { get; set; }

        /// <summary>
        /// Navegação para o objeto `Group` (Grupo) ao qual a receita pertence.
        /// </summary>
        public virtual Group Group { get; set; }
    }
}
