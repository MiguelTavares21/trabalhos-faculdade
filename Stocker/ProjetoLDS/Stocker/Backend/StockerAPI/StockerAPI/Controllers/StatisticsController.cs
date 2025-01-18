using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockerAPI.Repository.Interfaces;
using StockerAPI.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StockerAPI.Models.Dto;

namespace StockerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticRepository _statisticsService;

        public StatisticsController(IStatisticRepository statisticsService)
        {
            _statisticsService = statisticsService;
        }

        /// <summary>
        /// Este endpoint serve para obter estatisticas sobre o total gasto em um grupo dentro de um intervalo de tempo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="startDate">data de inicio</param>
        /// <param name="endDate">Data de fim</param>
        /// <returns>Estatisticas de gasto totais (gasto total, total de compras, média de dinheiro gasto)</returns>
        [HttpGet("total-spent/{groupId:int}")]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<SpendingStatisticsDto>> GetTotalSpent(int groupId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var totalSpent = await _statisticsService.GetTotalSpent(groupId, startDate, endDate);
                return Ok(totalSpent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Ocorreu um erro inesperado. Tente novamente mais tarde." });
            }
        }


        /// <summary>
        /// Este endpoint serve para obter estatísticas relacionadas a um determinado produto dentro de um intervalo de tempo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="productId">Id do produto</param>
        /// <param name="startDate">Data de inicio</param>
        /// <param name="endDate">Data de fim</param>
        /// <returns>Estatisticas relacionadas ao produto (gasto total nesse produto, total de quantidade comprada, total de compras 
        /// relacionadas a esse produto, média gasta para esse produto)</returns>
        [HttpGet("product-statistics/{groupId:int}/{productId:int}")]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductStatisticsDto>> GetProductStatistics(int groupId, int productId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var statistics = await _statisticsService.GetProductStatistics(productId, groupId, startDate, endDate);
                return Ok(statistics);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Este endpoint serve para obter estatísticas de um determinado tipo de produto dentro de um grupo e dentro de um intervalo de tempo.
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="productType">Tipo de produto</param>
        /// <param name="startDate">Data de início</param>
        /// <param name="endDate">Data de fim</param>
        /// <returns>Estatísticas por tipo de produto (gasto total nesse tipo, total de quantidade comprada, total de compras com o determinado
        /// tipo associado, média gasta nesse tipo de produto)</returns>
        [HttpGet("type-statistics/{groupId:int}/{productType}")]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<TypeStatisticsDto>> GetTypeStatistics(int groupId, string productType, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var statistics = await _statisticsService.GetStatsByType(productType, groupId, startDate, endDate);
                return Ok(statistics);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém dados de consumo total de produtos em um grupo dentro de um intervalo de tempo.
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="startDate">Data de início</param>
        /// <param name="endDate">Data de fim</param>
        /// <returns>É retornado um ProductConsumptionDto que contém informações como: o total consumido e a percentagem desse consumo consoante
        /// todos os outros produtos consumidos nesse intervalo de tempo</returns>
        [HttpGet("consumption-stats/{groupId:int}")]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ProductConsumptionDto>>> GetTotalConsumption(int groupId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var consumptionData = await _statisticsService.GetTotalConsumption(groupId, startDate, endDate);

                return Ok(consumptionData);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}
