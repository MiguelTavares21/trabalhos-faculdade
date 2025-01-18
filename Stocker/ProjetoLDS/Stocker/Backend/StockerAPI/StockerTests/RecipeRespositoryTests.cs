using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Moq;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace StockerTests
{
    public class RecipeRepositoryTests
    {
        private readonly ApplicationDbContext _context;
        private readonly RecipeRepository _recipeRepository;

        public RecipeRepositoryTests()
        {
            // Configura o contexto para usar um banco de dados em memória
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning)) // Suprimir aviso de transação
                .Options;

            _context = new ApplicationDbContext(options);
            _recipeRepository = new RecipeRepository(_context); // Instancia o repositório com o contexto em memória
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted(); 
            _context.Dispose();
        }

        [Fact]
        public async Task AddProductToRecipe_ProductAddedSuccessfully()
        {
            // Arrange
            var product = new Product
            {
                Name = "Banana",
                Quantity = 100,
                Unity = "Kilos",
                Type = "Frutas e Verduras",
                Group_Id = 1
            };

            var recipe = new Recipe
            {
                Name = "Bolo",
                Group_Id = 1
            };

            // Adiciona o produto e a receita ao contexto
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            var productAddToRecipeDto = new ProductAddToRecipeDto
            {
                Name = "Banana",
                Quantity = 3
            };

            // Act
            await _recipeRepository.AddProductToRecipe(product.Group_Id, recipe.Id, productAddToRecipeDto);

            // Assert
            var recipeProduct = await _context.Recipes_Products
                .FirstOrDefaultAsync(rp => rp.Recipe_Id == recipe.Id && rp.Product_Id == product.Id);

            Assert.NotNull(recipeProduct); // Verifica que o produto foi adicionado à receita
            Assert.Equal(3, recipeProduct.Quantity); // Verifica se a quantidade foi atribuída corretamente
        }

        [Fact]
        public async Task AddProductToRecipe_ProductNotFound_ThrowsException()
        {
            // Arrange
            var recipe = new Recipe
            {
                Name = "Bolo",
                Group_Id = 1
            };

            // Adiciona a receita ao contexto
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            var productAddToRecipeDto = new ProductAddToRecipeDto
            {
                Name = "NonExistingProduct",
                Quantity = 3
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.AddProductToRecipe(recipe.Group_Id, recipe.Id, productAddToRecipeDto));

            Assert.Equal("Ocorreu um erro ao adicionar o produto à receita. (Produto não encontrado)", exception.Message);
        }


        [Fact]
        public async Task AddProductToRecipe_RecipeNotFound_ThrowsException()
        {
            // Arrange
            var product = new Product
            {
                Name = "Banana",
                Quantity = 100,
                Unity = "Kilos",
                Type = "Frutas e Verduras",
                Group_Id = 1
            };

            // Adiciona o produto ao contexto
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var productAddToRecipeDto = new ProductAddToRecipeDto
            {
                Name = "Banana",
                Quantity = 3
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.AddProductToRecipe(product.Group_Id, 9999, productAddToRecipeDto)); // Receita inexistente

            Assert.Equal("Ocorreu um erro ao adicionar o produto à receita. (Receita não encontrada)", exception.Message);
        }


        [Fact]
        public async Task AddProductToRecipe_ProductAlreadyInRecipe_ThrowsException()
        {
            // Arrange
            var product = new Product
            {
                Name = "Banana",
                Quantity = 100,
                Unity = "Kilos", 
                Type = "Frutas e Verduras", 
                Group_Id = 1
            };

            var recipe = new Recipe
            {
                Name = "Bolo",
                Group_Id = 1
            };

            // Adiciona o produto e a receita ao contexto
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            var productAddToRecipeDto = new ProductAddToRecipeDto
            {
                Name = "Banana",
                Quantity = 3
            };
            await _recipeRepository.AddProductToRecipe(product.Group_Id, recipe.Id, productAddToRecipeDto);

            // Tenta adicionar novamente o mesmo produto à receita
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.AddProductToRecipe(product.Group_Id, recipe.Id, productAddToRecipeDto));

            Assert.Equal("O produto já se encontra presente nesta receita.", exception.Message);
        }

        [Fact]
        public async Task CreateRecipe_RecipeIsNull_ThrowsException()
        {
            // Arrange
            RecipeCreateDto recipe = null;
            int groupId = 1;

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.CreateRecipe(recipe, groupId));

            Assert.Equal("Erro ao receber a informação da receita.", exception.Message);
        }


        [Fact]
        public async Task CreateRecipe_GroupNotFound_ThrowsException()
        {
            // Arrange
            var recipeCreateDto = new RecipeCreateDto
            {
                Name = "Bolo"
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.CreateRecipe(recipeCreateDto, 999)); // ID de grupo inválido

            Assert.Equal("Erro ao associar receita ao grupo.", exception.Message);
        }

        [Fact]
        public async Task CreateRecipe_ValidRecipe_ReturnsRecipeDto()
        {
            // Arrange
            var groupId = 1;
            var recipe = new RecipeCreateDto
            {
                Name = "Valid Recipe"
            };

            var group = new Group
            {
                Id = groupId,
                Name = "Valid Group",  
                Access_code = "123456"
            };

            _context.Groups.Add(group);  
            await _context.SaveChangesAsync();  

            // Act
            var result = await _recipeRepository.CreateRecipe(recipe, groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(recipe.Name, result.Name);  // Verifica se a receita foi criada corretamente
        }

        [Fact]
        public async Task GetAllProducts_ValidRecipeAndGroup_ReturnsProducts()
        {
            // Arrange
            int recipeId = 1;
            int groupId = 1;

            var recipe = new Recipe { Id = recipeId, Group_Id = groupId, Name = "Receita" };
            _context.Recipes.Add(recipe);

            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Produto1", Type = "Frutas e Verduras", Unity = "Kilos" },
                new Product { Id = 2, Name = "Produto2", Type = "Carne e Peixe", Unity = "Gramas" }
            };

            _context.Products.AddRange(products);

            var recipeProducts = new List<Recipe_Product>
            {
                new Recipe_Product { Recipe_Id = recipeId, Product_Id = 1 },
                new Recipe_Product { Recipe_Id = recipeId, Product_Id = 2 }
            };

            _context.Recipes_Products.AddRange(recipeProducts);
            await _context.SaveChangesAsync();

            // Act
            var result = await _recipeRepository.GetAllProducts(recipeId, groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("Produto1", result[0].Name);
            Assert.Equal("Produto2", result[1].Name);
        }


        [Fact]
        public async Task GetAllProducts_RecipeWithoutProducts_ThrowsException()
        {
            // Arrange
            int recipeId = 1;
            int groupId = 1;

            var recipe = new Recipe { Id = recipeId, Group_Id = groupId, Name = "Receita" };
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.GetAllProducts(recipeId, groupId));
            Assert.Equal("A receita não tem nenhum produto associado.", exception.Message);
        }

        [Fact]
        public async Task GetAllProducts_RecipeNotAssociatedWithGroup_ThrowsException()
        {
            // Arrange
            int recipeId = 1;
            int correctGroupId = 1;
            int incorrectGroupId = 2;

            var recipe = new Recipe { Id = recipeId, Group_Id = correctGroupId, Name = "Receita" };
            _context.Recipes.Add(recipe);

            var product = new Product { Id = 1, Name = "Banana", Type = "Frutas e Verduras", Unity = "Kilos" };
            _context.Products.Add(product);

            var recipeProduct = new Recipe_Product { Recipe_Id = recipeId, Product_Id = product.Id };
            _context.Recipes_Products.Add(recipeProduct);

            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.GetAllProducts(recipeId, incorrectGroupId));
            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task GetAllRecipes_WithRecipesInGroup_ReturnsRecipes()
        {
            // Arrange
            int groupId = 1;
            _context.Groups.Add(new Group { Id = groupId, Name = "Group 1", Access_code = "12345" });
            _context.Recipes.Add(new Recipe { Id = 1, Name = "Recipe 1", Group_Id = groupId });
            _context.Recipes.Add(new Recipe { Id = 2, Name = "Recipe 2", Group_Id = groupId });
            await _context.SaveChangesAsync();

            // Act
            var result = await _recipeRepository.GetAllRecipes(groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.Name == "Recipe 1");
            Assert.Contains(result, r => r.Name == "Recipe 2");
        }

        [Fact]
        public async Task GetAllRecipes_NoRecipesInGroup_ThrowsArgumentException()
        {
            // Arrange
            int groupId = 1;
            _context.Groups.Add(new Group { Id = groupId, Name = "Group 1", Access_code = "12345" });  
            await _context.SaveChangesAsync(); 

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _recipeRepository.GetAllRecipes(groupId));
            Assert.Equal("Nenhuma receita está associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task GetAllRecipes_GroupDoesNotExist_ThrowsArgumentException()
        {
            // Arrange
            int groupId = 1;  

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _recipeRepository.GetAllRecipes(groupId));
            Assert.Equal("Nenhuma receita está associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task GetAllRecipes_GroupHasNoRecipes_ThrowsArgumentException()
        {
            // Arrange
            int groupId = 1;
            var group = new Group { Id = groupId, Name = "Group 1", Access_code = "12345" };
            _context.Groups.Add(group);

            await _context.SaveChangesAsync(); 

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
                _recipeRepository.GetAllRecipes(groupId));

            Assert.Equal("Nenhuma receita está associada a este grupo.", exception.Message);
        }


        [Fact]
        public async Task GetAllRecipes_ValidGroupId_ReturnsNonEmptyList()
        {
            // Arrange
            int groupId = 1;
            var group = new Group { Id = groupId, Name = "Group 1", Access_code = "12345" };
            _context.Groups.Add(group);

            var recipe = new Recipe { Id = 1, Name = "Recipe 1", Group_Id = groupId };
            _context.Recipes.Add(recipe);

            await _context.SaveChangesAsync(); 

            // Act
            var result = await _recipeRepository.GetAllRecipes(groupId);

            // Assert
            Assert.NotNull(result); 
            Assert.NotEmpty(result); 
            Assert.Single(result); 
            Assert.Equal("Recipe 1", result[0].Name); 
        }

        [Fact]
        public async Task GetRecipe_ValidRecipe_ReturnsRecipeDto()
        {
            // Arrange
            int groupId = 1;
            var recipe = new Recipe { Id = 1, Name = "Recipe 1", Group_Id = groupId };
            
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync(); 

            // Act
            var result = await _recipeRepository.GetRecipe(recipe.Id, groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(recipe.Id, result.Id);
            Assert.Equal(recipe.Name, result.Name);
        }

        [Fact]
        public async Task GetRecipe_RecipeNotFound_ThrowsArgumentException()
        {
            // Arrange
            int groupId = 1;
            int recipeId = 999; // ID de uma receita inexistente

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
                _recipeRepository.GetRecipe(recipeId, groupId));

            Assert.Equal("Receita não encontrada.", exception.Message);
        }

        [Fact]
        public async Task GetRecipe_RecipeNotInGroup_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            int wrongGroupId = 2; 
            var recipe = new Recipe { Id = 1, Name = "Recipe 1", Group_Id = groupId };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync(); 

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.GetRecipe(recipe.Id, wrongGroupId));

            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task RemoveRecipe_ValidRecipe_RemovesRecipeSuccessfully()
        {
            // Arrange
            int groupId = 1;
            var recipe = new Recipe { Id = 1, Name = "Recipe 1", Group_Id = groupId };
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act
            await _recipeRepository.RemoveRecipe(recipe.Id, groupId);

            // Assert
            var deletedRecipe = await _context.Recipes.FindAsync(recipe.Id);
            Assert.Null(deletedRecipe); // Confirma que a receita foi removida
        }

        [Fact]
        public async Task RemoveRecipe_RecipeNotFound_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            int recipeId = 999; // ID de uma receita inexistente

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.RemoveRecipe(recipeId, groupId));

            Assert.Equal("Receita não encontrada.", exception.Message);
        }

        [Fact]
        public async Task RemoveRecipe_RecipeNotInGroup_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            int wrongGroupId = 2; // ID de grupo incorreto
            var recipe = new Recipe { Id = 1, Name = "Recipe 1", Group_Id = groupId };
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.RemoveRecipe(recipe.Id, wrongGroupId));

            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task ConsumeRecipe_ValidRecipeAndProducts_SuccessfullyConsumesRecipe()
        {
            // Arrange
            int groupId = 1;
            var group = new Group { Id = groupId, Access_code = "12345", Name = "Grupo1" }; 
            var recipe = new Recipe { Id = 1, Name = "Receita1", Group_Id = groupId };
            var product = new Product { Id = 1, Name = "Produto1", Quantity = 10, Type = "Frutas e Verduras", Unity = "Kilos"};
            var recipeProduct = new Recipe_Product { Recipe_Id = recipe.Id, Product_Id = product.Id, Quantity = 5 };

            _context.Groups.Add(group);
            _context.Recipes.Add(recipe);
            _context.Products.Add(product);
            _context.Recipes_Products.Add(recipeProduct);
            await _context.SaveChangesAsync();

            // Act
            await _recipeRepository.ConsumeRecipe(recipe.Id, groupId);

            // Assert
            var updatedProduct = await _context.Products.FindAsync(product.Id);
            Assert.Equal(5, updatedProduct.Quantity); // Confirma que a quantidade foi atualizada corretamente
            var logEntry = await _context.Product_Use_Log.FirstOrDefaultAsync();
            Assert.NotNull(logEntry); // Confirma que o log de uso do produto foi criado
        }

        [Fact]
        public async Task ConsumeRecipe_RecipeNotFound_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            int invalidRecipeId = 999;

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.ConsumeRecipe(invalidRecipeId, groupId));
            Assert.Equal("Receita não encontrada.", exception.Message);
        }

        [Fact]
        public async Task ConsumeRecipe_RecipeNotInGroup_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            int wrongGroupId = 2;
            var recipe = new Recipe { Id = 1, Name = "Receita1", Group_Id = groupId };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.ConsumeRecipe(recipe.Id, wrongGroupId));
            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task ConsumeRecipe_RecipeHasNoAssociatedProducts_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            var recipe = new Recipe { Id = 1, Name = "Receita1", Group_Id = groupId };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.ConsumeRecipe(recipe.Id, groupId));
            Assert.Equal("Esta receita não tem produtos associados.", exception.Message);
        }

        [Fact]
        public async Task ConsumeRecipe_InsufficientProductQuantity_ThrowsException()
        {
            // Arrange
            int groupId = 1;
            var group = new Group { Id = groupId, Access_code = "12345", Name = "Grupo1" };
            var recipe = new Recipe { Id = 1, Name = "Receita1", Group_Id = groupId };
            var product = new Product { Id = 1, Name = "Produto1", Quantity = 3, Type = "Carne e Peixe", Unity = "Kilos" }; 
            var recipeProduct = new Recipe_Product { Recipe_Id = recipe.Id, Product_Id = product.Id, Quantity = 5 };

            _context.Groups.Add(group);
            _context.Recipes.Add(recipe);
            _context.Products.Add(product);
            _context.Recipes_Products.Add(recipeProduct);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.ConsumeRecipe(recipe.Id, groupId)
            );
            Assert.Equal("Não tem Produto1 suficiente no inventário.", exception.Message);
        }


        [Fact]
        public async Task EditRecipe_RecipeNotFound_ThrowsException()
        {
            // Arrange
            int recipeId = 999;
            int groupId = 1;
            var recipeName = new RecipeCreateDto { Name = "New Recipe Name" };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.EditRecipe(recipeId, recipeName, groupId)
            );
            Assert.Equal("Receita não encontrada.", exception.Message);
        }

        [Fact]
        public async Task EditRecipe_RecipeNotInGroup_ThrowsException()
        {
            // Arrange
            int recipeId = 1;
            int groupId = 2;
            var recipeName = new RecipeCreateDto { Name = "New Recipe Name" };

            var recipe = new Recipe { Id = recipeId, Name = "Original Recipe", Group_Id = 1 };
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _recipeRepository.EditRecipe(recipeId, recipeName, groupId)
            );
            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task EditRecipe_ValidRecipe_EditsSuccessfully()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;
            var originalName = "Original Recipe Name";
            var updatedName = "Updated Recipe Name";

            // Configura o mock do banco de dados para retornar a receita original
            var targetRecipe = new Recipe
            {
                Id = recipeId,
                Name = originalName,
                Group_Id = groupId,
                Group = new Group { Id = groupId, Access_code = "12345", Name = "Test Group" }
            };

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            // Criação do contexto e adição da receita original
            using (var context = new ApplicationDbContext(options))
            {
                context.Recipes.Add(targetRecipe);
                await context.SaveChangesAsync();
            }

            // Action
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new RecipeRepository(context);
                var recipeCreateDto = new RecipeCreateDto { Name = updatedName };

                // Aqui chama o método EditRecipe
                var result = await repository.EditRecipe(recipeId, recipeCreateDto, groupId);

                // Assert
                var updatedRecipe = await context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId);
                Assert.NotNull(updatedRecipe);
                Assert.Equal(updatedName, updatedRecipe.Name);
                Assert.Equal(recipeId, updatedRecipe.Id);
            }
        }

        [Fact]
        public async Task EditRecipeProduct_ProductNotFound_ThrowsException()
        {
            // Arrange
            var recipeId = 1;
            var groupId = 1;
            var productDto = new ProductAddToRecipeDto { Name = "NonExistentProduct", Quantity = 5 };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.EditRecipeProduct(groupId,recipeId, productDto));
        }

        [Fact]
        public async Task EditRecipeProduct_RecipeNotFound_ThrowsException()
        {
            // Arrange
            var product = new Product
            {
                Name = "ProdutoA",
                Type = "Frutas e Verduras",
                Unity = "Kilos",
                Group_Id = 1 
            };
            var productDto = new ProductAddToRecipeDto { Name = "ProdutoA", Quantity = 5 };

            // Adiciona o produto no contexto
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var invalidRecipeId = 999;

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.EditRecipeProduct(product.Group_Id, invalidRecipeId, productDto));
            Assert.Equal("Ocorreu um erro ao editar o produto. (Receita não encontrada)", exception.Message);
        }


        [Fact]
        public async Task EditRecipeProduct_ProductAndRecipeInDifferentGroups_ThrowsException()
        {
            // Arrange
            var productDto = new ProductAddToRecipeDto { Name = "ProdutoA", Quantity = 5 };
            var invalidRecipeId = 999; 
            var product = new Product
            {
                Name = "ProdutoA",
                Type = "Frutas e Verduras", 
                Unity = "Kilos", 
                Group_Id = 1
            };

            // Adiciona o produto no contexto de teste
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.EditRecipeProduct(product.Group_Id, invalidRecipeId, productDto));
            Assert.Equal("Ocorreu um erro ao editar o produto. (Receita não encontrada)", exception.Message);
        }

        [Fact]
        public async Task RemoveRecipeProduct_RecipeNotInGroup_ThrowsException()
        {
            // Arrange
            var product = new Product { Name = "ProdutoA", Type = "Frutas e Verduras", Unity = "Kilos", Group_Id = 1 };
            var recipe = new Recipe { Id = 1, Group_Id = 2, Name = "ReceitaA" }; 
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.RemoveRecipeProduct(recipe.Id, product.Id, 1));
            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task RemoveRecipeProduct_ProductNotFoundInRecipe_ThrowsException()
        {
            // Arrange
            var product = new Product { Name = "ProdutoA", Type = "Frutas e Verduras", Unity = "Kilos", Group_Id = 1 };
            var recipe = new Recipe { Id = 1, Group_Id = 1, Name = "ReceitaA" }; // Receita no grupo correto
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.RemoveRecipeProduct(recipe.Id, product.Id, recipe.Group_Id));
            Assert.Equal("O produto não se encontra presente nesta receita.", exception.Message);
        }

        [Fact]
        public async Task RemoveRecipeProduct_ValidProduct_RemovesSuccessfully()
        {
            // Arrange
            var product = new Product { Name = "ProdutoA", Type = "Frutas e Verduras", Unity = "Kilos", Group_Id = 1 };
            var recipe = new Recipe { Id = 1, Group_Id = 1, Name = "ReceitaA" };
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Associando o produto à receita
            var recipeProduct = new Recipe_Product { Product_Id = product.Id, Recipe_Id = recipe.Id, Product = product, Recipe = recipe };
            _context.Recipes_Products.Add(recipeProduct);
            await _context.SaveChangesAsync();

            // Act
            await _recipeRepository.RemoveRecipeProduct(recipe.Id, product.Id, recipe.Group_Id);

            // Assert
            var removedRecipeProduct = await _context.Recipes_Products
                .FirstOrDefaultAsync(rp => rp.Product_Id == product.Id && rp.Recipe_Id == recipe.Id);
            Assert.Null(removedRecipeProduct); // Verifica que o produto foi removido
        }

        [Fact]
        public async Task RemoveRecipeProduct_RecipeGroupMismatch_ThrowsException()
        {
            // Arrange
            var product = new Product { Name = "ProdutoA", Type = "Frutas e Verduras", Unity = "Kilos", Group_Id = 1 };
            var recipe = new Recipe { Id = 1, Group_Id = 2, Name = "ReceitaA" }; 
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Associando o produto à receita
            var recipeProduct = new Recipe_Product { Product_Id = product.Id, Recipe_Id = recipe.Id, Product = product, Recipe = recipe };
            _context.Recipes_Products.Add(recipeProduct);
            await _context.SaveChangesAsync();

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _recipeRepository.RemoveRecipeProduct(recipe.Id, product.Id, 1));
            Assert.Equal("Esta receita não se encontra associada a este grupo.", exception.Message);
        }

        [Fact]
        public async Task RemoveRecipeProduct_ProductNotInRecipe_NoChange()
        {
            // Arrange
            var product = new Product { Name = "ProdutoA", Type = "Frutas e Verduras", Unity = "Kilos", Group_Id = 1 };
            var recipe = new Recipe { Id = 1, Group_Id = 1, Name = "ReceitaA" };
            _context.Products.Add(product);
            _context.Recipes.Add(recipe);

            await _context.SaveChangesAsync();

            var recipeProduct = new Recipe_Product
            {
                Product_Id = product.Id,
                Recipe_Id = recipe.Id
            };
            _context.Recipes_Products.Add(recipeProduct);

            await _context.SaveChangesAsync();

            // Act
            await _recipeRepository.RemoveRecipeProduct(recipe.Id, product.Id, 1);

            // Assert
            var association = await _context.Recipes_Products
                .FirstOrDefaultAsync(rp => rp.Product_Id == product.Id && rp.Recipe_Id == recipe.Id);

            // Espera que a associação seja removida
            Assert.Null(association);
        }
    }
}
