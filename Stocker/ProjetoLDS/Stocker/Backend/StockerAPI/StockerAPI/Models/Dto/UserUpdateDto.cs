using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para atualizar um utilizador.
    /// </summary>
    public class UserUpdateDto
    {

        /// <summary>
        /// Nome do utilizador. Pode ser nulo, caso o utilizador não deseje atualizar o nome.
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Endereço de email do utilizador. 
        /// O formato do email deve ser válido e o comprimento máximo do email é 255 caracteres.
        /// </summary>
        [EmailAddress(ErrorMessage = "O formato do email é inválido.")]
        [StringLength(255, ErrorMessage = "O email não pode ter mais que 255 caracteres.")]
        public string? Email { get; set; }

        /// <summary>
        /// Indica se o utilizador deseja receber notificações.
        /// </summary>
        public bool Notifications { get; set; }
    }
}
