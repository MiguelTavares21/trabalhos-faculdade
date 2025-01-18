using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de um grupo, incluindo id, nome, descrição, código de acesso e orçamento.
    /// </summary>
    public class GroupDto
    {
        /// <summary>
        /// Identificador único do grupo.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome do grupo. Este campo é obrigatório.
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Descrição do grupo. Este campo é opcional.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Código de acesso do grupo. Este campo é obrigatório e deve ter exatamente 9 caracteres.
        /// </summary>
        [Required]
        [StringLength(9, MinimumLength = 9, ErrorMessage = "O código de acesso deve ter exatamente 9 caracteres.")]
        public string Access_code { get; set; }

        /// <summary>
        /// Orçamento do grupo. Este campo é obrigatório e deve ser maior que zero.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "O orçamento de ser maior que zero.")]
        public float Budget { get; set; }
    }
}
