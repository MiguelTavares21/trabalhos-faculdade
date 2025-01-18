using StockerAPI.Models.Dto;
using System.Security.Claims;

namespace StockerAPI.Repository.Interfaces
{
    /// <summary>
    /// Interface para o repositório de grupos, fornecendo métodos para criar, editar, excluir grupos, 
    /// gerenciar membros de grupos e verificar permissões de utilizadores.
    /// </summary>
    public interface IGroupRepository
    {
        /// <summary>
        /// Cria um novo grupo no sistema.
        /// </summary>
        /// <param name="group">Dados do grupo a ser criado.</param>
        /// <param name="userId">Id do utilizador que cria o grupo.</param>
        /// <returns>Retorna os dados do grupo criado como um objeto <see cref="GroupDto"/>.</returns>
        /// <exception cref="ArgumentException">Lança uma exceção se o orçamento for menor ou igual a zero.</exception>
        Task<GroupDto> CreateGroup(GroupCreateDto group, int userId);

        /// <summary>
        /// Obtém o Id de um utilizador a partir do seu endereço de e-mail.
        /// </summary>
        /// <param name="email">Endereço de e-mail do utilizador.</param>
        /// <returns>Retorna o Id do utilizador ou 0 se não encontrado.</returns>
        Task<int> GetIdByEmail(string email);

        /// <summary>
        /// Verifica se um utilizador pertence a um grupo específico.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna true se o utilizador estiver no grupo, caso contrário false.</returns>
        Task<bool> UserIsInGroup(int userId, int groupId);

        /// <summary>
        /// Obtém os detalhes de um grupo a partir do seu código de acesso.
        /// </summary>
        /// <param name="accessCode">Código de acesso do grupo.</param>
        /// <returns>Retorna os detalhes do grupo como um objeto <see cref="GroupDto"/>.</returns>
        /// <exception cref="ArgumentException">Lança uma exceção se o grupo não for encontrado.</exception>
        Task<GroupDto> GetGroupByAccessCode(string accessCode);

        /// <summary>
        /// Obtém todos os utilizadores de um grupo específico.
        /// </summary>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna uma lista de utilizadores no grupo como objetos <see cref="userInGroupDto"/>.</returns>
        /// <exception cref="Exception">Lança uma exceção se nenhum utilizador for encontrado.</exception>
        Task<List<userInGroupDto>> GetUsersByGroup(int groupId);

        /// <summary>
        /// Obtém os detalhes de um grupo pelo seu Id.
        /// </summary>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna os detalhes do grupo como um objeto <see cref="GroupDto"/>.</returns>
        /// <exception cref="ArgumentException">Lança uma exceção se o grupo não for encontrado.</exception>
        Task<GroupDto> GetGroup(int groupId);

        /// <summary>
        /// Permite que um utilizador saía um grupo.
        /// </summary>
        /// <param name="userId">Id do utilizador que deseja sair do grupo.</param>
        /// <param name="groupId">Id do grupo que o utilizador deseja sair.</param>
        /// <exception cref="ArgumentException">Lança uma exceção se o utilizador não pertencer ao grupo.</exception>
        Task LeaveGroup(int userId, int groupId);

        /// <summary>
        /// Altera o papel de um utilizador dentro de um grupo.
        /// </summary>
        /// <param name="userId">Id do utilizador que tenta mudar o papel.</param>
        /// <param name="targetUserId">Id do utilizador cujo papel será alterado.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <exception cref="ArgumentException">Lança exceção se o utilizador tentar mudar seu próprio papel ou se o utilizador não pertencer ao grupo.</exception>
        Task ChangeRole(int userId, int targetUserId, int groupId);

        /// <summary>
        /// Remove um membro de um grupo.
        /// </summary>
        /// <param name="targetUserId">Id do utilizador a ser removido.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <exception cref="ArgumentException">Lança exceção se o utilizador não pertencer ao grupo.</exception>
        Task RemoveMember(int targetUserId, int groupId);

        /// <summary>
        /// Verifica se um utilizador tem permissões de administrador em um grupo específico.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna true se o utilizador for administrador, caso contrário false.</returns>
        Task<bool> isAdmin(int userId, int groupId);

        /// <summary>
        /// Edita as informações de um grupo.
        /// </summary>
        /// <param name="groupupdate">Novos dados para o grupo.</param>
        /// <param name="groupId">Id do grupo a ser editado.</param>
        /// <returns>Retorna os dados do grupo atualizado como um objeto <see cref="GroupDto"/>.</returns>
        /// <exception cref="ArgumentException">Lança exceção se o grupo não for encontrado.</exception>
        Task<GroupDto> EditGroup(GroupEditDto groupupdate, int groupId);

        /// <summary>
        /// Remove um grupo do sistema.
        /// </summary>
        /// <param name="groupId">Id do grupo a ser removido.</param>
        /// <exception cref="ArgumentException">Lança exceção se o grupo não for encontrado.</exception>
        Task DeleteGroup(int groupId);

        /// <summary>
        /// Obtém a role de um utilizador dentro de um grupo.
        /// </summary>
        /// <param name="groupId">Id do grupo.</param>
        /// <param name="userId">Id do utilizador.</param>
        /// <returns>Retorna o papel do utilizador no grupo.</returns>
        /// <exception cref="ArgumentException">Lança exceção se o grupo ou utilizador não forem encontrados.</exception>
        Task<string> getuserRole(int groupId, int userId);
    }
}
