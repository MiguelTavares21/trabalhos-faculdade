using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados necessários para a criação de um novo utilizador.
    /// </summary>
    public class UserCreateDto
    {
        /// <summary>
        /// Nome do utilizador.
        /// Este campo é obrigatório e não pode ser nulo ou vazio.
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Endereço de email do utilizador.
        /// O formato do email deve ser válido e o comprimento máximo do email é de 255 caracteres.
        /// Este campo é obrigatório.
        /// </summary>
        [Required]
        [EmailAddress(ErrorMessage = "O formato do email é inválido.")]
        [StringLength(255, ErrorMessage = "O email não pode ter mais que 255 caracteres.")]
        public string Email { get; set; }

        /// <summary>
        /// pass do utilizador.
        /// Este campo é obrigatório e deve ser fornecido uma senha para a criação do utilizador.
        /// </summary>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Confirmação da pass do utilizador.
        /// Este campo é obrigatório e deve ser igual à senha fornecida no campo <see cref="Password"/>.
        /// </summary>
        [Required]
        public string PasswordConfirmation { get; set; }
    }
}
