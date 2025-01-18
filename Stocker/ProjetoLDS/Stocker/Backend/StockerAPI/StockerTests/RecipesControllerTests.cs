
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
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace StockerTests
{
    public class RecipesControllerTests
    {
        private readonly Mock<IRecipeRepository> _recipeServiceStub = new();
        private readonly RecipeController _controller;

        public RecipesControllerTests()
        {
            _recipeServiceStub = new Mock<IRecipeRepository>();

            _controller = new RecipeController(_recipeServiceStub.Object);
        }

        [Fact]
        public async Task GetAllRecipes_WithValidGroupId_ReturnsOk()
        {
            // Arrange
            var groupId = 1;
            var expectedRecipes = new List<RecipeDto>
            {
                new RecipeDto { Id = 1, Name = "Recipe 1" },
                new RecipeDto { Id = 2, Name = "Recipe 2" }
            };

            _recipeServiceStub.Setup(service => service.GetAllRecipes(groupId))
                .ReturnsAsync(expectedRecipes);

            var controller = new RecipeController(_recipeServiceStub.Object);

            // Act
            var result = await controller.GetAllRecipes(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var actualRecipes = Assert.IsType<List<RecipeDto>>(okResult.Value);
            Assert.Equal(expectedRecipes.Count, actualRecipes.Count);
            Assert.Equal(expectedRecipes[0].Name, actualRecipes[0].Name);
        }

        [Fact]
        public async Task GetAllRecipes_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.GetAllRecipes(groupId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetAllRecipes(groupId);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetRecipe_WithValidRecipeIdAndGroupId_ReturnsOk()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            var expectedRecipe = new RecipeDto
            {
                Id = recipeId,
                Name = "Test Recipe"
            };

            _recipeServiceStub.Setup(service => service.GetRecipe(recipeId, groupId))
                .ReturnsAsync(expectedRecipe);

            // Act
            var result = await _controller.GetRecipe(recipeId, groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var actualRecipe = Assert.IsType<RecipeDto>(okResult.Value);
            Assert.Equal(expectedRecipe.Id, actualRecipe.Id);
            Assert.Equal(expectedRecipe.Name, actualRecipe.Name);
        }

        [Fact]
        public async Task GetRecipe_WithInvalidRecipeIdOrGroupId_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.GetRecipe(recipeId, groupId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetRecipe(recipeId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);

        }

        [Fact]
        public async Task GetAllProducts_WithValidRecipeIdAndGroupId_ReturnsOkResult()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;
            var products = new List<ProductRecipeDto>
        {
            new ProductRecipeDto { Name = "Product1", Quantity = 20 },
            new ProductRecipeDto { Name = "Product2", Quantity = 20 }
        };

            _recipeServiceStub.Setup(service => service.GetAllProducts(recipeId, groupId))
                .ReturnsAsync(products);

            // Act
            var result = await _controller.GetAllProducts(recipeId, groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(products, okResult.Value);
        }

        [Fact]
        public async Task GetAllProducts_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.GetAllProducts(recipeId, groupId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetAllProducts(recipeId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateRecipe_WithValidData_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var groupId = 1;
            var recipeCreateDto = new RecipeCreateDto { Name = "Test Recipe" };
            var createdRecipeDto = new RecipeDto { Id = 1, Name = "Test Recipe" };

            _recipeServiceStub.Setup(service => service.CreateRecipe(recipeCreateDto, groupId))
                .ReturnsAsync(createdRecipeDto);

            // Act
            var result = await _controller.CreateRecipe(recipeCreateDto, groupId);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnedRecipe = Assert.IsType<RecipeDto>(createdAtActionResult.Value);
            Assert.Equal(createdRecipeDto.Name, returnedRecipe.Name);
            Assert.Equal(createdRecipeDto.Id, returnedRecipe.Id);
            Assert.Equal("GetRecipe", createdAtActionResult.ActionName);
        }

        [Fact]
        public async Task CreateRecipe_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var groupId = 1;
            var recipeCreateDto = new RecipeCreateDto { Name = "Test Recipe" };

            _recipeServiceStub.Setup(service => service.CreateRecipe(recipeCreateDto, groupId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.CreateRecipe(recipeCreateDto, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);

        }

        [Fact]
        public async Task AddProductToRecipe_ReturnsNoContent_WhenProductIsAddedSuccessfully()
        {
            // Arrange
            int recipeId = 1;
            int groupId = 1;
            var product = new ProductAddToRecipeDto { Name = "Product", Quantity = 5 };
            _recipeServiceStub.Setup(service => service.AddProductToRecipe(groupId,recipeId, product))
                              .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AddProductToRecipe(groupId, recipeId, product);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task AddProductToRecipe_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            int recipeId = 1;
            int groupId = 1;
            var product = new ProductAddToRecipeDto();
            _controller.ModelState.AddModelError("ProductId", "Required");

            // Act
            var result = await _controller.AddProductToRecipe(groupId, recipeId, product);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task AddProductToRecipe_ReturnsNoContent_WhenInformationIsValid()
        {
            // Arrange
            int recipeId = 1;
            int groupId = 1;
            var product = new ProductAddToRecipeDto
            {
                Name = "Product 1",
                Quantity = 5
            };

            _recipeServiceStub.Setup(service => service.AddProductToRecipe(groupId, recipeId, product))
                              .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AddProductToRecipe(groupId, recipeId, product);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(204, noContentResult.StatusCode);
        }


        [Fact]
        public async Task ConsumeRecipe_WithValidData_ReturnsNoContent()
        {
            // Arrange
            var groupId = 1;
            var recipeId = 1;

            _recipeServiceStub.Setup(service => service.ConsumeRecipe(recipeId, groupId))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ConsumeRecipe(recipeId, groupId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task ConsumeRecipe_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.ConsumeRecipe(recipeId, groupId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.ConsumeRecipe(recipeId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
        }

        [Fact]
        public async Task ConsumeRecipe_WithInvalidIds_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = -1;
            var groupId = -1;

            _recipeServiceStub.Setup(service => service.ConsumeRecipe(recipeId, groupId))
                .ThrowsAsync(new Exception("Invalid recipe or group ID"));

            // Act
            var result = await _controller.ConsumeRecipe(recipeId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
        }

        [Fact]
        public async Task EditRecipe_WithValidData_ReturnsOkResult()
        {
            // Arrange
            var groupId = 1;
            var recipeId = 1;
            var recipeCreateDto = new RecipeCreateDto { Name = "Updated Recipe" };
            var updatedRecipeDto = new RecipeDto { Id = recipeId, Name = "Updated Recipe" };

            _recipeServiceStub.Setup(service => service.EditRecipe(recipeId, recipeCreateDto, groupId))
                .ReturnsAsync(updatedRecipeDto);

            // Act
            var result = await _controller.EditRecipe(recipeId, recipeCreateDto, groupId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<RecipeDto>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedRecipe = Assert.IsType<RecipeDto>(okResult.Value);
            Assert.Equal(updatedRecipeDto.Name, returnedRecipe.Name);
        }

        [Fact]
        public async Task EditRecipe_WhenExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            var groupId = 1;
            var recipeId = 1;
            var recipeCreateDto = new RecipeCreateDto { Name = "Updated Recipe" };

            _recipeServiceStub.Setup(service => service.EditRecipe(recipeId, recipeCreateDto, groupId))
                .ThrowsAsync(new Exception("Error occurred"));

            // Act
            var result = await _controller.EditRecipe(recipeId, recipeCreateDto, groupId);

            // Assert
            var badRequestResult = Assert.IsType<ActionResult<RecipeDto>>(result).Result;
            var badRequestObjectResult = Assert.IsType<BadRequestObjectResult>(badRequestResult);
            var modelState = badRequestObjectResult.Value as SerializableError;
            Assert.NotNull(modelState);
            Assert.True(modelState.ContainsKey("Error"));
        }


        [Fact]
        public async Task EditRecipe_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var groupId = 1;
            var recipeId = 1;
            var recipeCreateDto = new RecipeCreateDto { Name = "Invalid Recipe" };

            _controller.ModelState.AddModelError("Name", "The Name field is required.");

            // Act
            var result = await _controller.EditRecipe(recipeId, recipeCreateDto, groupId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<RecipeDto>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var modelState = badRequestResult.Value as SerializableError;
            Assert.NotNull(modelState);
            Assert.True(modelState.ContainsKey("Name"));
        }

        [Fact]
        public async Task EditRecipeProduct_WhenExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;
            var productRecipeDto = new ProductAddToRecipeDto
            {
                Name = "Test Product",
                Quantity = 1.5f
            };

            _recipeServiceStub.Setup(service => service.EditRecipeProduct(groupId, recipeId, productRecipeDto))
                .ThrowsAsync(new Exception("Erro ao editar produto da receita"));

            // Act
            var result = await _controller.EditRecipeProduct(groupId, recipeId, productRecipeDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = badRequestResult.Value as SerializableError;
            Assert.NotNull(modelState);
            Assert.True(modelState.ContainsKey("Error"));
        }

        [Fact]
        public async Task EditRecipeProduct_WithValidData_ReturnsNoContent()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;
            var productRecipeDto = new ProductAddToRecipeDto
            {
                Name = "Test Product",
                Quantity = 1.5f
            };

            _recipeServiceStub.Setup(service => service.EditRecipeProduct(groupId, recipeId, productRecipeDto))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.EditRecipeProduct(groupId, recipeId, productRecipeDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task EditRecipeProduct_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;
            var productRecipeDto = new ProductAddToRecipeDto
            {
                Name = "",
                Quantity = -1f
            };

            // Adiciona erros ao ModelState para simular dados inválidos
            _controller.ModelState.AddModelError("Name", "O nome do produto não pode estar vazio.");
            _controller.ModelState.AddModelError("Quantity", "Quantidade deve ser maior ou igual a 0.");

            // Act
            var result = await _controller.EditRecipeProduct(groupId, recipeId, productRecipeDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = badRequestResult.Value as SerializableError;
            Assert.NotNull(modelState);
            Assert.True(modelState.ContainsKey("Name"));
            Assert.True(modelState.ContainsKey("Quantity"));
        }

        [Fact]
        public async Task EditRecipeProduct_WithInvalidRecipeOrProduct_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var productRecipeDto = new ProductAddToRecipeDto
            {
                Name = "Invalid Product",
                Quantity = 5
            };
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.EditRecipeProduct(groupId, recipeId, productRecipeDto))
                .ThrowsAsync(new Exception("Invalid recipe or product ID"));

            // Act
            var result = await _controller.EditRecipeProduct(groupId, recipeId, productRecipeDto);

            // Assert   
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
            Assert.True(modelState.ContainsKey("Error"));
        }

        [Fact]
        public async Task RemoveRecipe_ValidId_ReturnsNoContent()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            // Act
            var result = await _controller.RemoveRecipe(recipeId, groupId);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(StatusCodes.Status204NoContent, noContentResult.StatusCode);
            _recipeServiceStub.Verify(service => service.RemoveRecipe(recipeId, groupId), Times.Once);
        }

        [Fact]
        public async Task RemoveRecipe_WithValidRecipeIdAndGroupId_ReturnsNoContent()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            // Aqui não devemos simular uma exceção, pois queremos testar o cenário de sucesso
            _recipeServiceStub.Setup(service => service.RemoveRecipe(recipeId, groupId))
                .Returns(Task.CompletedTask); // Simula o comportamento esperado

            // Act
            var result = await _controller.RemoveRecipe(recipeId, groupId);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(StatusCodes.Status204NoContent, noContentResult.StatusCode);
        }

        [Fact]
        public async Task RemoveRecipe_WithInvalidRecipeId_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.RemoveRecipe(recipeId, groupId))
                .ThrowsAsync(new Exception("Invalid recipe or group ID"));

            // Act
            var result = await _controller.RemoveRecipe(recipeId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("Error"));
            var errorMessages = modelState["Error"] as IEnumerable<string>; // Converta para IEnumerable<string>

            Assert.NotNull(errorMessages);
            Assert.Single(errorMessages);
            Assert.Equal("Invalid recipe or group ID", errorMessages.First());
        }

        [Fact]
        public async Task RemoveRecipeProduct_WithValidRecipeIdProductIdAndGroupId_ReturnsNoContent()
        {
            // Arrange
            var recipeId = 1;
            var productId = 1;
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.RemoveRecipeProduct(recipeId, productId, groupId))
                .Returns(Task.CompletedTask); // Simula a execução bem-sucedida

            // Act
            var result = await _controller.RemoveRecipeProduct(recipeId, productId, groupId);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(StatusCodes.Status204NoContent, noContentResult.StatusCode);
        }

        [Fact]
        public async Task RemoveRecipeProduct_WhenExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            var recipeId = 1;
            var productId = 1;
            var groupId = 1;

            _recipeServiceStub.Setup(service => service.RemoveRecipeProduct(recipeId, productId, groupId))
                .ThrowsAsync(new Exception("Error removing product from recipe"));

            // Act
            var result = await _controller.RemoveRecipeProduct(recipeId, productId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);

            // Verifique se a chave "Error" está presente e se a mensagem é a esperada
            Assert.True(modelState.ContainsKey("Error"));
            var errorMessages = modelState["Error"] as IEnumerable<string>;

            Assert.NotNull(errorMessages);
            Assert.Single(errorMessages);
            Assert.Equal("Error removing product from recipe", errorMessages.First());
        }

    }
}


