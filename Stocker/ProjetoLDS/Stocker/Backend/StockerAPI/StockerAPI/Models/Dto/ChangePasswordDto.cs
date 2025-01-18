using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para a alteração de password de um utilizador.
    /// </summary>
    public class ChangePasswordDto
    {
        /// <summary>
        /// pass atual do utilizador. Este campo é obrigatório.
        /// </summary>
        public string PassAtual { get; set; }

        /// <summary>
        /// Nova pass para o utilizador. Este campo é obrigatório.
        /// </summary>
        public string NovaPass { get; set; }
    }
}
