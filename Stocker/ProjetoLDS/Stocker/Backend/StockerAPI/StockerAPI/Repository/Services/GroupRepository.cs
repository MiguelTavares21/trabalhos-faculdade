using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;

namespace StockerAPI.Repository.Services
{
    /// <summary>
    /// Implementação do repositório para gerenciar operações de grupos.
    /// </summary>
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _db;
        
        /// <summary>
        /// Construtor da classe <see cref="GroupRepository"/>.
        /// </summary>
        /// <param name="db">Contexto do banco de dados da aplicação.</param>
        public GroupRepository(ApplicationDbContext db)
        {
            _db = db;
        }


        public async Task<GroupDto> CreateGroup(GroupCreateDto group, int userId)
        {

            if (group.Budget <= 0)
            {
                throw new ArgumentException("Budget tem de ser maior que 0.");
            }

            string accessCode;

            do
            {
                accessCode = GenerateAccessCode();
            } while (await _db.Groups.AnyAsync(g => g.Access_code == accessCode));

            Group model = new()
            {
                Name = group.Name,
                Description = group.Description,
                Budget = group.Budget,
                Access_code = accessCode
            };

            await _db.Groups.AddAsync(model);
            await _db.SaveChangesAsync();

            var groupId = model.Id;

            User_Group user_group = new()
            {
                User_Id = userId,
                Group_Id = groupId,
                Role = Roles.Admin.ToString()
            };

            await _db.Users_Groups.AddAsync(user_group);
            await _db.SaveChangesAsync();

            return new GroupDto
            {
                Id = groupId,
                Name = group.Name,
                Description = group.Description,
                Budget = group.Budget,
                Access_code = accessCode
            };
        }


        /// <summary>
        /// Gera um código de acesso aleatório para um grupo.
        /// </summary>
        /// <returns>Código de acesso gerado.</returns>
        private string GenerateAccessCode()
        {
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 9)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        
        public async Task<int> GetIdByEmail(string email)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id ?? 0;
        }

        public async Task<GroupDto> GetGroupByAccessCode(string accessCode)
        {
            var group = await _db.Groups.FirstOrDefaultAsync(u => u.Access_code == accessCode);

            if (group == null)
            {
                throw new ArgumentException("Grupo não encontrado.");
            }

            return new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                Access_code = group.Access_code,
                Budget = group.Budget
            };

        }

        /// <summary>
        /// Verifica se um utilizador pertence a um grupo específico.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna verdadeiro se o utilizador estiver no grupo, caso contrário, retorna falso.</returns>
        public async Task<bool> UserIsInGroup(int userId, int groupId)
        {
            return await _db.Users_Groups.AnyAsync(g => g.User_Id == userId && g.Group_Id == groupId);
        }

        public async Task<List<userInGroupDto>> GetUsersByGroup(int groupId)
        {
            var userGroups = await _db.Users_Groups
                .Where(ug => ug.Group_Id == groupId)
                .Include(ug => ug.User)
                .ToListAsync();

            if (!userGroups.Any())
            {
                throw new Exception("Nenhum utilizador encontrado para o grupo especificado.");
            }

            var userDtos = userGroups.Select(u => new userInGroupDto
            {
                Id = u.User.Id,
                Name = u.User.Name,
                Email = u.User.Email,
                Notifications = u.User.Notifications,
                Role = Enum.Parse<Roles>(u.Role)
            }).ToList();

            return userDtos;
        }

        public async Task<GroupDto> GetGroup(int groupId)
        {
            var group = await _db.Groups.FindAsync(groupId);

            if (group == null)
            {
                throw new ArgumentException("Grupo não encontrado");
            }

            return new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                Access_code = group.Access_code,
                Budget = group.Budget
            };
        }

        public async Task LeaveGroup(int userId, int groupId)
        {
            var userGroup = await _db.Users_Groups.FirstOrDefaultAsync(ug => ug.User_Id == userId && ug.Group_Id == groupId);

            if (userGroup == null)
            {
                throw new ArgumentException("Utilizador não pertence ao grupo");
            }

            _db.Users_Groups.Remove(userGroup);
            await _db.SaveChangesAsync();

            bool groupIsEmpty = !await _db.Users_Groups.AnyAsync(u => u.Group_Id == groupId);
            if (groupIsEmpty)
            {
                var group = await _db.Groups.FindAsync(groupId);
                if (group != null)
                {
                    _db.Groups.Remove(group);
                    await _db.SaveChangesAsync();
                }
            }
        }


        /// <summary>
        /// Verifica se um grupo existe.
        /// </summary>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna verdadeiro se o grupo existir, caso contrário, falso.</returns>
        private async Task<bool> GroupExist(int groupId)
        {
            return await _db.Groups.AnyAsync(g => g.Id == groupId);
        }

        /// <summary>
        /// Verifica se um utilizador tem o papel de administrador em um grupo.
        /// </summary>
        /// <param name="userId">Id do utilizador.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <returns>Retorna verdadeiro se o utilizador for um administrador no grupo.</returns>
        public async Task<bool> isAdmin(int userId, int groupId)
        {
            return await _db.Users_Groups.AnyAsync(u => u.User_Id == userId && u.Group_Id == groupId && u.Role == Roles.Admin.ToString());
        }

        public async Task ChangeRole(int userId, int targetUserId, int groupId)
        {
            if (userId == targetUserId)
            {
                throw new ArgumentException("Um utilizador não pode mudar sua própria role.");
            }

            var userGroup = await _db.Users_Groups.FirstOrDefaultAsync(ug => ug.User_Id == targetUserId && ug.Group_Id == groupId);
            if (userGroup == null)
            {
                throw new ArgumentException("O utilizador que quer mudar a role não pertence ao grupo.");
            }

            if (userGroup.Role == Roles.Admin.ToString())
            {
                userGroup.Role = Roles.User.ToString();
            }
            else
            {
                userGroup.Role = Roles.Admin.ToString();
            }


            _db.Users_Groups.Update(userGroup);
            await _db.SaveChangesAsync();
        }

        public async Task RemoveMember(int targetUserId, int groupId)
        {

            if (!await GroupExist(groupId))
            {
                throw new ArgumentException("Grupo não encontrado.");
            }

            var userGroup = await _db.Users_Groups.FirstOrDefaultAsync(ug => ug.User_Id == targetUserId && ug.Group_Id == groupId);
            if (userGroup == null)
            {
                throw new ArgumentException("O utilizador que deseja remover não pertence ao grupo.");
            }

            _db.Users_Groups.Remove(userGroup);
            await _db.SaveChangesAsync();
        }

        public async Task<GroupDto> EditGroup(GroupEditDto groupupdate, int groupId)
        {
            var group = await _db.Groups.FindAsync(groupId);

            if (group == null)
            {
                throw new ArgumentException("Grupo não encontrado.");
            }

            if (groupupdate.Name != null)
                group.Name = groupupdate.Name;

            if (groupupdate.Description != null)
                group.Description = groupupdate.Description;

            if (groupupdate.Budget.HasValue)
                group.Budget = groupupdate.Budget.Value;

            _db.Groups.Update(group);
            await _db.SaveChangesAsync();

            return new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                Budget = group.Budget,
                Access_code = group.Access_code
            };

        }


        public async Task DeleteGroup(int groupId)
        {
            var group = await _db.Groups.FindAsync(groupId);

            if (group == null)
            {
                throw new ArgumentException("Grupo não encontrado.");
            }

            _db.Groups.Remove(group);
            await _db.SaveChangesAsync();
        }

        public async Task<string> getuserRole(int groupId, int userId)
        {
            var group = await _db.Groups.FindAsync(groupId);

            if (group == null)
            {
                throw new ArgumentException("Grupo não encontrado.");
            }

            var userGroup = await _db.Users_Groups.FirstOrDefaultAsync(ug => ug.Group_Id == groupId && ug.User_Id == userId);

            if (userGroup == null)
            {
                throw new ArgumentException("Usuário não pertence ao grupo especificado.");
            }

            return userGroup.Role;
        }
    }
}
