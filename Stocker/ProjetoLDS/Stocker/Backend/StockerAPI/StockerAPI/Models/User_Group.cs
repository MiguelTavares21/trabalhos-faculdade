using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa a relação entre um utilizador e um grupo, incluindo o papel (role) do utilizador dentro do grupo.
    /// </summary>
    public class User_Group
    {
        /// <summary>
        /// Identificador único do utilizador. Este campo é uma chave estrangeira para a tabela de utilizadores.
        /// </summary>
        [Required]
        [ForeignKey("User")]
        public int User_Id { get; set; }

        /// <summary>
        /// Identificador único do grupo. Este campo é uma chave estrangeira para a tabela de grupos.
        /// </summary>
        [Required]
        [ForeignKey("Group")]
        public int Group_Id { get; set; }

        /// <summary>
        /// Representa o papel (role) do usuário dentro do grupo. Pode ser "Admin" ou "User".
        /// </summary>
        /// <remarks>
        /// O campo "Role" utiliza um <see cref="EnumDataType"/> para garantir que o valor seja um dos valores definidos no enum <see cref="Roles"/>.
        /// </remarks>
        [Required]
        [EnumDataType(typeof(Roles), ErrorMessage = "Role deve ser 'Admin' ou 'User'.")]
        public string Role { get; set; }

        /// <summary>
        /// Navegação para o utilizador relacionado. Representa a associação entre a tabela de usuários e a tabela de User_Group.
        /// </summary>
        public virtual User User { get; set; }
        
        /// <summary>
        /// Navegação para o grupo relacionado. Representa a associação entre a tabela de grupos e a tabela de User_Group.
        /// </summary>
        public virtual Group Group { get; set; }
    }
}
