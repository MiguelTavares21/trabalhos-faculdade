using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using StockerAPI.Controllers;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StockerTests
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductRepository> _productServiceMock;
        private readonly Mock<IGroupRepository> _groupServiceMock;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _productServiceMock = new Mock<IProductRepository>();
            _groupServiceMock = new Mock<IGroupRepository>();
            _controller = new ProductsController(_productServiceMock.Object, _groupServiceMock.Object);
        }

        [Fact]
        public async Task GetProduct_ShouldReturnOk_WhenProductExists()
        {
            // Arrange
            var productId = 1;
            var groupId = 1;
            var product = new ProductDto { Id = productId, Group_Id = groupId };
            _productServiceMock.Setup(s => s.GetProduct(productId, groupId)).ReturnsAsync(product);

            // Act
            var result = await _controller.GetProduct(productId, groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            Assert.Equal(product, okResult.Value);
        }

        [Fact]
        public async Task GetProduct_ShouldReturnNotFound_WhenProductDoesNotExist()
        {
            // Arrange
            _productServiceMock.Setup(s => s.GetProduct(It.IsAny<int>(), It.IsAny<int>())).ThrowsAsync(new ArgumentException());

            // Act
            var result = await _controller.GetProduct(1, 1);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task GetProduct_ShouldReturnBadRequest_WhenRepositoryThrowsException()
        {
            // Arrange
            var productId = 1;
            var groupId = 1;

            // Set up the product service to throw an exception
            _productServiceMock
                .Setup(s => s.GetProduct(productId, groupId))
                .ThrowsAsync(new Exception("Repository failure"));

            // Act
            var result = await _controller.GetProduct(productId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);
        }


        [Fact]
        public async Task CreateProduct_ShouldReturnCreated_WhenProductIsCreated()
        {
            // Arrange
            var product = new ProductCreateDto { Name = "New Product", Type = "Congelados", Ideal_Point = 20, Quantity = 12, Order_Point = 1, Unity = "Unidades"};
            var createdProduct = new ProductDto { Id = 1, Group_Id = 1, Name = "New Product", Type = "Congelados", Ideal_Point = 20, Quantity = 12, Order_Point = 1, Unity = "Unidades", In_List = false };
            _productServiceMock.Setup(s => s.CreateProduct(product, 1)).ReturnsAsync(createdProduct);

            // Act
            var result = await _controller.CreateProduct(product, 1);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(StatusCodes.Status201Created, createdResult.StatusCode);
            Assert.Equal(createdProduct, createdResult.Value);
        }

        [Fact]
        public async Task CreateProduct_ShouldReturnBadRequest_WhenRepositoryThrowsException()
        {
            // Arrange
            var product = new ProductCreateDto();
            var groupId = 1;

            // Set up the product service to throw an exception
            _productServiceMock
                .Setup(s => s.CreateProduct(product, groupId))
                .ThrowsAsync(new Exception("Repository failure"));

            // Act
            var result = await _controller.CreateProduct(product, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task UpdateProduct_ShouldReturnNoContent_WhenProductIsUpdated()
        {
            // Arrange
            var productDto = new ProductUpdateDto { Name = "Updated Product" };
            _productServiceMock.Setup(s => s.GetProduct(1, 1)).ReturnsAsync(new ProductDto { Id = 1 });
            _productServiceMock.Setup(s => s.UpdateProduct(1, 1, productDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateProduct(1, 1, productDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateProduct_ShouldReturnBadRequest_WhenRepositoryThrowsException()
        {
            // Arrange
            var productDto = new ProductUpdateDto { Name = "Updated Product" };
            var productId = 1;
            var groupId = 1;

            // Set up the product service to throw an exception
            _productServiceMock
                .Setup(s => s.UpdateProduct(productId, groupId, productDto))
                .ThrowsAsync(new Exception("Repository failure"));

            // Act
            var result = await _controller.UpdateProduct(productId, groupId, productDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task UpdateProduct_ShouldReturnNotFound_WhenProductDoesNotExist()
        {
            // Arrange
            var productDto = new ProductUpdateDto { Name = "Updated Product" };
            _productServiceMock.Setup(s => s.GetProduct(It.IsAny<int>(), It.IsAny<int>())).ThrowsAsync(new ArgumentException("Product not found"));

            // Act
            var result = await _controller.UpdateProduct(1, 1, productDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task DeleteProduct_ShouldReturnNoContent_WhenProductIsDeleted()
        {
            // Arrange
            _productServiceMock.Setup(s => s.GetProduct(1, 1)).ReturnsAsync(new ProductDto { Id = 1 });
            _productServiceMock.Setup(s => s.DeleteProduct(1, 1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteProduct(1, 1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteProduct_ShouldReturnNotFound_WhenProductDoesNotExist()
        {
            // Arrange
            _productServiceMock.Setup(s => s.GetProduct(It.IsAny<int>(), It.IsAny<int>())).ThrowsAsync(new ArgumentException("Product not found"));

            // Act
            var result = await _controller.DeleteProduct(1, 1);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task DeleteProduct_ShouldReturnBadRequest_WhenRepositoryThrowsException()
        {
            // Arrange
            var productId = 1;
            var groupId = 1;

            // Set up the product service to throw an exception
            _productServiceMock
                .Setup(s => s.DeleteProduct(productId, groupId))
                .ThrowsAsync(new Exception("Repository failure"));

            // Act
            var result = await _controller.DeleteProduct(productId, groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task ConsumeProduct_ShouldReturnOk_WhenProductIsConsumed()
        {
            // Arrange
            var quantityToConsume = 2.5f;
            _productServiceMock.Setup(s => s.GetProduct(1, 1)).ReturnsAsync(new ProductDto { Id = 1 });
            _productServiceMock.Setup(s => s.ConsumeProduct(1, 1, quantityToConsume)).ReturnsAsync(new Product
            {
                Id = 1,
                Quantity = 10, // Valor atualizado após o consumo
                In_List = false
            });

            // Act
            var result = await _controller.ConsumeProduct(1, 1, quantityToConsume);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedProduct = Assert.IsType<Product>(okResult.Value);
            Assert.Equal(10, returnedProduct.Quantity);
            Assert.False(returnedProduct.In_List);
        }

        [Fact]
        public async Task ConsumeProduct_ShouldReturnNotFound_WhenProductDoesNotExist()
        {
            // Arrange
            _productServiceMock.Setup(s => s.GetProduct(It.IsAny<int>(), It.IsAny<int>())).ThrowsAsync(new ArgumentException("Product not found"));

            // Act
            var result = await _controller.ConsumeProduct(1, 1, 12);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task ConsumeProduct_ShouldReturnBadRequest_WhenInsufficientQuantity()
        {
            // Arrange
            _productServiceMock.Setup(s => s.GetProduct(1, 1)).ReturnsAsync(new ProductDto { Id = 1 });
            _productServiceMock.Setup(s => s.ConsumeProduct(1, 1, It.IsAny<float>()))
                .ThrowsAsync(new Exception("Quantidade insuficiente no estoque."));

            // Act
            var result = await _controller.ConsumeProduct(1, 1, 5.0f);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);

            // Validar que o erro está no formato correto
            var errors = badRequestResult.Value as SerializableError;
            Assert.NotNull(errors);

            // Validar a mensagem de erro
            var errorMessages = errors["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Quantidade insuficiente no estoque.", errorMessages);
        }


        [Fact]
        public async Task ConsumeProduct_ShouldReturnBadRequest_WhenRepositoryThrowsException()
        {
            // Arrange
            var productId = 1;
            var groupId = 1;

            // Set up the product service to throw an exception
            _productServiceMock
                .Setup(s => s.ConsumeProduct(productId, groupId, It.IsAny<float>()))
                .ThrowsAsync(new Exception("Repository failure"));

            // Act
            var result = await _controller.ConsumeProduct(productId, groupId, 12);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetInventory_ShouldReturnOk_WhenProductsExist()
        {
            // Arrange
            var groupId = 1;
            var products = new List<ProductDto> { new ProductDto { Id = 1, Group_Id = groupId } };
            _productServiceMock.Setup(s => s.GetInventory(groupId)).ReturnsAsync(products);

            // Act
            var result = await _controller.GetInventory(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            Assert.Equal(products, okResult.Value);
        }

        [Fact]
        public async Task GetInventory_ShouldReturnBadRequest_WhenExceptionIsThrown()
        {
            // Arrange
            _productServiceMock.Setup(s => s.GetInventory(It.IsAny<int>()))
                .ThrowsAsync(new Exception("Erro inesperado."));

            // Act
            var result = await _controller.GetInventory(1);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);

            var errors = badRequestResult.Value as SerializableError;
            Assert.NotNull(errors);
            Assert.Contains("Erro inesperado.", errors["Error"] as string[]);
        }


        [Fact]
        public async Task GetAllProducts_ShouldReturnOk_WhenProductsExist()
        {
            // Arrange
            var groupId = 1;
            var products = new List<ProductDto> { new ProductDto { Id = 1, Group_Id = groupId } };
            _productServiceMock.Setup(s => s.GetAllProducts(groupId)).ReturnsAsync(products);

            // Act
            var result = await _controller.GetAllProducts(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            Assert.Equal(products, okResult.Value);
        }

        [Fact]
        public async Task GetAllProducts_ShouldReturnInternalServerError_WhenExceptionIsThrown()
        {
            // Arrange
            var groupId = 1;
            _productServiceMock.Setup(s => s.GetAllProducts(groupId)).ThrowsAsync(new Exception("Internal server error"));

            // Act
            var result = await _controller.GetAllProducts(groupId);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
        }
    }

}
