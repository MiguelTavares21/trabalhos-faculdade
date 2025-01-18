using StockerAPI.Models.Dto;
using System.Security.Claims;

namespace StockerAPI.Repository.Interfaces
{
    /// <summary>
    /// Interface para o repositório de estatísticas, fornecendo métodos para recuperar dados sobre gastos,
    /// consumo de produtos e estatísticas baseadas no tipo de produto dentro de um grupo de utilizadores.
    /// </summary>
    public interface IStatisticRepository
    {
        /// <summary>
        /// Obtém o total gasto por um grupo de utilizadores em um intervalo de tempo especificado.
        /// </summary>
        /// <param name="groupId">Id do grupo de utilizadores para o qual a estatística será recuperada.</param>
        /// <param name="startDate">Data inicial do intervalo para o qual a estatística será calculada.</param>
        /// <param name="endDate">Data final do intervalo para o qual a estatística será calculada.</param>
        /// <returns>Retorna um objeto <see cref="SpendingStatisticsDto"/> contendo o total gasto no intervalo especificado.</returns>
        Task<SpendingStatisticsDto> GetTotalSpent(int groupId, DateTime startDate, DateTime endDate);

        /// <summary>
        /// Obtém as estatísticas de um produto específico dentro de um grupo de utilizadores em um intervalo de tempo.
        /// </summary>
        /// <param name="productId">Id do produto para o qual as estatísticas serão recuperadas.</param>
        /// <param name="groupId">Id do grupo de utilizadores ao qual o produto pertence.</param>
        /// <param name="startDate">Data inicial do intervalo para o qual a estatística será calculada.</param>
        /// <param name="endDate">Data final do intervalo para o qual a estatística será calculada.</param>
        /// <returns>Retorna um objeto <see cref="ProductStatisticsDto"/> contendo as estatísticas do produto solicitado.</returns>
        Task<ProductStatisticsDto> GetProductStatistics(int productId, int groupId, DateTime startDate, DateTime endDate);

        /// <summary>
        /// Obtém as estatísticas de consumo por tipo de produto dentro de um grupo de utilizadores em um intervalo de tempo.
        /// </summary>
        /// <param name="productType">Tipo de produto para o qual as estatísticas de consumo serão calculadas.</param>
        /// <param name="groupId">Id do grupo de utilizadores ao qual o produto pertence.</param>
        /// <param name="startDate">Data inicial do intervalo para o qual a estatística será calculada.</param>
        /// <param name="endDate">Data final do intervalo para o qual a estatística será calculada.</param>
        /// <returns>Retorna um objeto <see cref="TypeStatisticsDto"/> contendo as estatísticas de consumo por tipo de produto.</returns>
        Task<TypeStatisticsDto> GetStatsByType(string productType, int groupId, DateTime startDate, DateTime endDate);

        /// <summary>
        /// Obtém o total de consumo de produtos dentro de um grupo de utilizadores em um intervalo de tempo.
        /// </summary>
        /// <param name="groupId">Id do grupo de utilizadores para o qual o total de consumo será calculado.</param>
        /// <param name="startDate">Data inicial do intervalo para o qual o consumo será calculado.</param>
        /// <param name="endDate">Data final do intervalo para o qual o consumo será calculado.</param>
        /// <returns>Retorna uma lista de objetos <see cref="ProductConsumptionDto"/> representando o consumo total de produtos no intervalo especificado.</returns>
        Task<List<ProductConsumptionDto>> GetTotalConsumption(int groupId, DateTime startDate, DateTime endDate);
    }
}
