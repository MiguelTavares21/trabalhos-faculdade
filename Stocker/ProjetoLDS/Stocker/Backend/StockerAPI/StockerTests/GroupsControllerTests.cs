using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;
using StockerAPI.Controllers;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;

namespace StockerTests
{
    public class GroupsControllerTests
    {
        private readonly Mock<IGroupRepository> _repositoryStub = new();

        [Fact]
        public async Task CreateGroup_WithInvalidUser_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(0);

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            var model = new GroupCreateDto
            {
                Budget = 200,
                Description = "description",
                Name = "Name"
            };

            //Act

            var result = await controller.CreateGroup(model);

            //Assert

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateGroup_WithInvalidModel_ReturnBadRequest()
        {
            //Arrange

            var controller = new GroupsController(_repositoryStub.Object);

            var model = new GroupCreateDto
            {
                Budget = 200,
                Description = "description"
            };

            //Act

            var result = await controller.CreateGroup(model);

            //Assert

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateGroup_WithEmailClaimMissing_ReturnBadRequest()
        {
            //Arrange

            var controller = new GroupsController(_repositoryStub.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            var model = new GroupCreateDto
            {
                Budget = 200,
                Description = "description",
                Name = "name"
            };

            //Act

            var result = await controller.CreateGroup(model);

            //Assert

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateGroup_WithRepositoryError_ReturnBadRequest()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ThrowsAsync(new Exception());

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            var model = new GroupCreateDto
            {
                Budget = 200,
                Description = "description",
                Name = "Name"
            };

            //Act

            var result = await controller.CreateGroup(model);

            //Assert

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateGroup_WithValidInformation_ReturnCreatedAt()
        {
            // Arrange
            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            var expectedGroup = new GroupDto
            {
                Id = 1,
                Budget = 200,
                Description = "description",
                Name = "Name"
            };

            _repositoryStub.Setup(repo => repo.CreateGroup(It.IsAny<GroupCreateDto>(), It.IsAny<int>()))
                .ReturnsAsync(new GroupDto
                {
                    Id = 1,
                    Budget = 200,
                    Description = "description",
                    Name = "Name"
                });

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            var model = new GroupCreateDto
            {
                Budget = 200,
                Description = "description",
                Name = "Name"
            };

            // Act
            var result = await controller.CreateGroup(model);

            // Assert
            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(controller.CreateGroup), createdAtResult.ActionName);

            // Verifica se o grupo criado corresponde ao esperado
            var actualGroup = Assert.IsType<GroupDto>(createdAtResult.Value);
            Assert.Equal(expectedGroup.Id, actualGroup.Id);
            Assert.Equal(expectedGroup.Budget, actualGroup.Budget);
            Assert.Equal(expectedGroup.Description, actualGroup.Description);
            Assert.Equal(expectedGroup.Name, actualGroup.Name);
        }


        [Fact]
        public async Task GetUsers_WithRepositoryError_ReturnBadRequest()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetUsersByGroup(It.IsAny<int>()))
                .ThrowsAsync(new Exception());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.GetUsers(It.IsAny<int>());

            //Assert

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUsers_WithValidInformation_ReturnOk()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetUsersByGroup(It.IsAny<int>()))
                .ReturnsAsync(It.IsAny<List<userInGroupDto>>());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.GetUsers(It.IsAny<int>());

            //Assert

            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetGroup_WithRepositoryError_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetGroup(It.IsAny<int>()))
                .ThrowsAsync(new Exception());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.GetGroup(It.IsAny<int>());

            //Assert

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetGroup_WithValidInformation_ReturnOk()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetGroup(It.IsAny<int>()))
                .ReturnsAsync(It.IsAny<GroupDto>());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.GetGroup(It.IsAny<int>());

            //Assert

            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task LeaveGroup_WithEmailClaimMissing_ReturnBadRequest()
        {
            //Arrange

            var controller = new GroupsController(_repositoryStub.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            //Act

            var result = await controller.LeaveGroup(It.IsAny<int>());

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task LeaveGroup_WithInvalidUser_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(0);

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.LeaveGroup(It.IsAny<int>());

            //Assert

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task LeaveGroup_WithRepositoryError_ReturnBadRequest()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ThrowsAsync(new Exception());

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.LeaveGroup(It.IsAny<int>());

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task LeaveGroup_WithValidInformation_ReturnNoContent()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            _repositoryStub.Setup(repo => repo.LeaveGroup(It.IsAny<int>(), It.IsAny<int>()));

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.LeaveGroup(It.IsAny<int>());

            //Assert

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task ChangeRole_WithEmailClaimMissing_ReturnBadRequest()
        {
            //Arrange

            var controller = new GroupsController(_repositoryStub.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            //Act

            var result = await controller.ChangeRole(2, 1);

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ChangeRole_WithInvalidUser_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(0);

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.ChangeRole(2, 1);

            //Assert

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task ChangeRole_WithRepositoryError_ReturnBadRequest()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(1);

            _repositoryStub.Setup(repo => repo.ChangeRole(1, 1, 2))
                .ThrowsAsync(new ArgumentException());

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.ChangeRole(2, 1);

            //Assert

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ChangeRole_WithValidInformation_ReturnOk()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.GetIdByEmail(It.IsAny<string>()))
                .ReturnsAsync(3);

            _repositoryStub.Setup(repo => repo.ChangeRole(3, 1, 2));

            var controller = new GroupsController(_repositoryStub.Object);

            var userEmail = "test@example.com";
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, userEmail) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            //Act

            var result = await controller.ChangeRole(2, 1);

            //Assert

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task RemoveMember_WithRepositoryError_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.RemoveMember(3, 1))
                .ThrowsAsync(new ArgumentException());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.RemoveMember(1, 3);

            //Assert

            Assert.IsType<NotFoundObjectResult>(result);

        }

        [Fact]
        public async Task RemoveMember_WithValidInformation_ReturnOk()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.RemoveMember(3, 1));

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.RemoveMember(1, 3);

            //Assert

            Assert.IsType<OkObjectResult>(result);

        }

        [Fact]
        public async Task EditGroup_WithRepositoryError_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.EditGroup(It.IsAny<GroupEditDto>(), 2))
                .ThrowsAsync(new ArgumentException());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.EditGroup(2, It.IsAny<GroupEditDto>());

            //Assert

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task EditGroup_WithValidInformation_ReturnOkRequest()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.EditGroup(It.IsAny<GroupEditDto>(), 2))
                .ReturnsAsync(It.IsAny<GroupDto>());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.EditGroup(2, It.IsAny<GroupEditDto>());

            //Assert

            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task DeleteGroup_WithRepositoryError_ReturnNotFound()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.DeleteGroup(2))
                .ThrowsAsync(new ArgumentException());

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.DeleteGroup(2);

            //Assert

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task DeleteGroup_WithValidInformation_ReturnBadRequest()
        {
            //Arrange

            _repositoryStub.Setup(repo => repo.DeleteGroup(2));

            var controller = new GroupsController(_repositoryStub.Object);

            //Act

            var result = await controller.DeleteGroup(2);

            //Assert

            Assert.IsType<NoContentResult>(result);
        }
    }
}