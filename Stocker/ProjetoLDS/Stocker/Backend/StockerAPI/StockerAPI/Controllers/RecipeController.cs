using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Text.RegularExpressions;

namespace StockerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeRepository _recipeService;

        public RecipeController(IRecipeRepository recipeService)
        {
            _recipeService = recipeService;
        }


        /// <summary>
        /// Este endpoint permite obter todas as receitas num determinado grupo.
        /// </summary>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Lista com todas as receitas.</returns>
        [HttpGet("{groupId:int}/recipes")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<RecipeDto>>> GetAllRecipes(int groupId)
        {
            try
            {
                List<RecipeDto> recipes = await _recipeService.GetAllRecipes(groupId);
                return Ok(recipes);
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return NotFound(ModelState);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint permite obter uma determinada a receita num grupo.
        /// </summary>
        /// <param name="recipeId">Id da receita pretendida.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Receita encontrada.</returns>
        [HttpGet("{groupId:int}/recipes/{recipeId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RecipeDto>> GetRecipe(int recipeId, int groupId)
        {
            try
            {
                var recipe = await _recipeService.GetRecipe(recipeId, groupId);
                return Ok(recipe);
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return NotFound(ModelState);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint permite obter todos os produtos numa determinada receita.
        /// </summary>
        /// <param name="recipeId">Id da receita pretendida.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Lista do nome do produto e respetiva quantidade.</returns>
        [HttpGet("{groupId:int}/recipes/{recipeId:int}/products")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ProductRecipeDto>>> GetAllProducts(int recipeId, int groupId)
        {
            try
            {
                List<ProductRecipeDto> products = await _recipeService.GetAllProducts(recipeId, groupId);
                return Ok(products);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint permite criar uma receita.
        /// </summary>
        /// <param name="recipe">Informação da receita a criar.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Receita criada.</returns>
        [HttpPost("{groupId:int}/recipes")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateRecipe([FromBody]RecipeCreateDto recipe, int groupId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdRecipe = await _recipeService.CreateRecipe(recipe, groupId);
                return CreatedAtAction(nameof(GetRecipe), new { recipeId = createdRecipe.Id, groupId = groupId }, createdRecipe);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }


        /// <summary>
        /// Este endpoint permite associar um produto a uma receita.
        /// </summary>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <param name="recipeId">Id da receita associada.</param>
        /// <param name="product">Informação do produto a adicionar: nome e quantidade.</param>
        /// <returns>Vazio.</returns>
        [HttpPost("{groupId:int}/recipes/{recipeId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddProductToRecipe(int groupId, int recipeId, [FromBody]ProductAddToRecipeDto product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _recipeService.AddProductToRecipe(groupId, recipeId, product);
                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }


        /// <summary>
        /// Este endpoint permite o consumo de uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita a consumir.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Vazio.</returns>
        [HttpPut("{groupId:int}/recipes/{recipeId:int}/consume")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ConsumeRecipe(int recipeId, int groupId)
        {
            try
            {
                await _recipeService.ConsumeRecipe(recipeId, groupId);
                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }


        /// <summary>
        /// Este endpoint permite editar uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita a editar.</param>
        /// <param name="recipeName">Model com o novo nome da receita.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Receita editada.</returns>
        [HttpPut("{groupId:int}/recipes/{recipeId:int}/edit")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RecipeDto>> EditRecipe(int recipeId, [FromBody]RecipeCreateDto recipeName, int groupId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var recipe = await _recipeService.EditRecipe(recipeId, recipeName, groupId);
                return Ok(recipe);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }


        /// <summary>
        /// Este endpoint permite editar a quantidade de um produto numa determinada receita.
        /// </summary>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <param name="recipeId">Id da receita associada.</param>
        /// <param name="product">Info atualizada do produto com nova quantidade.</param>
        /// <returns>Vazio.</returns>
        [HttpPut("{groupId:int}/recipes/{recipeId:int}/editProduct")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditRecipeProduct(int groupId, int recipeId, [FromBody] ProductAddToRecipeDto product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _recipeService.EditRecipeProduct(groupId, recipeId, product);
                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint permite remover uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita a remover.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Vazio.</returns>
        [HttpDelete("{groupId:int}/recipes")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveRecipe(int recipeId, int groupId)
        {
            try
            {
                await _recipeService.RemoveRecipe(recipeId, groupId);
                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }


        /// <summary>
        /// Este endpoint permite remover um produto de uma receita.
        /// </summary>
        /// <param name="recipeId">Id da receita associada.</param>
        /// <param name="productId">Id do produto a remover.</param>
        /// <param name="groupId">Id do grupo associado.</param>
        /// <returns>Vazio.</returns>
        [HttpDelete("{groupId:int}/recipes/{recipeId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveRecipeProduct(int recipeId, int productId, int groupId)
        {
            try
            {
                await _recipeService.RemoveRecipeProduct(recipeId, productId, groupId);
                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }
    }
}
