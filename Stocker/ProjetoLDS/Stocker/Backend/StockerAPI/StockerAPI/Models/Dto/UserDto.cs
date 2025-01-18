using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de um utilizador.
    /// </summary>
    public class UserDto
    {
        /// <summary>
        /// Identificador único do utilizador.
        /// </summary>
        public int Id { get; set; }

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
        /// Indica se o utilizador deseja receber notificações.
        /// Este campo é obrigatório e deve ser um valor booleano.
        /// </summary>
        [Required]
        public bool Notifications { get; set; }
    }
}
