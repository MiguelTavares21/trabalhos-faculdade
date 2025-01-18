using Microsoft.EntityFrameworkCore;
using Moq;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using StockerAPI.Repository.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StockerTests
{
    public class ProductRepositoryTests
    {
        private readonly ApplicationDbContext _context;
        private readonly ProductRepository _productRepository;

        public ProductRepositoryTests()
        {
            // Configura o contexto para usar uma base de dados em memória
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);


            // Instancia o repositório com o contexto e a interface mockada
            _productRepository = new ProductRepository(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted(); // Limpa a base de dados
            _context.Database.EnsureCreated(); // Recria a base de dados
        }

        [Fact]
        public async Task GetProduct_ReturnProductDto_WhenProductExist()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act
            var result = await _productRepository.GetProduct(existingProduct.Id, groupId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<ProductDto>(result);
            Assert.Equal(existingProduct.Id, result.Id);
            Assert.Equal(existingProduct.Name, result.Name);
            Assert.Equal(existingProduct.Quantity, result.Quantity);
            Assert.Equal(existingProduct.Unity, result.Unity);
            Assert.Equal(existingProduct.Order_Point, result.Order_Point);
            Assert.Equal(existingProduct.Ideal_Point, result.Ideal_Point);
            Assert.Equal(existingProduct.Type, result.Type);
            Assert.Equal(existingProduct.In_List, result.In_List);
            Assert.Equal(existingProduct.Group_Id, result.Group_Id);
        }

        [Fact]
        public async Task GetProduct_ThrowsArgumentException_WhenProductDoesNotExist()
        {
            // Arrange
            var groupId = 1;
            var productId = 123456;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _productRepository.GetProduct(productId, groupId));

            //Assert
            Assert.IsType<ArgumentException>(exception);
        }

        [Fact]
        public async Task GetProduct_ThrowsException_WhenProductDoesNotBelongToGroup()
        {
            // Arrange
            var groupId = 1;
            var fakeGroupId = 2;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _productRepository.GetProduct(existingProduct.Id, fakeGroupId));

            //Assert
            Assert.IsType<Exception>(exception);
        }

        [Fact]
        public async Task CreateProduct_ReturnProductDto_IfProductIsCreatedSuccessfully()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new ProductCreateDto
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados"
            };

            // Act
            var result = await _productRepository.CreateProduct(existingProduct, groupId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<ProductDto>(result);
            Assert.Equal(existingProduct.Name, result.Name);
            Assert.Equal(existingProduct.Quantity, result.Quantity);
            Assert.Equal(existingProduct.Unity, result.Unity);
            Assert.Equal(existingProduct.Order_Point, result.Order_Point);
            Assert.Equal(existingProduct.Ideal_Point, result.Ideal_Point);
            Assert.Equal(existingProduct.Type, result.Type);
            Assert.False(result.In_List);
            Assert.Equal(groupId, result.Group_Id);
        }

        [Fact]
        public async Task CreateProduct_ThrowsArgumentException_IfProductWithSameNameInGroupAlreadyExists()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            var productToTest = new ProductCreateDto
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados"
            };


            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _productRepository.CreateProduct(productToTest, groupId));

            //Assert
            Assert.IsType<Exception>(exception);
        }

        [Fact]
        public async Task UpdateProduct_UpdatesProduct_WhenDataIsValid()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            var productUpdate = new ProductUpdateDto
            {
                Name = "Produto1Updated",
                Quantity = 13,
                Order_Point = 2,
                Ideal_Point = 23,
            };

            // Act
            await _productRepository.UpdateProduct(existingProduct.Id, groupId, productUpdate);

            // Assert
            var productUpdated = await _context.Products.FirstOrDefaultAsync(ug => ug.Name == productUpdate.Name && ug.Group_Id == groupId);

            Assert.NotNull(productUpdated);
            Assert.Equal(existingProduct.Id, productUpdated.Id);
            Assert.Equal(productUpdate.Name, productUpdated.Name);
            Assert.Equal(productUpdate.Quantity, productUpdated.Quantity);
            Assert.Equal(existingProduct.Unity, productUpdated.Unity);
            Assert.Equal(productUpdate.Order_Point, productUpdated.Order_Point);
            Assert.Equal(productUpdate.Ideal_Point, productUpdated.Ideal_Point);
            Assert.Equal(existingProduct.Type, productUpdated.Type);
            Assert.Equal(existingProduct.In_List, productUpdated.In_List);
            Assert.Equal(existingProduct.Group_Id, productUpdated.Group_Id);
        }

        [Fact]
        public async Task UpdateProduct_ThrowsException_WhenProductDoesNotBelongToGroup()
        {
            // Arrange
            var groupId = 1;
            var fakeGroupId = 2;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            var productUpdate = new ProductUpdateDto
            {
                Name = "Produto1Updated",
                Quantity = 13,
                Order_Point = 2,
                Ideal_Point = 23,
            };

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _productRepository.UpdateProduct(existingProduct.Id, fakeGroupId, productUpdate));

            //Assert
            Assert.IsType<Exception>(exception);
        }

        [Fact]
        public async Task DeleteProduct_DeletesProduct_WhenRequestIsValid()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act
            await _productRepository.DeleteProduct(existingProduct.Id, groupId);

            // Assert
            var productDeleted = await _context.Products.FirstOrDefaultAsync(ug => ug.Name == existingProduct.Name && ug.Group_Id == groupId);

            Assert.Null(productDeleted);
        }

        [Fact]
        public async Task DeleteProduct_ThrowsException_WhenProductDoesNotBelongToGroup()
        {
            // Arrange
            var groupId = 1;
            var fakeGroupId = 2;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _productRepository.DeleteProduct(existingProduct.Id, fakeGroupId));

            //Assert
            Assert.IsType<Exception>(exception);
        }

        [Fact]
        public async Task DeleteProduct_ThrowsException_WhenProductUsedInRecipe()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            var fakeRecipe = new Recipe
            {
                Id = 1,
                Name = "test",
                Group_Id = groupId,
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.Recipes.AddAsync(fakeRecipe);
            var recipeProductLog = new Recipe_Product
            {
                Product_Id = existingProduct.Id,
                Quantity = 12,
                Recipe_Id = fakeRecipe.Id,
            };
            await _context.Recipes_Products.AddAsync(recipeProductLog);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _productRepository.DeleteProduct(existingProduct.Id, groupId));

            //Assert
            Assert.IsType<Exception>(exception);
        }

        [Fact]
        public async Task CanDeleteProduct_ReturnsTrue()
        {
            // Arrange
            var groupId = 1;
            var existingProduct1 = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            var existingProduct2 = new Product
            {
                Name = "Produto2",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            var fakeRecipe = new Recipe
            {
                Id = 1,
                Name = "test",
                Group_Id = groupId,
            };

            await _context.Products.AddRangeAsync(existingProduct1, existingProduct2);
            await _context.Recipes.AddAsync(fakeRecipe);
            var recipeProductLog = new Recipe_Product
            {
                Product_Id = existingProduct2.Id,
                Quantity = 12,
                Recipe_Id = fakeRecipe.Id,
            };
            await _context.Recipes_Products.AddAsync(recipeProductLog);
            await _context.SaveChangesAsync();

            // Act
            var result = await _productRepository.CanDeleteProduct(existingProduct1.Id);

            //Assert
            Assert.True(result);
        }

        [Fact]
        public async Task CanDeleteProduct_ReturnsFalse()
        {
            // Arrange
            var groupId = 1;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            var fakeRecipe = new Recipe
            {
                Id = 1,
                Name = "test",
                Group_Id = groupId,
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.Recipes.AddAsync(fakeRecipe);
            var recipeProductLog = new Recipe_Product
            {
                Product_Id = existingProduct.Id,
                Quantity = 12,
                Recipe_Id = fakeRecipe.Id,
            };
            await _context.Recipes_Products.AddAsync(recipeProductLog);
            await _context.SaveChangesAsync();

            // Act
            var result = await _productRepository.CanDeleteProduct(existingProduct.Id);

            //Assert
            Assert.False(result);
        }


        [Fact]
        public async Task ConsumeProduct_ThrowsException_WhenProductDoesNotBelongToGroup()
        {
            // Arrange
            var groupId = 1;
            var fakeGroupId = 2;
            var quantityToConsume = 11;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };

            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _productRepository.ConsumeProduct(existingProduct.Id, fakeGroupId, quantityToConsume));

            //Assert
            Assert.IsType<Exception>(exception);
        }

        [Fact]
        public async Task ConsumeProduct_ThrowsException_WhenQuantityIsNotEnough()
        {
            // Arrange
            var groupId = 1;
            var quantityToConsume = 13;
            var existingProduct = new Product
            {
                Name = "Produto1",
                Quantity = 12,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            await _context.Products.AddAsync(existingProduct);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(async () =>
                await _productRepository.ConsumeProduct(existingProduct.Id, groupId, quantityToConsume));

            Assert.Equal("Quantidade insuficiente no estoque.", exception.Message);
        }

        [Fact]
        public async Task GetInventory_ReturnsListProducts_IfProductsWithQuantityInGroup()
        {
            // Arrange
            var groupId = 1;
            var existingProduct1 = new Product
            {
                Name = "Produto1",
                Quantity = 13,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct2 = new Product
            {
                Name = "Produto2",
                Quantity = 14,
                Unity = "Gramas",
                Order_Point = 1,
                Ideal_Point = 41,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct3 = new Product
            {
                Name = "Produto3",
                Quantity = 52,
                Unity = "Kilos",
                Order_Point = 1,
                Ideal_Point = 90,
                Type = "Congelados",
                In_List = true,
                Group_Id = groupId
            };

            await _context.Products.AddRangeAsync(existingProduct1, existingProduct2, existingProduct3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _productRepository.GetInventory(groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Equal(existingProduct1.Name, result[0].Name);
            Assert.Equal(existingProduct1.Quantity, result[0].Quantity);
            Assert.Equal(existingProduct1.Unity, result[0].Unity);
            Assert.Equal(existingProduct1.Order_Point, result[0].Order_Point);
            Assert.Equal(existingProduct1.Ideal_Point, result[0].Ideal_Point);
            Assert.Equal(existingProduct1.Type, result[0].Type);
            Assert.Equal(existingProduct1.In_List, result[0].In_List);
            Assert.Equal(existingProduct1.Group_Id, result[0].Group_Id);


            Assert.Equal(existingProduct2.Name, result[1].Name);
            Assert.Equal(existingProduct2.Quantity, result[1].Quantity);
            Assert.Equal(existingProduct2.Unity, result[1].Unity);
            Assert.Equal(existingProduct2.Order_Point, result[1].Order_Point);
            Assert.Equal(existingProduct2.Ideal_Point, result[1].Ideal_Point);
            Assert.Equal(existingProduct2.Type, result[1].Type);
            Assert.Equal(existingProduct2.In_List, result[1].In_List);
            Assert.Equal(existingProduct2.Group_Id, result[1].Group_Id);


            Assert.Equal(existingProduct3.Name, result[2].Name);
            Assert.Equal(existingProduct3.Quantity, result[2].Quantity);
            Assert.Equal(existingProduct3.Unity, result[2].Unity);
            Assert.Equal(existingProduct3.Order_Point, result[2].Order_Point);
            Assert.Equal(existingProduct3.Ideal_Point, result[2].Ideal_Point);
            Assert.Equal(existingProduct3.Type, result[2].Type);
            Assert.Equal(existingProduct3.In_List, result[2].In_List);
            Assert.Equal(existingProduct3.Group_Id, result[2].Group_Id);
        }

        [Fact]
        public async Task GetInventory_ReturnsEmptyList_IfNoProductsWithQuantityInGroup()
        {
            // Arrange
            var groupId = 1;
            var existingProduct1 = new Product
            {
                Name = "Produto1",
                Quantity = 0,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct2 = new Product
            {
                Name = "Produto2",
                Quantity = 0,
                Unity = "Gramas",
                Order_Point = 1,
                Ideal_Point = 41,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct3 = new Product
            {
                Name = "Produto3",
                Quantity = 0,
                Unity = "Kilos",
                Order_Point = 1,
                Ideal_Point = 90,
                Type = "Congelados",
                In_List = true,
                Group_Id = groupId
            };

            await _context.Products.AddRangeAsync(existingProduct1, existingProduct2, existingProduct3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _productRepository.GetInventory(groupId);

            // Assert
            Assert.NotNull(result); // Verifica que o retorno não é nulo
            Assert.Empty(result);   // Verifica que a lista está vazia
        }


        [Fact]
        public async Task GetAllProducts_ReturnsListProducts_IfProductsInGroup()
        {
            // Arrange
            var groupId = 1;
            var existingProduct1 = new Product
            {
                Name = "Produto1",
                Quantity = 0,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct2 = new Product
            {
                Name = "Produto2",
                Quantity = 14,
                Unity = "Gramas",
                Order_Point = 1,
                Ideal_Point = 41,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct3 = new Product
            {
                Name = "Produto3",
                Quantity = 0,
                Unity = "Kilos",
                Order_Point = 1,
                Ideal_Point = 90,
                Type = "Congelados",
                In_List = true,
                Group_Id = groupId
            };

            await _context.Products.AddRangeAsync(existingProduct1, existingProduct2, existingProduct3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _productRepository.GetAllProducts(groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Equal(existingProduct1.Name, result[0].Name);
            Assert.Equal(existingProduct1.Quantity, result[0].Quantity);
            Assert.Equal(existingProduct1.Unity, result[0].Unity);
            Assert.Equal(existingProduct1.Order_Point, result[0].Order_Point);
            Assert.Equal(existingProduct1.Ideal_Point, result[0].Ideal_Point);
            Assert.Equal(existingProduct1.Type, result[0].Type);
            Assert.Equal(existingProduct1.In_List, result[0].In_List);
            Assert.Equal(existingProduct1.Group_Id, result[0].Group_Id);


            Assert.Equal(existingProduct2.Name, result[1].Name);
            Assert.Equal(existingProduct2.Quantity, result[1].Quantity);
            Assert.Equal(existingProduct2.Unity, result[1].Unity);
            Assert.Equal(existingProduct2.Order_Point, result[1].Order_Point);
            Assert.Equal(existingProduct2.Ideal_Point, result[1].Ideal_Point);
            Assert.Equal(existingProduct2.Type, result[1].Type);
            Assert.Equal(existingProduct2.In_List, result[1].In_List);
            Assert.Equal(existingProduct2.Group_Id, result[1].Group_Id);


            Assert.Equal(existingProduct3.Name, result[2].Name);
            Assert.Equal(existingProduct3.Quantity, result[2].Quantity);
            Assert.Equal(existingProduct3.Unity, result[2].Unity);
            Assert.Equal(existingProduct3.Order_Point, result[2].Order_Point);
            Assert.Equal(existingProduct3.Ideal_Point, result[2].Ideal_Point);
            Assert.Equal(existingProduct3.Type, result[2].Type);
            Assert.Equal(existingProduct3.In_List, result[2].In_List);
            Assert.Equal(existingProduct3.Group_Id, result[2].Group_Id);
        }

        [Fact]
        public async Task GetAllProducts_ThrowsException_IfNoProductsInGroup()
        {
            // Arrange
            var groupId = 1;
            var fakeGroupId = 123;
            var existingProduct1 = new Product
            {
                Name = "Produto1",
                Quantity = 0,
                Unity = "Unidades",
                Order_Point = 1,
                Ideal_Point = 20,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct2 = new Product
            {
                Name = "Produto2",
                Quantity = 0,
                Unity = "Gramas",
                Order_Point = 1,
                Ideal_Point = 41,
                Type = "Congelados",
                In_List = false,
                Group_Id = groupId
            };
            var existingProduct3 = new Product
            {
                Name = "Produto3",
                Quantity = 0,
                Unity = "Kilos",
                Order_Point = 1,
                Ideal_Point = 90,
                Type = "Congelados",
                In_List = true,
                Group_Id = groupId
            };

            await _context.Products.AddRangeAsync(existingProduct1, existingProduct2, existingProduct3);
            await _context.SaveChangesAsync();

            // Act
            var result = await Assert.ThrowsAsync<Exception>(() => _productRepository.GetAllProducts(fakeGroupId));

            // Assert
            Assert.IsType<Exception>(result);
        }
    }
}
