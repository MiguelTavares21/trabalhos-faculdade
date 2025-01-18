using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using StockerAPI.Repository.Services;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StockerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productService;
        private readonly IGroupRepository _groupService;

        public ProductsController(IProductRepository productService, IGroupRepository groupService)
        {
            _productService = productService;
            _groupService = groupService;
        }


        /// <summary>
        /// Obtém um produto específico pelo ID e ID do grupo.
        /// </summary>
        /// <param name="id">ID do produto a ser obtido.</param>
        /// <param name="groupId">ID do grupo ao qual o produto pertence.</param>
        /// <returns>Retorna os detalhes do produto num objeto do tipo ProductDto.</returns>
        [HttpGet("{groupId:int}/{id:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductDto>> GetProduct(int id, int groupId)
        {
            try
            {
                var product = await _productService.GetProduct(id, groupId);
                return Ok(product);
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
        /// Cria um novo produto dentro do grupo especificado.
        /// </summary>
        /// <param name="productDto">Objeto que contém os dados do produto a ser criado.</param>
        /// <param name="groupId">ID do grupo ao qual o produto será associado.</param>
        /// <returns>Retorna o produto criado com os dados atualizados, incluindo o ID gerado.</returns>
        [HttpPost("create/{groupId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] ProductCreateDto productDto, int groupId) 
        {
            try
            {

                var product = await _productService.CreateProduct(productDto, groupId);

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id, groupId = groupId }, product);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Atualiza as informações de um produto existente num grupo específico.
        /// </summary>
        /// <param name="id">ID do produto a ser atualizado.</param>
        /// <param name="groupId">ID do grupo ao qual o produto pertence.</param>
        /// <param name="productDto">Objeto que contém os novos dados do produto.</param>
        /// <returns>Retorna o status da operação.</returns>
        [HttpPut("update/{groupId:int}/{id:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateProduct(int id, int groupId, [FromBody] ProductUpdateDto productDto)
        {
            try
            {
                await _productService.GetProduct(id, groupId);
               

                await _productService.UpdateProduct(id, groupId, productDto);
                return NoContent();
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
        /// Remove um produto específico de um grupo.
        /// </summary>
        /// <param name="id">ID do produto a ser removido.</param>
        /// <param name="groupId">ID do grupo ao qual o produto pertence.</param>
        /// <returns>Retorna o status da operação.</returns>
        [HttpDelete("delete/{groupId:int}/{id:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProduct(int id, int groupId)
        {
            try
            {
                await _productService.GetProduct(id, groupId);

                await _productService.DeleteProduct(id, groupId);
                return NoContent();
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
        /// Consome uma quantidade especificada de um produto dentro de um grupo.
        /// </summary>
        /// <param name="productId">ID do produto a ser consumido.</param>
        /// <param name="groupId">ID do grupo ao qual o produto pertence.</param>
        /// <param name="quantityToConsume">Quantidade do produto a ser consumida.</param>
        /// <returns>Retorna o status da operação.</returns>
        [HttpPost("{groupId:int}/{productId:int}/consume")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ConsumeProduct(int productId, int groupId, [FromQuery] float quantityToConsume)
        {
            try
            {
                // Verifica se o produto pertence ao grupo correto
                await _productService.GetProduct(productId, groupId);

                // Consome o produto e obtém o produto atualizado
                var updatedProduct = await _productService.ConsumeProduct(productId, groupId, quantityToConsume);

                // Verifica se o produto atualizado é nulo (caso necessário)
                if (updatedProduct == null)
                {
                    return BadRequest("Erro ao consumir o produto. Produto não encontrado ou operação inválida.");
                }

                // Retorna o produto atualizado como resposta
                return Ok(updatedProduct);
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
        /// Recupera todos os produtos atualmente no inventário de um grupo.
        /// </summary>
        /// <param name="groupId">ID do grupo ao qual os produtos pertencem.</param>
        /// <returns>Retorna o status da operação.</returns>
        [HttpGet("inventory/{groupId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ProductDto>>> GetInventory(int groupId)
        {
            try
            {
                var productsInInventory = await _productService.GetInventory(groupId);
                return Ok(productsInInventory);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Recupera todos os produtos associados a um grupo específico.
        /// </summary>
        /// <param name="groupId">ID do grupo ao qual os produtos pertencem.</param>
        /// <returns>Retorna o status da operação.</returns>
        [HttpGet("{groupId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ProductDto>>> GetAllProducts(int groupId)
        {
            try
            {
                var products = await _productService.GetAllProducts(groupId);
                return Ok(products);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState);
            }
        }
    }
}
