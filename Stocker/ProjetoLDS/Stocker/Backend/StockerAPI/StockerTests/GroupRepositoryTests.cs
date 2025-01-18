using Moq;
using Xunit;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Data;

namespace StockerTests
{
    public class GroupRepositoryTests
    {
        private readonly ApplicationDbContext _context;
        private readonly GroupRepository _groupRepository;

        public GroupRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);

            _groupRepository = new GroupRepository(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

        [Fact]
        public async Task CreateGroup_ValidData_ShouldCreateGroup()
        {
            // Arrange
            var groupCreateDto = new GroupCreateDto
            {
                Name = "Test Group",
                Description = "This is a test group",
                Budget = 1000
            };

            // Act
            var result = await _groupRepository.CreateGroup(groupCreateDto, userId: 1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(groupCreateDto.Name, result.Name);
            Assert.Equal(groupCreateDto.Description, result.Description);
            Assert.Equal(groupCreateDto.Budget, result.Budget);
        }

        [Fact]
        public async Task CreateGroup_InvalidBudget_ShouldThrowArgumentException()
        {
            // Arrange
            var groupCreateDto = new GroupCreateDto
            {
                Name = "Test Group",
                Description = "This is a test group",
                Budget = 0
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.CreateGroup(groupCreateDto, userId: 1));
        }

        [Fact]
        public async Task GetIdByEmail_WithExistingEmail_ShouldReturnAnId()
        {
            //Arrange

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            //Act

            var result = await _groupRepository.GetIdByEmail("miguel@example.com");

            //Assert

            Assert.Equal(1, result);
        }

        [Fact]
        public async Task GetIdByEmail_WithNonExistingEmail_ShouldReturn0()
        {
            //Arrange

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            //Act

            var result = await _groupRepository.GetIdByEmail("gabriel@example.com");

            //Assert

            Assert.Equal(0, result);
        }

        [Fact]
        public async Task GetGroup_WithExistingGroup_ShouldReturnGroupDto()
        {
            //Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500, Description = "Description"};

            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            //Act
            var result = await _groupRepository.GetGroup(1);

            //Assert
            Assert.Equal("Test Group", result.Name);
            Assert.Equal("ABC123", result.Access_code);
            Assert.Equal(500, result.Budget);
            Assert.Equal("Description", result.Description);
            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task GetGroup_WithNonExistingGroup_ShouldReturnException()
        {
            //Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.GetGroup(groupId: 1));
        }

        [Fact]
        public async Task GetGroupByAccessCode_ExistingGroup_ShouldReturnGroupDto()
        {
            // Arrange
            var accessCode = "ABC123";
            var group = new Group { Id = 1, Name = "Test Group", Access_code = accessCode, Budget = 500 };

            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            // Act
            var result = await _groupRepository.GetGroupByAccessCode(accessCode);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(group.Id, result.Id);
            Assert.Equal(group.Name, result.Name);
        }

        [Fact]
        public async Task GetGroupByAccessCode_NonExistingGroup_ShouldThrowException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.GetGroupByAccessCode("NonExistentCode"));
        }

        // 3. ChangeRole Tests
        [Fact]
        public async Task ChangeRole_ValidUserRoleChange_ShouldToggleRole()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var admin = new User
            {
                Id = 2,
                Name = "Gabriel Moreira_",
                Email = "gabriel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(admin);

            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var userGroup = new User_Group { User_Id = 1, Group_Id = 1, Role = "User" };

            await _context.Users_Groups.AddAsync(userGroup);

            var adminGroup = new User_Group { User_Id = 2, Group_Id = 1, Role = "Admin" };

            await _context.Users_Groups.AddAsync(adminGroup);

            await _context.SaveChangesAsync();


            // Act
            await _groupRepository.ChangeRole(userId: 2, targetUserId: 1, groupId: 1);

            // Assert
            Assert.Equal("Admin", userGroup.Role);
        }

        [Fact]
        public async Task ChangeRole_UserChangingOwnRole_ShouldThrowArgumentException()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var userGroup = new User_Group { User_Id = 1, Group_Id = 1, Role = "User" };

            await _context.Users_Groups.AddAsync(userGroup);

            await _context.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.ChangeRole(userId: 1, targetUserId: 1, groupId: 1));
        }

        [Fact]
        public async Task ChangeRole_UserDoesntBelongToGroup_ShouldThrowArgumentException()
        {
            // Arrange
            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            await _context.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.ChangeRole(userId: 1, targetUserId: 1, groupId: 1));
        }

        // 4. GetUsersByGroup Tests
        [Fact]
        public async Task GetUsersByGroup_ExistingGroup_ShouldReturnUsers()
        {
            // Arrange
            var groupId = 1;

            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var user2 = new User
            {
                Id = 2,
                Name = "Gabriel Moreira_",
                Email = "gabriel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user2);

            var userGroup = new User_Group { User_Id = 1, Group_Id = 1, Role = "User" };
            var userGroup2 = new User_Group { User_Id = 2, Group_Id = 1, Role = "Admin" };



            await _context.Users_Groups.AddAsync(userGroup);
            await _context.Users_Groups.AddAsync(userGroup2);

            await _context.SaveChangesAsync();

            // Act
            var result = await _groupRepository.GetUsersByGroup(groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetUsersByGroup_NonExistingGroup_ShouldThrowException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _groupRepository.GetUsersByGroup(groupId: 1));
        }

        // 5. LeaveGroup Tests
        [Fact]
        public async Task LeaveGroup_ValidUser_ShouldRemoveUserFromGroup()
        {
            // Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var user2 = new User
            {
                Id = 2,
                Name = "Gabriel Moreira_",
                Email = "gabriel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user2);

            var userGroup = new User_Group { User_Id = 1, Group_Id = 1, Role = "User" };
            var userGroup2 = new User_Group { User_Id = 2, Group_Id = 1, Role = "User" };

            await _context.Users_Groups.AddAsync(userGroup);
            await _context.Users_Groups.AddAsync(userGroup2);

            await _context.SaveChangesAsync();

            // Act
            await _groupRepository.LeaveGroup(userId: 1, groupId: 1);

            // Assert
            Assert.Null(_context.Users_Groups.FirstOrDefault(u => u.User_Id == 1 && u.Group_Id == 1));
        }

        [Fact]
        public async Task LeaveGroup_LastUserInGroup_ShouldDeleteGroup()
        {
            // Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var userGroup = new User_Group { User_Id = 1, Group_Id = 1, Role = "User" };

            await _context.Users_Groups.AddAsync(userGroup);

            await _context.SaveChangesAsync();


            // Act
            await _groupRepository.LeaveGroup(userId: 1, groupId: 1);

            // Assert
            Assert.Null(_context.Groups.FirstOrDefault(g => g.Id == 1));
        }

        [Fact]
        public async Task LeaveGroup_UserNotInGroup_ShouldReturnException()
        {
            // Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();


            // Act
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.LeaveGroup(groupId: 1, userId: 1));
        }

        [Fact]
        public async Task DeleteGroup_GroupExists_ShouldRemoveGroup()
        {
            // Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            // Act
            await _groupRepository.DeleteGroup(1);

            // Assert
            Assert.Null(_context.Groups.FirstOrDefault(g => g.Id == 1));
        }

        [Fact]
        public async Task DeleteGroup_GroupDoesNotExist_ShouldThrowArgumentException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.DeleteGroup(groupId: 1));
        }

        [Fact]
        public async Task RemoveMember_ValidInformation_ShouldRemove()
        {
            // Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var user2 = new User
            {
                Id = 2,
                Name = "Gabriel Moreira_",
                Email = "gabriel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user2);

            var userGroup = new User_Group { User_Id = 1, Group_Id = 1, Role = "User" };
            var userGroup2 = new User_Group { User_Id = 2, Group_Id = 1, Role = "Admin" };

            await _context.Users_Groups.AddAsync(userGroup);
            await _context.Users_Groups.AddAsync(userGroup2);

            await _context.SaveChangesAsync();

            //Act
            await _groupRepository.RemoveMember(1, 1);

            //Assert
            Assert.Null(_context.Users_Groups.FirstOrDefault(u => u.User_Id == 1 && u.Group_Id == 1));
        }

        [Fact]
        public async Task RemoveMember_UnExistingGroup_ShouldReturnException()
        {
            // Arrange

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var user2 = new User
            {
                Id = 2,
                Name = "Gabriel Moreira_",
                Email = "gabriel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user2);

            await _context.SaveChangesAsync();

            //Act && Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.RemoveMember(groupId: 1, targetUserId: 1));
        }

        [Fact]
        public async Task RemoveMember_UserDoesntBelongToGroup_ShouldReturnException()
        {
            // Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = 1,
                Name = "Miguel Tavares_",
                Email = "miguel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user);

            var user2 = new User
            {
                Id = 2,
                Name = "Gabriel Moreira_",
                Email = "gabriel@example.com",
                Password = passwordHasher.HashPassword(null, "password123")
            };

            await _context.Users.AddAsync(user2);

            var userGroup2 = new User_Group { User_Id = 2, Group_Id = 1, Role = "Admin" };

            await _context.Users_Groups.AddAsync(userGroup2);

            await _context.SaveChangesAsync();

            //Act && Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.RemoveMember(groupId: 1, targetUserId: 1));
        }

        [Fact]
        public async Task EditGroup_ValidData_ShouldReturnGroupDto()
        {
            //Arrange
            var group = new Group { Id = 1, Name = "Test Group", Access_code = "ABC123", Budget = 500 };

            await _context.Groups.AddAsync(group);

            var groupEdit = new GroupEditDto
            {
                Budget = 100,
            };

            await _context.SaveChangesAsync();

            //Act
            var result = await _groupRepository.EditGroup(groupEdit, 1);

            //Assert
            Assert.Equal(100, result.Budget);
        }

        [Fact]
        public async Task EditGroup_GroupDoesntExist_ShouldReturnException()
        {
            //Arrange

            var groupEdit = new GroupEditDto
            {
                Budget = 100,
            };

            //Act && Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _groupRepository.EditGroup(groupEdit, 1));
        }
    }
}
