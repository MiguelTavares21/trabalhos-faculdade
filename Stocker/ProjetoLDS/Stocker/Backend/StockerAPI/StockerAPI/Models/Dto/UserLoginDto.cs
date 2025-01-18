using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para o login de um utilizador.
    /// </summary>
    public class UserLoginDto
    {
        /// <summary>
        /// Endereço de email do utilizador. 
        /// O formato do email deve ser válido e o comprimento máximo do email é 255 caracteres.
        /// </summary>
        [Required]
        [EmailAddress(ErrorMessage = "O formato do email é inválido.")]
        [StringLength(255, ErrorMessage = "O email não pode ter mais que 255 caracteres.")]
        public string Email { get; set; }

        /// <summary>
        /// password do utilizador. 
        /// A pass é obrigatória para o login.
        /// </summary>
        [Required]
        public string Password { get; set; }
    }
}
