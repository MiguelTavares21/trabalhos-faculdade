using Microsoft.EntityFrameworkCore;
using Moq;
using StockerAPI.Data;
using StockerAPI.Models.Dto;
using StockerAPI.Models;
using StockerAPI.Repository.Interfaces;
using StockerAPI.Repository.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace StockerTests
{
    public class PurchasesRepositoryTests
    {
        private readonly ApplicationDbContext _context;
        private readonly PurchaseRepository _purchaseRepository;

        public PurchasesRepositoryTests()
        {
            // Configura o contexto para usar um banco de dados em memória
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning)) // Suprimir aviso de transação
                .Options;

            _context = new ApplicationDbContext(options);


            // Instancia o repositório com o contexto e a interface mockada
            _purchaseRepository = new PurchaseRepository(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted(); // Limpa a base de dados
            _context.Database.EnsureCreated(); // Recria a base de dados
        }


        [Fact]
        public async Task RegisterPurchase_WhenPurchaseIsSuccessful_ReturnsPurchaseDto()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Quantity = 10,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 2,
                Ideal_Point = 5,
                In_List = true,
                Type = Types.Panificacao_Confeitaria.ToString(),
            };
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            var productList = new List<Purchased_ProductCreateDto>
            {
                new Purchased_ProductCreateDto
                {
                Product_Id = product.Id,
                Price = 100,
                Quantity = 2,
                Unity = Unities.Unidades.ToString()
                }
            };  

            // Act
            var result = await _purchaseRepository.RegisterPurchase(productList, group.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(group.Id, result.Group_Id);
            Assert.Equal(100, result.Price); 
            var updatedProduct = await _context.Products.FindAsync(product.Id);
            Assert.Equal(12.0f, updatedProduct.Quantity);
            Assert.False(updatedProduct.In_List);
        }

        [Fact]
        public async Task RegisterPurchase_WhenMultipleProductsArePurchased_ReturnsPurchaseDto()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product1 = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Quantity = 10,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 2,
                Ideal_Point = 5,
                In_List = true,
                Type = Types.Panificacao_Confeitaria.ToString(),
            };

            var product2 = new Product
            {
                Group_Id = group.Id,
                Name = "Product 2",
                Quantity = 5,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 3,
                Ideal_Point = 7,
                In_List = true,
                Type = Types.Bebidas.ToString(),
            };

            await _context.Products.AddRangeAsync(product1, product2);
            await _context.SaveChangesAsync();

            var productList = new List<Purchased_ProductCreateDto>
    {
        new Purchased_ProductCreateDto
        {
            Product_Id = product1.Id,
            Price = 100,
            Quantity = 2,
            Unity = Unities.Unidades.ToString()
        },
        new Purchased_ProductCreateDto
        {
            Product_Id = product2.Id,
            Price = 50,
            Quantity = 3,
            Unity = Unities.Unidades.ToString()
        }
    };

            // Act
            var result = await _purchaseRepository.RegisterPurchase(productList, group.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(group.Id, result.Group_Id);
            Assert.Equal(150, result.Price);

            var updatedProduct1 = await _context.Products.FindAsync(product1.Id);
            var updatedProduct2 = await _context.Products.FindAsync(product2.Id);

            Assert.Equal(12, updatedProduct1.Quantity);
            Assert.False(updatedProduct1.In_List);

            Assert.Equal(8, updatedProduct2.Quantity);
            Assert.False(updatedProduct2.In_List);
        }


        [Fact]
        public async Task RegisterPurchase_WhenProductNotInGroup_ThrowsException()
        {
            // Arrange
            var group = new Group { Name = "Group 2", Access_code = "123456789", Budget = 500 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id + 1,
                Name = "Product 1",
                Quantity = 10,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 2,
                Ideal_Point = 5,
                In_List = true,
                Type = Types.Panificacao_Confeitaria.ToString(),
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

        
            var productList = new List<Purchased_ProductCreateDto>
            {
                new Purchased_ProductCreateDto
                {
                Product_Id = product.Id,
                Price = 50,
                Quantity = 3
                }
             };

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.RegisterPurchase(productList, group.Id));
            
            //Assert
            Assert.Equal("Não pode adicionar produtos que não são referentes ao seu grupo.", exception.Message);
        }

        [Fact]
        public async Task RegisterPurchase_SkipsInvalidProductData()
        {
            // Arrange: Configuração do grupo e produto
            var group = new Group { Name = "Group", Access_code = "123456789", Budget = 3000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id + 1,
                Name = "Product 1",
                Quantity = 10,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 2,
                Ideal_Point = 5,
                In_List = true,
                Type = Types.Panificacao_Confeitaria.ToString(),
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            var productList = new List<Purchased_ProductCreateDto>
            {
            new Purchased_ProductCreateDto { Product_Id = product.Id, Price = -10, Quantity = 2 },
            new Purchased_ProductCreateDto { Product_Id = product.Id, Price = 10, Quantity = -10 }
            };

            // Act
            var result = await _purchaseRepository.RegisterPurchase(productList, group.Id);

            Assert.NotNull(result);
            Assert.Equal(0.0f, result.Price);
        }

        [Fact]
        public async Task GetAllPurchases_WhenPurchasesExist_ReturnsAllPurchasesForGroup()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var purchase1 = new Purchase { Group_Id = group.Id, Price = 100, Date = DateTime.UtcNow };
            var purchase2 = new Purchase { Group_Id = group.Id, Price = 200, Date = DateTime.UtcNow };
            var purchase3 = new Purchase { Group_Id = group.Id, Price = 300, Date = DateTime.UtcNow };

            await _context.Purchases.AddRangeAsync(purchase1, purchase2, purchase3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetAllPurchases(group.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);

            Assert.Equal(purchase1.Id, result[0].Id);
            Assert.Equal(purchase1.Group_Id, result[0].Group_Id);
            Assert.Equal(purchase1.Price, result[0].Price);
            Assert.Equal(purchase1.Date, result[0].Date);

            Assert.Equal(purchase2.Id, result[1].Id);
            Assert.Equal(purchase2.Group_Id, result[1].Group_Id);
            Assert.Equal(purchase2.Price, result[1].Price);
            Assert.Equal(purchase2.Date, result[1].Date);

            Assert.Equal(purchase3.Id, result[2].Id);
            Assert.Equal(purchase3.Group_Id, result[2].Group_Id);
            Assert.Equal(purchase3.Price, result[2].Price);
            Assert.Equal(purchase3.Date, result[2].Date);
        }

        [Fact]
        public async Task GetAllPurchases_ReturnsEmptyList_WhenNoPurchasesExistForGroup()
        {
            // Arrange
            var group = new Group { Name = "Group 2", Access_code = "987654321", Budget = 3000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetAllPurchases(group.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetPurchase_WhenPurchaseExists_ReturnsPurchaseDto()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var purchase = new Purchase
            {
                Group_Id = group.Id,
                Price = 150,
                Date = DateTime.UtcNow
            };
            await _context.Purchases.AddAsync(purchase);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetPurchase(purchase.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(purchase.Id, result.Id);
            Assert.Equal(purchase.Group_Id, result.Group_Id);
            Assert.Equal(purchase.Price, result.Price);
            Assert.Equal(purchase.Date, result.Date);
        }


        [Fact]
        public async Task GetPurchase_WhenPurchaseDoesNotExist_ThrowsArgumentException()
        {
            // Arrange
            var PurchaseId = 9999;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.GetPurchase(PurchaseId));
            
            // Assert
            Assert.Equal("Compra não foi encontrada.", exception.Message);
        }


        [Fact]
        public async Task GetPurchaseProducts_WhenProductsExistForPurchase_ReturnsProductDtos()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var purchase = new Purchase
            {
                Group_Id = group.Id,
                Price = 100,
                Date = DateTime.UtcNow
            };
            await _context.Purchases.AddAsync(purchase);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Quantity = 10,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 2,
                Ideal_Point = 5,
                In_List = true,
                Type = Types.Casa.ToString(),
            };
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            var purchasedProduct = new Purchased_Product
            {
                Purchase_Id = purchase.Id,
                Product_Id = product.Id,
                Price = 100,
                Quantity = 2,
                Unity = Unities.Unidades.ToString()
            };
            await _context.Purchased_Products.AddAsync(purchasedProduct);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetPurchaseProducts(purchase.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(product.Id, result[0].Product_Id);
            Assert.Equal(product.Name, result[0].Name);
            Assert.Equal(purchasedProduct.Price, result[0].Price);
            Assert.Equal(purchasedProduct.Quantity, result[0].Quantity);
        }

        [Fact]
        public async Task GetPurchaseProducts_WhenPurchaseDoesNotExist_ThrowsArgumentException()
        {
            // Arrange
            var PurchaseId = 9999;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.GetPurchaseProducts(PurchaseId));
            
            // Assert
            Assert.Equal("Compra não foi encontrada.", exception.Message);
        }

        [Fact]
        public async Task GetPurchaseProducts_WhenNoProductsAreAssociatedWithPurchase_RrsEmptyList()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var purchase = new Purchase
            {
                Group_Id = group.Id,
                Price = 150,
                Date = DateTime.UtcNow
            };
            await _context.Purchases.AddAsync(purchase);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetPurchaseProducts(purchase.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }


        [Fact]
        public async Task GetPurchaseProducts_WhenMultipleProductsExistForPurchase_ReturnsAllProducts()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var purchase = new Purchase
            {
                Group_Id = group.Id,
                Price = 300,
                Date = DateTime.UtcNow
            };
            await _context.Purchases.AddAsync(purchase);
            await _context.SaveChangesAsync();

            var product1 = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Quantity = 10,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 2,
                Ideal_Point = 5,
                In_List = true,
                Type = Types.Animais.ToString(),
            };

            var product2 = new Product
            {
                Group_Id = group.Id,
                Name = "Product 2",
                Quantity = 5,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 1,
                Ideal_Point = 3,
                In_List = true,
                Type = Types.Outro.ToString(),
            };

            await _context.Products.AddRangeAsync(product1, product2);
            await _context.SaveChangesAsync();

            var purchasedProduct1 = new Purchased_Product
            {
                Purchase_Id = purchase.Id,
                Product_Id = product1.Id,
                Price = 100,
                Quantity = 2,
                Unity = Unities.Unidades.ToString()
            };

            var purchasedProduct2 = new Purchased_Product
            {
                Purchase_Id = purchase.Id,
                Product_Id = product2.Id,
                Price = 200,
                Quantity = 3,
                Unity = Unities.Unidades.ToString()
            };

            await _context.Purchased_Products.AddRangeAsync(purchasedProduct1, purchasedProduct2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetPurchaseProducts(purchase.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.Product_Id == product1.Id && p.Quantity == purchasedProduct1.Quantity);
            Assert.Contains(result, p => p.Product_Id == product2.Id && p.Quantity == purchasedProduct2.Quantity);
        }

        [Fact]
        public async Task DeletePurchase_WhenPurchaseExists_DeletesPurchase()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var purchase = new Purchase
            {
                Group_Id = group.Id,
                Price = 150,
                Date = DateTime.UtcNow
            };
            await _context.Purchases.AddAsync(purchase);
            await _context.SaveChangesAsync();

            // Act
            await _purchaseRepository.DeletePurchase(purchase.Id);

            // Assert
            var deletedPurchase = await _context.Purchases.FindAsync(purchase.Id);
            Assert.Null(deletedPurchase);
        }

        [Fact]
        public async Task DeletePurchase_WhenPurchaseDoesNotExist_ThrowsArgumentException()
        {
            // Arrange
            var nonExistentPurchaseId = 9999;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.DeletePurchase(nonExistentPurchaseId));
            
            // Assert
            Assert.Equal("Compra não foi encontrada.", exception.Message);
        }

        [Fact]
        public async Task GetShoppingList_WhenProductsExist_ReturnsProductInListDto()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product1 = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Quantity = 1,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 5,
                Ideal_Point = 10,
                In_List = true,
                Type = Types.Casa.ToString(),
            };

            var product2 = new Product
            {
                Group_Id = group.Id,
                Name = "Product 2",
                Quantity = 5,
                Unity = Unities.Unidades.ToString(),
                Order_Point = 5,
                Ideal_Point = 15,
                In_List = true,
                Type = Types.Casa.ToString(),
            };

            await _context.Products.AddRangeAsync(product1, product2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetShoppingList(group.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("Product 1", result[0].Name);
            Assert.Equal(9, result[0].Quantity);

            Assert.Equal("Product 2", result[1].Name);
            Assert.Equal(10, result[1].Quantity);
        }


        [Fact]
        public async Task GetShoppingList_WhenNoProductsInList_ReturnsEmptyList()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            // Act
            var result = await _purchaseRepository.GetShoppingList(group.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);  // Espera-se que a lista esteja vazia
        }


        [Fact]
        public async Task GetShoppingList_WhenIdealPointIsNull_CalculatesQuantityAsNegativeQuantity()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Quantity = 1,
                Unity = Unities.Unidades.ToString(),
                In_List = true,
                Type = Types.Casa.ToString(),
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _purchaseRepository.GetShoppingList(group.Id));

            // Assert
            Assert.Equal("A quantidade do produto 'Product 1' não pode ser negativa.", exception.Message);
        }


        [Fact]
        public async Task ToggleProductInShoppingList_WhenProductDoesNotExist_ThrowsArgumentException()
        {
            // Arrange
            var productId = 1;
            var groupId = 1;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.ToggleProductInShoppingList(productId, groupId));
            
            // Assert
            Assert.Equal("Produto não existe.", exception.Message);
        }

        [Fact]
        public async Task ToggleProductInShoppingList_WhenProductDoesNotBelongToGroup_ThrowsArgumentException()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id + 1,
                Name = "Product 1",
                Unity = Unities.Unidades.ToString(),
                Quantity = 1,
                Ideal_Point = 5,
                Order_Point = 1,
                Type = Types.Casa.ToString(),
                In_List = false
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.ToggleProductInShoppingList(product.Id, group.Id));
           
            // Assert
            Assert.Equal("Produto não pertence ao grupo.", exception.Message);
        }

        [Fact]
        public async Task ToggleProductInShoppingList_WhenQuantityIsGreaterThanOrEqualToIdealPoint_ThrowsArgumentException()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Unity = Unities.Unidades.ToString(),
                Quantity = 15,
                Ideal_Point = 10,
                Order_Point = 5,
                Type = Types.Casa.ToString(),
                In_List = false
            };


            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            var productId = product.Id;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.ToggleProductInShoppingList(productId, group.Id));
            
            //Assert
            Assert.Equal("Produto já está na quantidade desejada, altere o ponto ideal.", exception.Message);
        }

        [Fact]
        public async Task ToggleProductInShoppingList_WhenProductDoesNotHaveIdealPoint_ThrowsArgumentException()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Unity = Unities.Unidades.ToString(),
                Quantity = 5,
                Type = Types.Casa.ToString(),
                In_List = false
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            var productId = product.Id;

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _purchaseRepository.ToggleProductInShoppingList(productId, group.Id));
            
            // Assert
            Assert.Equal("Produto não tem ponto ideal definido.", exception.Message);
        }

        [Fact]
        public async Task ToggleProductInShoppingList_WhenValidProduct_ChangesInListStatus()
        {
            // Arrange
            var group = new Group { Name = "Group 1", Access_code = "123456789", Budget = 2000 };
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            var product = new Product
            {
                Group_Id = group.Id,
                Name = "Product 1",
                Unity = Unities.Unidades.ToString(),
                Quantity = 5,
                Ideal_Point = 10,
                Order_Point = 5,
                Type = Types.Casa.ToString(),
                In_List = false 
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            var productId = product.Id;

            // Act
            await _purchaseRepository.ToggleProductInShoppingList(productId, group.Id);

            // Assert
            var updatedProduct = await _context.Products.FindAsync(productId);
            Assert.True(updatedProduct.In_List);
        }

    }
}
