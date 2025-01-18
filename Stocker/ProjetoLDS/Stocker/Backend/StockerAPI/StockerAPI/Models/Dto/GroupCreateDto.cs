using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para criar um novo grupo, incluindo nome, descrição e orçamento.
    /// </summary>
    public class GroupCreateDto
    {

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
        /// Orçamento do grupo. Este campo é obrigatório e deve ser maior que zero.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "O orçamento de ser maior que zero.")]
        public float Budget { get; set; }
    }
}
