using Xunit;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Data;
using StockerAPI.Repository.Interfaces;
using StockerAPI.Repository.Services;
using Microsoft.AspNetCore.Identity;
using Moq;
using System.Text.RegularExpressions;
using Group = StockerAPI.Models.Group;

namespace StockerTests
{
    public class UserRepositoryTests
    {
        private readonly ApplicationDbContext _context;
        private readonly UserRepository _userRepository;
        private readonly Mock<ISessionRepository> _sessionServiceMock;

        public UserRepositoryTests()
        {
            // Configura o contexto para usar um banco de dados em memória
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);

            // Mock do ISessionRepository
            _sessionServiceMock = new Mock<ISessionRepository>();

            // Instancia o repositório com o contexto e a interface mockada
            _userRepository = new UserRepository(_context, _sessionServiceMock.Object);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted(); // Limpa a base de dados
            _context.Database.EnsureCreated(); // Recria a base de dados
        }

        [Fact]
        public async Task Register_IfUserIsRegisteredSuccessfully_ReturnNewUserDto()
        {
            // Arrange
            var userCreateDto = new UserCreateDto
            {
                Name = "Miguel tavares",
                Email = "miguel@example.com",
                Password = "password123",
                PasswordConfirmation = "password123"
            };

            // Act
            var result = await _userRepository.Register(userCreateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("miguel@example.com", result.Email);
            Assert.Equal("Miguel tavares", result.Name);
            Assert.True(result.Notifications);
        }

        [Fact]
        public async Task Register_IfEmailAlreadyExists_ThrowsException()
        {
            // Arrange
            var existingUser = new User
            {
                Name = "miguel",
                Email = "miguel@example.com",
                Password = "hashed_password",
                Notifications = true
            };

            await _context.Users.AddAsync(existingUser);
            await _context.SaveChangesAsync();

            var userCreateDto = new UserCreateDto
            {
                Name = "New User",
                Email = "miguel@example.com",
                Password = "password123",
                PasswordConfirmation = "password123"
            };

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.Register(userCreateDto));

            // Assert
            Assert.Equal("Utilizador já existe.", exception.Message);
        }

        [Fact]
        public async Task Register_IfPasswordConfirmationDoesNotMatch_ThrowsException()
        {
            // Arrange
            var userCreateDto = new UserCreateDto
            {
                Name = "Miguel tavares",
                Email = "miguel@example.com",
                Password = "password123",
                PasswordConfirmation = "password12"
            };

            // Act 
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.Register(userCreateDto));

            //Assert
            Assert.Equal("As palavras-passes não são iguais.", exception.Message);
        }


        [Fact]
        public async Task Register_IfUserCreateDtoIsNull_ThrowsException()
        {
            // Arrange
            UserCreateDto? userCreate = null;

            // Act 
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.Register(userCreate));

            //Assert
            Assert.Equal("Utilizador não pode ser null", exception.Message);
        }



        [Fact]
        public async Task Login_IfCredentialsAreCorrect_ReturnToken()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var existingUser = new User
            {
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };
            await _context.Users.AddAsync(existingUser);
            await _context.SaveChangesAsync();

            var userLoginDto = new UserLoginDto
            {
                Email = "miguel@example.com",
                Password = "password123"
            };

            _sessionServiceMock.Setup(s => s.CreateToken(It.IsAny<User>())).Returns("mocked_token");

            // Act
            var result = await _userRepository.Login(userLoginDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("mocked_token", result);
        }


        [Fact]
        public async Task Login_IfUserNotFound_ThrowsException()
        {
            // Arrange
            var userLoginDto = new UserLoginDto
            {
                Email = "miguel@example.com",
                Password = "password123"
            };

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.Login(userLoginDto));

            //Assert
            Assert.Equal("Utilizador não encontrado.", exception.Message);
        }

        [Fact]
        public async Task Login_IfPasswordIsIncorrect_ThrowsException()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var existingUser = new User
            {
                Name = "Miguel tavares",
                Email = "miguel@example.com",
                Password = "pass"
            };
            await _context.Users.AddAsync(existingUser);
            await _context.SaveChangesAsync();

            var userLoginDto = new UserLoginDto
            {
                Email = "miguel@example.com",
                Password = "password"
            };

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.Login(userLoginDto));

            //Assert
            Assert.Equal("Password incorreta.", exception.Message);
        }

        [Fact]
        public async Task getUser_WhenUserExist_ReturnUserDto()
        {
            // Arrange
            var existingUser = new User
            {
                Name = "miguel",
                Email = "miguel@example.com",
                Password = "hashed_password",
                Notifications = true
            };

            await _context.Users.AddAsync(existingUser);
            await _context.SaveChangesAsync();

            // Act
            var result = await _userRepository.GetUser(existingUser.Id);

            //Assert
            Assert.NotNull(result);
            Assert.IsType<UserDto>(result);
            Assert.Equal(existingUser.Id, result.Id);
            Assert.Equal(existingUser.Email, result.Email);
            Assert.Equal(existingUser.Name, result.Name);
            Assert.Equal(existingUser.Notifications, result.Notifications);
        }


        [Fact]
        public async Task GetUser_WhenUserDoesNotExist_ThrowsException()
        {
            // Arrange
            var UserId = 999;

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.GetUser(UserId));

            //Assert
            Assert.Equal("Utilizador não encontrado.", exception.Message);
        }

        [Fact]
        public async Task AddUserToGroup_WhenDataIsValid_AddsUserToGroup()
        {
            // Arrange
            int userId = 1;
            int groupId = 1;

            var user = new User
            {
                Id = userId,
                Name = "miguel",
                Email = "miguel@example.com",
                Password = "hashed_password",
                Notifications = true
            };

            var group = new Group
            {
                Id = groupId,
                Name = "Group",
                Access_code = "123456789",
                Budget = 1000
            };

            await _context.Users.AddAsync(user);
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            // Act
            await _userRepository.AddUserToGroup(userId, groupId);

            // Assert
            var userGroup = await _context.Users_Groups.FirstOrDefaultAsync(ug => ug.User_Id == userId && ug.Group_Id == groupId);

            Assert.NotNull(userGroup);
            Assert.Equal(userId, userGroup.User_Id);
            Assert.Equal(groupId, userGroup.Group_Id);
            Assert.Equal(Roles.User.ToString(), userGroup.Role.ToString());
        }

        [Fact]
        public async Task GetGroupsByUser_WhenUserBelongsToGroups_ReturnsGroupDtos()
        {
            // Arrange


            var user = new User
            {
                Id = 1,
                Name = "miguel",
                Email = "miguel@example.com",
                Password = "hashed_password",
                Notifications = true
            };

            var group = new Group
            {
                Id = 1,
                Name = "Group",
                Access_code = "123456789",
                Budget = 1000
            };


            await _context.Users.AddAsync(user);
            await _context.Groups.AddAsync(group);
            await _context.Users_Groups.AddAsync(new User_Group { User_Id = user.Id, Group_Id = group.Id, Role = Roles.Admin.ToString() });
            await _context.SaveChangesAsync();

            // Act
            var result = await _userRepository.GetGroupsByUser(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(group.Id, result[0].Id);
            Assert.Equal(group.Name, result[0].Name);
            Assert.Equal(group.Description, result[0].Description);
            Assert.Equal(group.Budget, result[0].Budget);
            Assert.Equal(group.Access_code, result[0].Access_code);
        }

        [Fact]
        public async Task GetGroupsByUser_WhenUserBelongsToMultipleGroups_ReturnsMultipleGroupDtos()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Name = "Miguel",
                Email = "miguel@example.com",
                Password = "hashed_password",
                Notifications = true
            };

            var group1 = new Group
            {
                Id = 1,
                Name = "Group 1",
                Description = "Description for Group 1",
                Access_code = "123456",
                Budget = 1000
            };

            var group2 = new Group
            {
                Id = 2,
                Name = "Group 2",
                Description = "Description for Group 2",
                Access_code = "654321",
                Budget = 2000
            };

            var group3 = new Group
            {
                Id = 3,
                Name = "Group 3",
                Description = "Description for Group 3",
                Access_code = "987654",
                Budget = 3000
            };

            await _context.Users.AddAsync(user);
            await _context.Groups.AddRangeAsync(group1, group2, group3);

            await _context.Users_Groups.AddRangeAsync(
                new User_Group { User_Id = user.Id, Group_Id = group1.Id, Role = Roles.Admin.ToString() },
                new User_Group { User_Id = user.Id, Group_Id = group2.Id, Role = Roles.User.ToString() },
                new User_Group { User_Id = user.Id, Group_Id = group3.Id, Role = Roles.User.ToString() }
            );

            await _context.SaveChangesAsync();

            // Act
            var result = await _userRepository.GetGroupsByUser(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Equal(group1.Id, result[0].Id);
            Assert.Equal(group1.Name, result[0].Name);
            Assert.Equal(group1.Description, result[0].Description);
            Assert.Equal(group1.Budget, result[0].Budget);
            Assert.Equal(group1.Access_code, result[0].Access_code);

            Assert.Equal(group2.Id, result[1].Id);
            Assert.Equal(group2.Name, result[1].Name);
            Assert.Equal(group2.Description, result[1].Description);
            Assert.Equal(group2.Budget, result[1].Budget);
            Assert.Equal(group2.Access_code, result[1].Access_code);

            Assert.Equal(group3.Id, result[2].Id);
            Assert.Equal(group3.Name, result[2].Name);
            Assert.Equal(group3.Description, result[2].Description);
            Assert.Equal(group3.Budget, result[2].Budget);
            Assert.Equal(group3.Access_code, result[2].Access_code);
        }


        [Fact]
        public async Task GetGroupsByUser_WhenUserDoesNotBelongToAnyGroup_RetursEmptyList()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Name = "miguel",
                Email = "miguel@example.com",
                Password = "hashed_password",
                Notifications = true
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _userRepository.GetGroupsByUser(user.Id);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.Count);
        }

        [Fact]
        public async Task GetGroupsByUser_WhenUserDoesNotExist_ThrowsArgumentException()
        {
            // Arrange
            int userId = 0;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _userRepository.GetGroupsByUser(userId));

            //Assert
            Assert.Equal("Utilizador não encontrado.", exception.Message);
        }


        [Fact]
        public async Task ChangePassword_WhenUserDoesNotExist_ThrowsException()
        {
            // Arrange
            int userId = 0;
            string oldPass = "oldPassword";
            string newPass = "newPassword";

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.ChangePassword(userId, newPass, oldPass));

            //Assert
            Assert.Equal("utilizador não encontrado", exception.Message);
        }

        [Fact]
        public async Task ChangePassword_WhenOldPasswordIsIncorrect_ThrowsException()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "123"),
                Notifications = true
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            string oldPass = "12";
            string newPass = "newPassword";

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.ChangePassword(user.Id, newPass, oldPass));

            //Assert
            Assert.Equal("Passowrd atual está incorreta!", exception.Message);
        }

        [Fact]
        public async Task ChangePassword_WhenOldPasswordIsCorrect_UpdatesPasswordSuccessfully()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "123"),
                Notifications = true
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            string oldPass = "123";
            string newPass = "12345";

            // Act
            await _userRepository.ChangePassword(user.Id, newPass, oldPass);
            var updatedUser = await _context.Users.FindAsync(user.Id);
            var passwordCheck = passwordHasher.VerifyHashedPassword(updatedUser, updatedUser.Password, newPass);

            // Assert
            Assert.Equal(PasswordVerificationResult.Success, passwordCheck);
        }



        [Fact]
        public async Task UpdateAccount_WhenUserExists_ReturnsUserDto()
        {
            // Arrange
            var existingUser = new User
            {
                Id = 1,
                Name = "Miguel Tavares",
                Email = "miguel@example.com",
                Password = "123",
                Notifications = true
            };
            await _context.Users.AddAsync(existingUser);
            await _context.SaveChangesAsync();

            var userUpdateDto = new UserUpdateDto
            {
                Name = "Miguel",
                Email = "miguel.updated@example.com",
                Notifications = false
            };

            // Act
            var result = await _userRepository.UpdateAccount(existingUser.Id, userUpdateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Miguel", result.Name);
            Assert.Equal("miguel.updated@example.com", result.Email);
            Assert.False(result.Notifications);
            Assert.Equal(existingUser.Id, result.Id);
        }

        [Fact]
        public async Task UpdateAccount_WhenUserDoesNotExist_ThrowsException()
        {
            // Arrange
            var userUpdateDto = new UserUpdateDto
            {
                Name = "Miguel Updated",
                Email = "miguel.updated@example.com",
                Notifications = false
            };

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.UpdateAccount(1, userUpdateDto));

            //Assert
            Assert.Equal("Utilizador não encontrado", exception.Message);
        }

        [Fact]
        public async Task UpdateAccount_WhenEmailIsAlreadyInUse_ThrowsException()
        {
            // Arrange
            var user1 = new User
            {
                Id = 1,
                Name = "User 1",
                Email = "user1@example.com",
                Password = "123",
                Notifications = true
            };
            var user2 = new User
            {
                Id = 2,
                Name = "User 2",
                Email = "user2@example.com",
                Password = "123",
                Notifications = true
            };

            await _context.Users.AddAsync(user1);
            await _context.Users.AddAsync(user2);
            await _context.SaveChangesAsync();

            var userUpdateDto = new UserUpdateDto
            {
                Email = "user2@example.com" // Email que já está em uso
            };

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _userRepository.UpdateAccount(user1.Id, userUpdateDto));

            //Assert
            Assert.Equal("O email já está em uso por outro utilizador.", exception.Message);
        }

        [Fact]
        public async Task UpdateAccount_UpdatesOnlyProvidedFields()
        {
            // Arrange
            var existingUser = new User
            {
                Id = 1,
                Name = "Miguel Tavares",
                Email = "miguel@example.com",
                Password = "123",
                Notifications = true
            };
            await _context.Users.AddAsync(existingUser);
            await _context.SaveChangesAsync();

            var userUpdateDto = new UserUpdateDto
            {
                Email = "new.email@example.com",
                Notifications = false
            };

            // Act
            var result = await _userRepository.UpdateAccount(existingUser.Id, userUpdateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("new.email@example.com", result.Email);
            Assert.Equal(existingUser.Name, result.Name); // Nome não deve mudar
            Assert.False(result.Notifications); // Notificações foram alteradas
        }

    }
}
