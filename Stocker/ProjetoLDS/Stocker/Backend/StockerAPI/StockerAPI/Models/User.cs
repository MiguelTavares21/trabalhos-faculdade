using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa um utilizador do sistema.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Identificador único do utilizador. É gerado automaticamente pela base de dados.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Nome completo do utilizador.
        /// </summary>
        /// <remarks>
        /// Este campo é obrigatório e não pode ser nulo.
        /// </remarks>
        /// <remarks>
        /// Este campo não deve exceder os 100 caracteres.
        /// </remarks>
        [Required]
        [StringLength(100, ErrorMessage = "O nome do utilizador não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Endereço de email do utilizador.
        /// </summary>
        /// <remarks>
        /// Este campo é obrigatório e deve ter um formato de email válido. O comprimento máximo é de 255 caracteres.
        /// </remarks>
        [Required]
        [EmailAddress(ErrorMessage = "O formato do email é inválido.")]
        [StringLength(255, ErrorMessage = "O email não pode ter mais que 255 caracteres.")]
        public string Email { get; set; }

        /// <summary>
        /// Pass do utilizador.
        /// </summary>
        /// <remarks>
        /// Este campo é obrigatório. A pass não é armazenada em texto simples, mas de forma criptografada.
        /// </remarks>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Indica se o utilizador deseja receber notificações.
        /// </summary>
        /// <remarks>
        /// Este campo é obrigatório e armazena um valor booleano indicando se as notificações estão ativadas.
        /// </remarks>
        [Required]
        public bool Notifications { get; set; }
    }
}
