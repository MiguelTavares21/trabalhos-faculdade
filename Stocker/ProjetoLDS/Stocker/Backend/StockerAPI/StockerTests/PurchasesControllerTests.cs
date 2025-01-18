using Microsoft.AspNetCore.Mvc;
using Moq;
using StockerAPI.Controllers;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockerTests
{
    public class PurchasesControllerTests
    {
        private readonly Mock<IPurchaseRepository> _purchaseServiceMock;
        private readonly Mock<IGroupRepository> _groupServiceMock;
        private readonly PurchasesController _controller;

        public PurchasesControllerTests()
        {
            _purchaseServiceMock = new Mock<IPurchaseRepository>();
            _groupServiceMock = new Mock<IGroupRepository>();
            _controller = new PurchasesController(_purchaseServiceMock.Object, _groupServiceMock.Object);
        }

        [Fact]
        public async Task RegisterPurchase_ValidRequest_ReturnsCreatedAtAction()
        {
            // Arrange
            var productList = new List<Purchased_ProductCreateDto>
            {
                new Purchased_ProductCreateDto
                {
                    Product_Id = 1,
                    Price = 10.5f,
                    Quantity = 2.0f
                }
            };
            var groupId = 1;
            var purchaseDto = new PurchaseDto
            {
                Id = 1,
                Group_Id = groupId,
                Date = DateTime.UtcNow,
                Price = 21.0f // Total Price = Price * Quantity
            };

            _purchaseServiceMock.Setup(x => x.RegisterPurchase(productList, groupId))
                .ReturnsAsync(purchaseDto);

            // Act
            var result = await _controller.RegisterPurchase(productList, groupId);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(_controller.RegisterPurchase), actionResult.ActionName);
            Assert.Equal(purchaseDto, actionResult.Value);
        }

        [Fact]
        public async Task RegisterPurchase_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("Error", "Invalid model state");

            var productList = new List<Purchased_ProductCreateDto>
            {
                new Purchased_ProductCreateDto
                {
                    Product_Id = 1,
                    Price = -5.0f, 
                    Quantity = 2.0f
                }
            };
            var groupId = 1;

            // Act
            var result = await _controller.RegisterPurchase(productList, groupId);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessages = ((SerializableError)actionResult.Value)["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Invalid model state", errorMessages);
        }

        [Fact]
        public async Task RegisterPurchase_ServiceThrowsArgumentException_ReturnsBadRequest()
        {
            // Arrange
            var productList = new List<Purchased_ProductCreateDto>
            {
                new Purchased_ProductCreateDto
                {
                    Product_Id = 2,
                    Price = 15.0f,
                    Quantity = 3.0f
                }
            };
            var groupId = 1;

            _purchaseServiceMock.Setup(x => x.RegisterPurchase(productList, groupId))
                .ThrowsAsync(new ArgumentException("Invalid group ID"));

            // Act
            var result = await _controller.RegisterPurchase(productList, groupId);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessages = ((SerializableError)actionResult.Value)["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Invalid group ID", errorMessages);
        }

        [Fact]
        public async Task GetAllPurchases_ValidGroupId_ReturnsOkResultWithPurchases()
        {
            // Arrange
            int groupId = 1;
            var purchases = new List<PurchaseDto>
        {
            new PurchaseDto { Id = 1, Group_Id = groupId, Date = DateTime.Now, Price = 100.0f },
            new PurchaseDto { Id = 2, Group_Id = groupId, Date = DateTime.Now, Price = 200.0f }
        };

            _purchaseServiceMock
                .Setup(service => service.GetAllPurchases(groupId))
                .ReturnsAsync(purchases);

            // Act
            var result = await _controller.GetAllPurchases(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPurchases = Assert.IsType<List<PurchaseDto>>(okResult.Value);
            Assert.Equal(purchases.Count, returnedPurchases.Count);
        }

        [Fact]
        public async Task GetAllPurchases_GroupNotFound_ReturnsBadRequest()
        {
            // Arrange
            int groupId = 99;

            _purchaseServiceMock
                .Setup(service => service.GetAllPurchases(groupId))
                .ThrowsAsync(new ArgumentException("Group not found"));

            // Act
            var result = await _controller.GetAllPurchases(groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessages = ((SerializableError)badRequestResult.Value)["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Group not found", errorMessages);
        }

        [Fact]
        public async Task GetAllPurchases_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int groupId = 1;

            _purchaseServiceMock
                .Setup(service => service.GetAllPurchases(groupId))
                .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetAllPurchases(groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessages = ((SerializableError)badRequestResult.Value)["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Unexpected error", errorMessages);
        }

        [Fact]
        public async Task GetPurchase_ValidPurchaseId_ReturnsOkResultWithPurchase()
        {
            // Arrange
            int purchaseId = 1;
            var purchase = new PurchaseDto { Id = purchaseId, Group_Id = 1, Date = DateTime.Now, Price = 100.0f };

            _purchaseServiceMock
                .Setup(service => service.GetPurchase(purchaseId))
                .ReturnsAsync(purchase);

            // Act
            var result = await _controller.GetPurchase(purchaseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPurchase = Assert.IsType<PurchaseDto>(okResult.Value);
            Assert.Equal(purchase.Id, returnedPurchase.Id);
        }

        [Fact]
        public async Task GetPurchase_PurchaseNotFound_ReturnsNotFound()
        {
            // Arrange
            int purchaseId = 99;

            _purchaseServiceMock
                .Setup(service => service.GetPurchase(purchaseId))
                .ThrowsAsync(new ArgumentException("Purchase not found"));

            // Act
            var result = await _controller.GetPurchase(purchaseId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("Purchase not found", notFoundResult.Value);
        }

        [Fact]
        public async Task GetPurchase_UnauthorizedAccess_ReturnsForbid()
        {
            // Arrange
            int purchaseId = 1;

            _purchaseServiceMock
                .Setup(service => service.GetPurchase(purchaseId))
                .ThrowsAsync(new UnauthorizedAccessException("Access denied"));

            // Act
            var result = await _controller.GetPurchase(purchaseId);

            // Assert
            var forbidResult = Assert.IsType<ForbidResult>(result.Result);
        }

        [Fact]
        public async Task GetPurchase_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int purchaseId = 1;

            _purchaseServiceMock
                .Setup(service => service.GetPurchase(purchaseId))
                .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetPurchase(purchaseId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessages = ((SerializableError)badRequestResult.Value)["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Unexpected error", errorMessages);
        }

        [Fact]
        public async Task GetPurchaseProducts_ValidPurchaseId_ReturnsOkResultWithProducts()
        {
            // Arrange
            int purchaseId = 1;
            var purchasedProducts = new List<Purchased_ProductDto>
        {
            new Purchased_ProductDto { Product_Id = 1, Name = "Product 1", Price = 10.0f, Quantity = 2 },
            new Purchased_ProductDto { Product_Id = 2, Name = "Product 2", Price = 15.0f, Quantity = 1 }
        };

            _purchaseServiceMock
                .Setup(service => service.GetPurchaseProducts(purchaseId))
                .ReturnsAsync(purchasedProducts);

            // Act
            var result = await _controller.GetPurchaseProducts(purchaseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProducts = Assert.IsType<List<Purchased_ProductDto>>(okResult.Value);
            Assert.Equal(purchasedProducts.Count, returnedProducts.Count);
        }

        [Fact]
        public async Task GetPurchaseProducts_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int purchaseId = 1;

            _purchaseServiceMock
                .Setup(service => service.GetPurchaseProducts(purchaseId))
                .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetPurchaseProducts(purchaseId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorMessages = ((SerializableError)badRequestResult.Value)["Error"] as string[];
            Assert.NotNull(errorMessages);
            Assert.Contains("Unexpected error", errorMessages);
        }

        [Fact]
        public async Task DeletePurchase_ValidPurchase_ReturnsNoContent()
        {
            // Arrange
            int purchaseId = 1;
            _purchaseServiceMock.Setup(service => service.DeletePurchase(purchaseId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeletePurchase(purchaseId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }


        [Fact]
        public async Task DeletePurchase_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int purchaseId = 1;
            var exceptionMessage = "Unexpected error";
            _purchaseServiceMock
                .Setup(service => service.DeletePurchase(purchaseId))
                .Throws(new Exception(exceptionMessage));

            // Act
            var result = await _controller.DeletePurchase(purchaseId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);

            Assert.Contains(exceptionMessage, modelState.Values.SelectMany(v => (IEnumerable<object>)v).Cast<string>());
        }

        [Fact]
        public async Task GetShoppingList_ValidGroupId_ReturnsOkResult()
        {
            // Arrange
            int groupId = 1;
            var shoppingList = new List<ProductInListDto>
        {
            new ProductInListDto { Name = "Product 1", Quantity = 2, Unity = "Unity" },
            new ProductInListDto { Name = "Product 2", Quantity = 3, Unity = "Unity" }
        };

            _purchaseServiceMock.Setup(service => service.GetShoppingList(groupId))
                .ReturnsAsync(shoppingList);

            // Act
            var result = await _controller.GetShoppingList(groupId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<ProductInListDto>>(okResult.Value);
            Assert.Equal(shoppingList.Count, returnValue.Count);
        }

        [Fact]
        public async Task GetShoppingList_GroupNotFound_ReturnsNotFound()
        {
            // Arrange
            int groupId = 999; 
            _purchaseServiceMock.Setup(service => service.GetShoppingList(groupId))
                .Throws(new ArgumentException("Group not found"));

            // Act
            var result = await _controller.GetShoppingList(groupId);

            // Assert
            var notFoundResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(notFoundResult.Value);
            Assert.Contains("Group not found", modelState.Values.SelectMany(v => (IEnumerable<object>)v).Cast<string>());
        }

        [Fact]
        public async Task GetShoppingList_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int groupId = 1;
            _purchaseServiceMock.Setup(service => service.GetShoppingList(groupId))
                .Throws(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetShoppingList(groupId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
            Assert.Contains("Unexpected error", modelState.Values.SelectMany(v => (IEnumerable<object>)v).Cast<string>());
        }

        [Fact]
        public async Task ToggleProductInShoppingList_ValidIds_ReturnsNoContent()
        {
            // Arrange
            int groupId = 1;
            int productId = 2;

            _purchaseServiceMock.Setup(service => service.ToggleProductInShoppingList(productId, groupId))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ToggleProductInShoppingList(groupId, productId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task ToggleProductInShoppingList_ProductNotFound_ReturnsNotFound()
        {
            // Arrange
            int groupId = 1;
            int productId = 999; 

            _purchaseServiceMock.Setup(service => service.ToggleProductInShoppingList(productId, groupId))
                .Throws(new ArgumentException("Product not found"));

            // Act
            var result = await _controller.ToggleProductInShoppingList(groupId, productId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
            Assert.Contains("Product not found", modelState.Values.SelectMany(v => (IEnumerable<object>)v).Cast<string>());
        }

        [Fact]
        public async Task ToggleProductInShoppingList_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            int groupId = 1;
            int productId = 2;

            _purchaseServiceMock.Setup(service => service.ToggleProductInShoppingList(productId, groupId))
                .Throws(new Exception("Unexpected error"));

            // Act
            var result = await _controller.ToggleProductInShoppingList(groupId, productId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
            Assert.Contains("Unexpected error", modelState.Values.SelectMany(v => (IEnumerable<object>)v).Cast<string>());
        }
    }
}
