using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa um grupo dentro do sistema, contendo informações como nome, código de acesso, orçamento e descrição.
    /// </summary>
    public class Group
    {
        /// <summary>
        /// Identificador único do grupo. A chave primária é gerada automaticamente.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Nome do grupo. Este campo é obrigatório e nao deve exceder os 100 caracteres.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "O nome do grupo não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Descrição do grupo. Este campo é opcional.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Código de acesso único do grupo, composto por exatamente 9 caracteres. Este campo é obrigatório.
        /// </summary>
        [Required]
        [StringLength(9, MinimumLength = 9, ErrorMessage = "O código de acesso deve ter exatamente 9 caracteres.")]
        public string Access_code { get; set; }

        /// <summary>
        /// Orçamento alocado para o grupo. Este campo é obrigatório e deve ser maior que 0.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "O orçamento de ser maior que zero.")]
        public float Budget { get; set; }
    }
}
