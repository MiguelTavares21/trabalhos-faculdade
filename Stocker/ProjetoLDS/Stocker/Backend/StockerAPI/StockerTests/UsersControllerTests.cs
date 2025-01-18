using Moq;
using StockerAPI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StockerAPI.Controllers;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using StockerAPI.Models.Dto;
using Microsoft.AspNetCore.Identity;
using StockerAPI.Models;

namespace StockerTests
{
    public class UsersControllerTests
    {
        private readonly Mock<IGroupRepository> _groupRepositoryStub = new();
        private readonly Mock<IUserRepository> _userRepositoryStub = new();

        [Fact]
        public async Task JoinGroup_WithNullOrEmptyAccessCode_ReturnBadRequest()
        {
            //Arrange

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            //Act

            var result = await controller.JoinGroup("");

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task JoinGroup_WithEmailClaimMissing_ReturnBadRequest()
        {
            //Arrange

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            //Act

            var result = await controller.JoinGroup("access_code");

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task JoinGroup_WithInvalidUser_ReturnNotFound()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(0);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.JoinGroup("access_code");

            //Assert

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task JoinGroup_WithNonExistingGroup_ReturnNotFound()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            _groupRepositoryStub.Setup(repo => repo.GetGroupByAccessCode(It.IsAny<string>()))
                .ThrowsAsync(new Exception());

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.JoinGroup("access_code");

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task JoinGroup_WithUserAlreadyInGroup_ReturnBadRequest()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            var group = new GroupDto { Id = 1 };
            _groupRepositoryStub.Setup(repo => repo.GetGroupByAccessCode(It.IsAny<string>()))
                .ReturnsAsync(group);

            _groupRepositoryStub.Setup(repo => repo.UserIsInGroup(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(true);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.JoinGroup("access_code");

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task JoinGroup_WithValidInformation_ReturnOk()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            var group = new GroupDto { Id = 1 };
            _groupRepositoryStub.Setup(repo => repo.GetGroupByAccessCode(It.IsAny<string>()))
                .ReturnsAsync(group);

            _groupRepositoryStub.Setup(repo => repo.UserIsInGroup(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(false);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.JoinGroup("access_code");

            //Assert

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetUserGroups_WithEmailClaimMissing_ReturnBadRequest()
        {
            //Arrange

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            //Act

            var result = await controller.GetUserGroups();

            //Assert

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUserGroups_WithInvalidUser_ReturnNotFound()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(0);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.GetUserGroups();

            //Assert

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUserGroups_WithRepositoryError_ReturnBadRequest()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            _userRepositoryStub.Setup(repo => repo.GetGroupsByUser(It.IsAny<int>()))
                .ThrowsAsync(new Exception());

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.GetUserGroups();

            //Assert

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUserGroups_WithValidInformation_ReturnOk()
        {
            //Arrange

            _groupRepositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            _userRepositoryStub.Setup(repo => repo.GetGroupsByUser(It.IsAny<int>()))
                .ReturnsAsync(It.IsAny<List<GroupDto>>());

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.GetUserGroups();

            //Assert

            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUser_ReturnsOk_WhenUserIsFound()
        {
            // Arrange
            var userId = 1;
            var userDto = new UserDto
            {
                Id = userId,
                Name = "Miguel",
                Email = "miguel@example.com",
                Notifications = true
            };

            _userRepositoryStub.Setup(repo => repo.GetUser(userId))
                .ReturnsAsync(userDto);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            // Act
            var result = await controller.GetUser(userId);

            // Assert
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUser_ReturnsBadRequest_WhenUserIsNotFound()
        {
            // Arrange
            var userId = 999;

            _userRepositoryStub.Setup(repo => repo.GetUser(userId))
                .ThrowsAsync(new Exception("Utilizador não encontrado."));

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = await controller.GetUser(userId);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }


        [Fact]
        public async Task Register_ReturnsCreated_WhenUserIsRegisteredSuccessfully()
        {
            // Arrange
            var userCreateDto = new UserCreateDto
            {
                Name = "miguel",
                Email = "miguel@example.com",
                Password = "password123",
                PasswordConfirmation = "password123"
            };

            var userDto = new UserDto
            {
                Id = 1,
                Name = userCreateDto.Name,
                Email = userCreateDto.Email,
                Notifications = true
            };

            _userRepositoryStub.Setup(repo => repo.Register(userCreateDto)).ReturnsAsync(userDto);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            // Act
            var result = await controller.Register(userCreateDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(controller.GetUser), createdAtActionResult.ActionName);
            Assert.Equal(userDto, createdAtActionResult.Value);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenEmailAlreadyExists()
        {
            // Arrange
            var userCreateDto = new UserCreateDto
            {
                Email = "miguel@example.com",
                Name = "miguel",
                Password = "password123",
                PasswordConfirmation = "password123"
            };

            _userRepositoryStub.Setup(repo => repo.Register(userCreateDto))
                .ThrowsAsync(new Exception("Utilizador já existe."));

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            // Act
            var result = await controller.Register(userCreateDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenPasswordConfirmationDoesNotMatch()
        {
            // Arrange
            var userCreateDto = new UserCreateDto
            {
                Email = "test@example.com",
                Name = "Test User",
                Password = "password123",
                PasswordConfirmation = "password12"
            };

            _userRepositoryStub.Setup(repo => repo.Register(userCreateDto))
                .ThrowsAsync(new Exception("As palavras-passes não são iguais."));

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            // Act
            var result = await controller.Register(userCreateDto);

            // Assert
             Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenUserCreateDtoIsNull()
        {
            // Arrange
            _userRepositoryStub.Setup(repo => repo.Register(null))
                .ThrowsAsync(new Exception());

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            // Act
            var result = await controller.Register(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ReturnsOk_WhenCredentialsAreCorrect()
        {
            // Arrange
            var userLoginDto = new UserLoginDto
            {
                Email = "miguel@example.com",
                Password = "123456"
            };

            string token = "token";

            _userRepositoryStub.Setup(repo => repo.Login(userLoginDto))
                .ReturnsAsync(token);

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            // Act
            var result = await controller.Login(userLoginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
        }


        [Fact]
        public async Task Login_ReturnsBadRequest_WhenUserNotFound()
        {
            // Arrange
            var userLoginDto = new UserLoginDto
            {
                Email = "miguel@example.com",
                Password = "123456"
            };

            _userRepositoryStub.Setup(repo => repo.Login(userLoginDto)).
            ThrowsAsync(new Exception("Utilizador não encontrado."));

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var result = await controller.Login(userLoginDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenPasswordIsIncorrect()
        {
            // Arrange
            var userLoginDto = new UserLoginDto
            {
                Email = "miguel@example.com",
                Password = "123456"
            };

            _userRepositoryStub.Setup(repo => repo.Login(userLoginDto)).
            ThrowsAsync(new Exception("Password incorreta."));

            var controller = new UsersController(_userRepositoryStub.Object, _groupRepositoryStub.Object);

            var result = await controller.Login(userLoginDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }


    }
}
