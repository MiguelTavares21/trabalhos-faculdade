using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Text.RegularExpressions;

namespace StockerAPI.Repository.Services
{
    public class RecipeRepository : IRecipeRepository
    {

        private readonly ApplicationDbContext _db;

        public RecipeRepository(ApplicationDbContext db) {       
            _db = db;
        }

        public async Task AddProductToRecipe(int groupId, int recipeId, ProductAddToRecipeDto product)
        {
            Recipe targetRecipe = await _db.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId && r.Group_Id == groupId);

            if (targetRecipe == null)
            {
                throw new Exception("Ocorreu um erro ao adicionar o produto à receita. (Receita não encontrada)");
            }

            Product productToAdd = await _db.Products.FirstOrDefaultAsync(p => p.Name == product.Name && p.Group_Id == groupId);

            if (productToAdd == null)
            {
                throw new Exception("Ocorreu um erro ao adicionar o produto à receita. (Produto não encontrado)");
            }

            if (await _db.Recipes_Products.FirstOrDefaultAsync(p => p.Product_Id == productToAdd.Id && p.Recipe_Id == recipeId) != null)
            {
                throw new Exception("O produto já se encontra presente nesta receita.");
            }

            Recipe_Product model = new()
            {
                Product = productToAdd,
                Quantity = product.Quantity,
                Product_Id = productToAdd.Id,
                Recipe_Id = recipeId,
                Recipe = targetRecipe
            };

            await _db.Recipes_Products.AddAsync(model);
            await _db.SaveChangesAsync();
        }

        public async Task<RecipeDto> CreateRecipe(RecipeCreateDto recipe, int groupId)
        {
            if (recipe == null)
            {
                throw new Exception("Erro ao receber a informação da receita.");
            }

            if (await _db.Recipes.FirstOrDefaultAsync(r => r.Name == recipe.Name.ToLower() && r.Group_Id == groupId) != null)
            {
                throw new Exception("Já se encontra registada uma receita com este nome.");
            }

            var group = await _db.Groups.FindAsync(groupId);

            if(group == null)
            {
                throw new Exception("Erro ao associar receita ao grupo.");
            }


            Recipe model = new()
            {
                Name = recipe.Name,
                Group = group,
                Group_Id = groupId
            };

            await _db.Recipes.AddAsync(model);
            await _db.SaveChangesAsync();

            return new RecipeDto
            {
                Id = model.Id,
                Name = model.Name
            };
        }

        public async Task<List<ProductRecipeDto>> GetAllProducts(int recipeId, int groupId)
        {
            List<Recipe_Product> recipeProducts = await _db.Recipes_Products.Include(p => p.Product).Where(p => p.Recipe_Id == recipeId).ToListAsync();
            if (recipeProducts == null || !recipeProducts.Any())
            {
                throw new Exception("A receita não tem nenhum produto associado.");
            }
            if ((await _db.Recipes.FindAsync(recipeId)).Group_Id != groupId)
            {
                throw new Exception("Esta receita não se encontra associada a este grupo.");
            }

            var products = recipeProducts.Select(ug => new ProductRecipeDto
            {
                ProductId = ug.Product_Id,
                Name = ug.Product.Name,
                Quantity = ug.Quantity,
                RecipeId = ug.Recipe_Id,
                Unity = ug.Product.Unity
            }).ToList();

            return products;
        }

        public async Task<List<RecipeDto>> GetAllRecipes(int groupId)
        {
            var recipes = await _db.Recipes
            .Where(r => r.Group_Id  == groupId)
            .Include(r => r.Group)
            .ToListAsync();

            if (recipes == null || !recipes.Any())
            {
                throw new ArgumentException("Nenhuma receita está associada a este grupo.");
            }

            var recipeDtos = recipes.Select(ug => new RecipeDto
            {
                Id = ug.Id,
                Name = ug.Name
            }).ToList();

            return recipeDtos;
        }

        public async Task<RecipeDto> GetRecipe(int recipeId, int groupId)
        {
            var recipe = await _db.Recipes.FindAsync(recipeId);

            if (recipe == null)
            {
                throw new ArgumentException("Receita não encontrada.");
            }

            if (recipe.Group_Id != groupId)
            {
                throw new Exception("Esta receita não se encontra associada a este grupo.");
            }

            return new RecipeDto
            {
                Id = recipe.Id,
                Name = recipe.Name
            }; ;
        }

        public async Task RemoveRecipe(int recipeId, int groupId)
        {
            var recipe = await _db.Recipes.FindAsync(recipeId);

            if (recipe == null)
            {
                throw new Exception("Receita não encontrada.");
            }
            if (recipe.Group_Id != groupId)
            {
                throw new Exception("Esta receita não se encontra associada a este grupo.");
            }

            _db.Recipes.Remove(recipe);
            await _db.SaveChangesAsync();
        }

        public async Task ConsumeRecipe(int recipeId, int groupId)
        {
            var recipe = await _db.Recipes.FindAsync(recipeId);

            if (recipe == null)
            {
                throw new Exception("Receita não encontrada.");
            }

            if (recipe.Group_Id != groupId)
            {
                throw new Exception("Esta receita não se encontra associada a este grupo.");
            }

            List<Recipe_Product> recipeProducts = _db.Recipes_Products.Where(rp => rp.Recipe_Id == recipeId).ToList();
            if (!recipeProducts.Any() || recipeProducts == null)
            {
                throw new Exception("Esta receita não tem produtos associados.");
            }
            foreach (Recipe_Product recipeProduct in recipeProducts)
            {
                Product productToConsume = await _db.Products.FindAsync(recipeProduct.Product_Id);
                if (productToConsume == null)
                {
                    throw new Exception($"{productToConsume.Name} não se encontra presente no inventário.");
                }
                if (recipeProduct.Quantity > productToConsume.Quantity)
                {
                    throw new Exception($"Não tem {productToConsume.Name} suficiente no inventário.");
                }
                productToConsume.Quantity = productToConsume.Quantity - recipeProduct.Quantity;
                await _db.Product_Use_Log.AddAsync(new Product_Use_Log
                {
                    Product_Id = productToConsume.Id,
                    Product = productToConsume,
                    Group_Id = groupId,
                    Group = await _db.Groups.FindAsync(groupId),
                    Quantity = recipeProduct.Quantity,
                    Date = DateTime.Now
                });
            }
            await _db.SaveChangesAsync();
        }

        public async Task<RecipeDto> EditRecipe(int recipeId, RecipeCreateDto recipeName, int groupId)
        {
            var targetRecipe = await _db.Recipes.AsNoTracking().FirstOrDefaultAsync(r => r.Id == recipeId);

            if (targetRecipe == null)
            {
                throw new Exception("Receita não encontrada.");
            }

            if (targetRecipe.Group_Id != groupId)
            {
                throw new Exception("Esta receita não se encontra associada a este grupo.");
            }

            Recipe model = new()
            {
                Group = targetRecipe.Group,
                Name = recipeName.Name,
                Group_Id = targetRecipe.Group_Id,
                Id = targetRecipe.Id
            };
            _db.Recipes.Update(model);
            await _db.SaveChangesAsync();

            RecipeDto recipeDto = new()
            {
                Name = model.Name,
                Id = model.Id
            };

            return recipeDto;
        }

        public async Task EditRecipeProduct(int groupId, int recipeId, ProductAddToRecipeDto product)
        {

            Recipe targetRecipe = await _db.Recipes.AsNoTracking().FirstOrDefaultAsync(r => r.Id == recipeId && r.Group_Id == groupId);

            if (targetRecipe == null)
            {
                throw new Exception("Ocorreu um erro ao editar o produto. (Receita não encontrada)");
            }

            Product productToEdit = await _db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Name == product.Name && p.Group_Id == groupId);

            if (productToEdit == null)
            {
                throw new Exception("Ocorreu um erro ao editar o produto. (Produto não encontrado)");
            }

            if (await _db.Recipes_Products.AsNoTracking().FirstOrDefaultAsync(p => p.Product_Id == productToEdit.Id && p.Recipe_Id == recipeId) == null)
            {
                throw new Exception("O produto não se encontra associado a esta receita");
            }

            Recipe_Product model = new()
            {
                Product = productToEdit,
                Quantity = product.Quantity,
                Product_Id = productToEdit.Id,
                Recipe_Id = recipeId,
                Recipe = targetRecipe
            };

            _db.Recipes_Products.Update(model);
            await _db.SaveChangesAsync();
        }

        public async Task RemoveRecipeProduct(int recipeId, int productId, int groupId)
        {
            if ((await _db.Recipes.FindAsync(recipeId)).Group_Id != groupId)
            {
                throw new Exception("Esta receita não se encontra associada a este grupo.");
            }

            Recipe_Product recipeProduct = await _db.Recipes_Products.FirstOrDefaultAsync(p => p.Product_Id == productId && p.Recipe_Id == recipeId);

            if (recipeProduct == null)
            {
                throw new Exception("O produto não se encontra presente nesta receita.");
            }

            _db.Recipes_Products.Remove(recipeProduct);
            await _db.SaveChangesAsync();
        }
    }
}
