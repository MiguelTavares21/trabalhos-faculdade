using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;

namespace StockerAPI.Repository.Services
{
    /// <summary>
    /// Implementação do repositório de utilizadores, fornecendo os métodos necessários para 
    /// registrar, autenticar e gerenciar as informações dos utilizadores.
    /// </summary>
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly ISessionRepository _sessionService;

        /// <summary>
        /// Construtor da classe <see cref="UserRepository"/>.
        /// </summary>
        /// <param name="db">Contexto do banco de dados da aplicação.</param>
        /// <param name="sessionService">Serviço de gerenciamento de sessão.</param>
        public UserRepository(ApplicationDbContext db, ISessionRepository sessionService)
        {
            _db = db;
            _sessionService = sessionService;
        }

        /// <summary>
        /// Registra um novo utilizador no sistema.
        /// </summary>
        /// <param name="user">Dados necessários para registrar o utilizador.</param>
        /// <returns>Retorna os detalhes do utilizador registrado como um objeto <see cref="UserDto"/>.</returns>
        /// <exception cref="Exception">Lança uma exceção se o utilizador já existir ou as palavras-passe não coincidirem.</exception>
        public async Task<UserDto> Register(UserCreateDto user)
        {
            if (user == null)
            {
                throw new Exception("Utilizador não pode ser null");
            }

            if (await _db.Users.FirstOrDefaultAsync(u => u.Email == user.Email.ToLower()) != null)
            {
                throw new Exception("Utilizador já existe.");
            }

            if (user.Password != user.PasswordConfirmation)
            {
                throw new Exception("As palavras-passes não são iguais.");
            }

            User model = new()
            {
                Email = user.Email,
                Name = user.Name,
                Notifications = true
            };

            var passwordHasher = new PasswordHasher<User>();

            model.Password = passwordHasher.HashPassword(model, user.Password);

            await _db.Users.AddAsync(model);
            await _db.SaveChangesAsync();

            return new UserDto
            {
                Id = model.Id,
                Email = model.Email,
                Name = model.Name,
                Notifications = model.Notifications
            };
        }

        /// <summary>
        /// Realiza o login de um utilizador e gera um token de sessão.
        /// </summary>
        /// <param name="user">Dados necessários para realizar o login do utilizador.</param>
        /// <returns>Retorna um token de autenticação gerado pelo serviço de sessão.</returns>
        /// <exception cref="Exception">Lança uma exceção se o utilizador não for encontrado ou a password estiver incorreta.</exception>
        public async Task<string> Login(UserLoginDto user)
        {
            var model = await _db.Users.FirstOrDefaultAsync(u => u.Email == user.Email.ToLower());

            if (model == null)
            {
                throw new Exception("Utilizador não encontrado.");
            }

            var passwordHasher = new PasswordHasher<User>();

            var result = passwordHasher.VerifyHashedPassword(model, model.Password, user.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Password incorreta.");
            }

            return _sessionService.CreateToken(model);
        }

        /// <summary>
        /// Recupera os detalhes de um utilizador pelo seu Id.
        /// </summary>
        /// <param name="id">Id do utilizador.</param>
        /// <returns>Retorna os dados do utilizador como um objeto <see cref="UserDto"/>.</returns>
        /// <exception cref="Exception">Lança uma exceção se o utilizador não for encontrado.</exception>
        public async Task<UserDto> GetUser(int id)
        {
            var user = await _db.Users.FindAsync(id);

            if (user == null)
            {
                throw new Exception("Utilizador não encontrado.");
            }

            return new UserDto
            {
                Email = user.Email,
                Id = user.Id,
                Name = user.Name,
                Notifications = user.Notifications
            };
        }


        /// <summary>
        /// Adiciona um utilizador a um grupo.
        /// </summary>
        /// <param name="userId">Id do utilizador a ser adicionado.</param>
        /// <param name="groupId">Id do grupo ao qual o utilizador será adicionado.</param>
        /// <returns>Uma tarefa assíncrona representando a operação de adicionar o utilizador ao grupo.</returns>
        public async Task AddUserToGroup(int userId, int groupId)
        {
            User_Group model = new()
            {
                User_Id = userId,
                Group_Id = groupId,
                Role = Roles.User.ToString()
            };

            await _db.Users_Groups.AddAsync(model);
            await _db.SaveChangesAsync();
        }


        /// <summary>
        /// Recupera todos os grupos aos quais um utilizador pertence.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <returns>Retorna uma lista de grupos como objetos <see cref="GroupDto"/>.</returns>
        /// <exception cref="ArgumentException">Lança uma exceção se o utilizador não for encontrado.</exception>
        public async Task<List<GroupDto>> GetGroupsByUser(int userId)
        {
            var userExist = await _db.Users.FindAsync(userId);
            if (userExist == null)
            {
                throw new ArgumentException("Utilizador não encontrado.");
            }

            var userGroups = await _db.Users_Groups
            .Where(ug => ug.User_Id == userId)
            .Include(ug => ug.Group)
            .ToListAsync();

            if (userGroups == null || !userGroups.Any())
            {
                return new List<GroupDto>();
            }

            var groupDtos = userGroups.Select(ug => new GroupDto
            {
                Id = ug.Group.Id,
                Name = ug.Group.Name,
                Description = ug.Group.Description,
                Budget = ug.Group.Budget,
                Access_code = ug.Group.Access_code
            }).ToList();

            return groupDtos;
        }


        /// <summary>
        /// Altera a pass de um utilizador.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <param name="newPass">Nova pass do utilizador.</param>
        /// <param name="oldPass">pass antiga do utilizador.</param>
        /// <returns>Uma tarefa assíncrona representando a operação de alteração da pass.</returns>
        /// <exception cref="Exception">Lança uma exceção se a pass antiga estiver incorreta ou se o utilizador não for encontrado.</exception>
        public async Task ChangePassword(int userId, string newPass, string oldPass)
        {
            var user = await _db.Users.FindAsync(userId);

            if (user == null)
            {
                throw new Exception("utilizador não encontrado");
            }


            var passwordHasher = new PasswordHasher<User>();

            var passwordCheck = passwordHasher.VerifyHashedPassword(user, user.Password, oldPass);

            if (passwordCheck == PasswordVerificationResult.Failed)
            {
                throw new Exception("Passowrd atual está incorreta!");
            }

            user.Password = passwordHasher.HashPassword(user, newPass);
            _db.Users.Update(user);
            await _db.SaveChangesAsync();

        }


        /// <summary>
        /// Atualiza as informações de conta de um utilizador.
        /// </summary>
        /// <param name="userId">Id do utilizador a ser atualizado.</param>
        /// <param name="userUpdate">Dados de atualização do utilizador.</param>
        /// <returns>Retorna os dados atualizados do utilizador como um objeto <see cref="UserDto"/>.</returns>
        /// <exception cref="Exception">Lança uma exceção se o utilizador não for encontrado ou se o e-mail já estiver em uso.</exception>
        public async Task<UserDto> UpdateAccount(int userId, UserUpdateDto userUpdate)
        {
            var user = await _db.Users.FindAsync(userId);

            if (user == null)
            {
                throw new Exception("Utilizador não encontrado");
            }

            if (!string.IsNullOrEmpty(userUpdate.Name))
            {
                user.Name = userUpdate.Name;
            }

            if (!string.IsNullOrEmpty(userUpdate.Email))
            {
                if (await _db.Users.AnyAsync(u => u.Email == userUpdate.Email && u.Id != user.Id))
                {
                    throw new Exception("O email já está em uso por outro utilizador.");
                }
                user.Email = userUpdate.Email;
            }

            user.Notifications = userUpdate.Notifications;

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return new UserDto()
            {
                Notifications = user.Notifications,
                Name = user.Name,
                Email = user.Email,
                Id = user.Id
            };


        }
    }
}
