using Microsoft.AspNetCore.Mvc;
using StockerAPI.Models;
using StockerAPI.Models.Dto;

namespace StockerAPI.Repository.Interfaces
{
    public interface IRecipeRepository
    {
        /// <summary>
        /// Cria a receita num grupo.
        /// </summary>
        /// <param name="recipe">Model com a info para criar uma receita.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Created recipe.</returns>
        Task<RecipeDto> CreateRecipe(RecipeCreateDto recipe, int groupId);

        /// <summary>
        /// Adicionar um produto a uma receita.
        /// </summary>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <param name="recipeId">Id da receita associada.</param>
        /// <param name="product">Info do produtoque queremos adicionar: quantidade e nome.</param>
        /// <returns>Vazio.</returns>
        Task AddProductToRecipe(int groupId, int recipeId, ProductAddToRecipeDto product);

        /// <summary>
        /// Editar uma receita (nome).
        /// </summary>
        /// <param name="recipeId">Id da receita a editar.</param>
        /// <param name="recipeName">Model com o novo nome da receita.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Receita editada.</returns>
        Task<RecipeDto> EditRecipe(int recipeId, RecipeCreateDto recipeName, int groupId);

        /// <summary>
        /// Remover uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita a remover.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Vazio.</returns>
        Task RemoveRecipe(int recipeId, int groupId);

        /// <summary>
        /// Consumir uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita a consumir.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Vazio.</returns>
        Task ConsumeRecipe(int recipeId, int groupId);

        /// <summary>
        /// Buscar uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita a encontrar.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Retorna a receita procurada.</returns>
        Task<RecipeDto> GetRecipe(int recipeId, int groupId);

        /// <summary>
        /// Buscar todas as receitas num grupo.
        /// </summary>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Lista com as receitas de um grupo.</returns>
        Task<List<RecipeDto>> GetAllRecipes(int groupId);

        /// <summary>
        /// Editar a quantidade de um produto numa receita.
        /// </summary>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <param name="recipeId">Id da receita onde o produto se encontra</param>
        /// <param name="product">Model com a info do produto: quantiaded e nome.</param>
        /// <returns>Vazio.</returns>
        Task EditRecipeProduct(int groupId, int recipeId, ProductAddToRecipeDto product);

        /// <summary>
        /// Remover produto de uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita associada.</param>
        /// <param name="productid">Id do produto a remover.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Vazio.</returns>
        Task RemoveRecipeProduct(int recipeId, int productid, int groupId);

        /// <summary>
        /// Buscar todos os produtos numa receita.
        /// </summary>
        /// <param name="recipeId">Id da receita associada.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Lista com todos os produtos numa receita.</returns>
        Task<List<ProductRecipeDto>> GetAllProducts(int recipeId, int groupId);
    }
}
