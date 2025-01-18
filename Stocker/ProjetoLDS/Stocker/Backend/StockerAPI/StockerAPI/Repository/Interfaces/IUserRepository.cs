using StockerAPI.Models.Dto;

namespace StockerAPI.Repository.Interfaces
{
    /// <summary>
    /// Interface para repositório de utilizadores, fornecendo métodos para registrar, autenticar e manipular
    /// informações dos utilizadores, como grupos associados, atualização de conta e gerenciamento de password.
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Registra um novo utilizador no sistema.
        /// </summary>
        /// <param name="user">Objeto contendo as informações necessárias para registrar um novo utilizador.</param>
        /// <returns>Retorna um objeto <see cref="UserDto"/> com os dados do utilizador recém-registado</returns>
        Task<UserDto> Register(UserCreateDto user);

        /// <summary>
        /// Realiza o login de um utilizador, gerando um token de autenticação.
        /// </summary>
        /// <param name="user">Objeto contendo as informações de login do utilizador (nome, e-mail e password).</param>
        /// <returns>Retorna um token de autenticação em formato string se o login for bem-sucedido.</returns>
        Task<string> Login(UserLoginDto user);

        /// <summary>
        /// Obtém os detalhes de um utiliazdor com base no seu Id.
        /// </summary>
        /// <param name="id">Id do utilizador.</param>
        /// <returns>Retorna um objeto <see cref="UserDto"/> contendo os dados do utilizador solicitado.</returns>
        Task<UserDto> GetUser(int id);

        /// <summary>
        /// Adiciona um utilizador a um grupo existente.
        /// </summary>
        /// <param name="userId">Id do utilizador a ser adicionado ao grupo.</param>
        /// <param name="groupId">Id do grupo ao qual o utilizador será adicionado.</param>
        /// <returns>Uma tarefa assíncrona que indica a conclusão da operação.</returns>
        Task AddUserToGroup(int userId, int groupId);

        /// <summary>
        /// Obtém uma lista de grupos aos quais o utilizador está associado.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <returns>Retorna uma lista de objetos <see cref="GroupDto"/> representando os grupos aos quais o utilizador pertence.</returns>
        Task<List<GroupDto>> GetGroupsByUser(int userId);

        /// <summary>
        /// Altera a password de um utilizador.
        /// </summary>
        /// <param name="userId">ID do utilizador que está a mudar a pass.</param>
        /// <param name="newPass">Nova pass</param>
        /// <param name="oldPass">Pass antiga, necessária para validação da alteração.</param>
        /// <returns>Uma tarefa assíncrona que indica a conclusão da operação de alteração da pass.</returns>
        Task ChangePassword(int userId, string newPass, string oldPass);

        /// <summary>
        /// Atualiza as informações de conta de um utilizador.
        /// </summary>
        /// <param name="userId">Id do utilizador cuja conta será atualizada.</param>
        /// <param name="userUpdate">Objeto contendo as novas informações para atualizar a conta do utilizador.</param>
        /// <returns>Retorna um objeto <see cref="UserDto"/> com os dados atualizados do utilizador.</returns>
        Task<UserDto> UpdateAccount(int userId, UserUpdateDto userUpdate);
    }
}
