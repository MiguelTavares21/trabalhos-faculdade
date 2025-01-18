using System.ComponentModel;

namespace StockerAPI.Models
{
    /// <summary>
    /// Enumeração que representa os diferentes papéis (roles) atribuídos aos utilizadores no sistema.
    /// </summary>
    public enum Roles
    {
        /// <summary>
        /// Papel de administrador com permissões elevadas no sistema.
        /// </summary>
        [Description("Administrador")]
        Admin = 1,

        /// <summary>
        /// Papel de utilizador regular com permissões limitadas no sistema.
        /// </summary>
        [Description("Utilizador")]
        User = 0
    }
}
