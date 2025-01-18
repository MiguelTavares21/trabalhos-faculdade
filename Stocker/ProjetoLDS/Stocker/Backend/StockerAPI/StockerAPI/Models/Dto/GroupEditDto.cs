using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados para editar um grupo, incluindo nome, descrição e orçamento.
    /// </summary>
    public class GroupEditDto
    {
        /// <summary>
        /// Nome do grupo. Este campo pode ser usado para alterar o nome do grupo.
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Descrição do grupo. Este campo pode ser usado para fornecer ou editar uma descrição do grupo.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Orçamento do grupo. Este campo pode ser usado para alterar o orçamento do grupo.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "O orçamento deve ser maior que zero.")]
        public float? Budget { get; set; }
    }
}

