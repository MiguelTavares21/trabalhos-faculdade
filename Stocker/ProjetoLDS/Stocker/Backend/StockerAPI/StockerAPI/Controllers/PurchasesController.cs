using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;

namespace StockerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchasesController : ControllerBase
    {
        private readonly IPurchaseRepository _purchaseService;
        private readonly IGroupRepository _groupService;

        public PurchasesController(IPurchaseRepository purchaseService, IGroupRepository groupService)
        {
            _purchaseService = purchaseService;
            _groupService = groupService;
        }

        /// <summary>
        /// Registra uma nova compra associada a um grupo.
        /// </summary>
        /// <param name="productList">Lista de produtos adquiridos na compra.</param>
        /// <param name="groupId">ID do grupo ao qual a compra será associada.</param>
        /// <returns>Retorna a compra registrada com sucesso.</returns>
        [HttpPost("{groupId:int}/register")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PurchaseDto>> RegisterPurchase([FromBody] List<Purchased_ProductCreateDto> productList, int groupId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var purchaseDto = await _purchaseService.RegisterPurchase(productList, groupId);

                return CreatedAtAction(nameof(RegisterPurchase), new { id = purchaseDto.Id }, purchaseDto);
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Retorna todas as compras associadas a um grupo.
        /// </summary>
        /// <param name="groupId">ID do grupo.</param>
        /// <returns>Lista de compras associadas ao grupo.</returns>
        [HttpGet("{groupId:int}/history")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<PurchaseDto>>> GetAllPurchases(int groupId)
        {
            try
            {
                var purchases = await _purchaseService.GetAllPurchases(groupId);
                return Ok(purchases);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Retorna os detalhes de uma compra específica.
        /// </summary>
        /// <param name="groupId">ID do grupo ao qual a compra pertence.</param>
        /// <param name="purchaseId">ID da compra.</param>
        /// <returns>Detalhes da compra.</returns>
        [HttpGet("{groupId:int}/{purchaseId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PurchaseDto>> GetPurchase(int purchaseId)
        {
            try
            {
                var purchase = await _purchaseService.GetPurchase(purchaseId);

                return Ok(purchase);
            }
            catch (ArgumentException a)
            {
                return NotFound(a.Message);
            }
            catch (UnauthorizedAccessException u)
            {
                return Forbid(u.Message);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Error", ex.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Retorna os produtos de uma compra específica.
        /// </summary>
        /// <param name="groupId">ID do grupo ao qual a compra pertence.</param>
        /// <param name="purchaseId">ID da compra.</param>
        /// <returns>Lista de produtos adquiridos na compra.</returns>
        [HttpGet("{groupId:int}/{purchaseId:int}/products")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<Purchased_ProductDto>>> GetPurchaseProducts(int purchaseId)
        {
            try
            {
                var purchasedProducts = await _purchaseService.GetPurchaseProducts(purchaseId);

                return Ok(purchasedProducts);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }


        /// <summary>
        /// Elimina uma compra do histórico
        /// </summary>
        /// <param name="purchaseId">ID da compra que deve ser eliminada</param>
        /// <returns>Vazio</returns>
        [HttpDelete("{groupId:int}/{purchaseId:int}")]
        [Authorize]
        [IsAdmin]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeletePurchase(int purchaseId)
        {
            try
            {
                await _purchaseService.DeletePurchase(purchaseId);

                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Retorna todos os produtos que de momento estao na lista de compras.
        /// </summary>
        /// <param name="groupId">ID do grupo a que pertence a lista</param>
        /// <returns>A lista de compras</returns>
        [HttpGet("{groupId:int}/shoppingList")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ProductInListDto>>> GetShoppingList(int groupId)
        {
            try
            {
                var shoppingList = await _purchaseService.GetShoppingList(groupId);

                return Ok(shoppingList);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Adiciona ou remove um produto da lista compras
        /// </summary>
        /// <param name="groupId">ID do grupo da lista de compras</param>
        /// <param name="productId">ID do produto a adicionar a lista de compras</param>
        /// <returns>Vazio</returns>
        [HttpPut("{groupId:int}/addToList/{productId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> ToggleProductInShoppingList(int groupId, int productId)
        {
            try
            {
                await _purchaseService.ToggleProductInShoppingList(productId, groupId);

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
