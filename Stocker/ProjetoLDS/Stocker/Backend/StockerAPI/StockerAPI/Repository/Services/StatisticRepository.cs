using StockerAPI.Repository.Interfaces;
using StockerAPI.Models.Dto;
using StockerAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace StockerAPI.Services
{
    /// <summary>
    /// Repositório responsável pela recolha de estatísticas de compras, produtos e consumo.
    /// </summary>
    public class StatisticRepository : IStatisticRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IPurchaseRepository _purchaseRepository;

        /// <summary>
        /// Construtor da classe StatisticRepository.
        /// </summary>
        /// <param name="db">Contexto de dados da base de dados.</param>
        /// <param name="purchaseRepository">Repositório de compras.</param>
        public StatisticRepository(ApplicationDbContext db, IPurchaseRepository purchaseRepository)
        {
            _db = db;
            _purchaseRepository = purchaseRepository;
        }

        /// <summary>
        /// Obtém as estatísticas de gasto total, número total de compras e o gasto médio por compra para um grupo dentro de um intervalo de tempo.
        /// </summary>
        /// <param name="groupId">Id do grupo.</param>
        /// <param name="startDate">Data de início.</param>
        /// <param name="endDate">Data de fim.</param>
        /// <returns>Um objeto <see cref="SpendingStatisticsDto"/> com as estatísticas de gasto.</returns>
        /// <exception cref="ArgumentException">Lançado se as datas estiverem fora de ordem ou se não houver compras no intervalo de tempo.</exception>
        public async Task<SpendingStatisticsDto> GetTotalSpent(int groupId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                throw new ArgumentException("A data inicial não pode ser posterior à data final.");
            }

            var purchases = await _purchaseRepository.GetAllPurchases(groupId);

            if (purchases == null || !purchases.Any())
            {
                throw new ArgumentException("Não existem compras registadas para o grupo especificado.");
            }

            var filteredPurchases = purchases
                .Where(p => p.Date >= startDate && p.Date <= endDate)
                .ToList();

            var totalSpent = filteredPurchases.Sum(p => p.Price);
            var totalPurchases = filteredPurchases.Count;

            if (totalPurchases == 0)
            {
                throw new ArgumentException("Nenhuma compra foi registada no intervalo de datas especificado.");
            }

            var averageSpent = totalSpent / totalPurchases;

            return new SpendingStatisticsDto
            {
                TotalSpent = totalSpent,
                TotalPurchases = totalPurchases,
                AverageSpent = averageSpent
            };
        }


        /// <summary>
        /// Obtém as estatísticas de um produto específico dentro de um intervalo de tempo para um grupo.
        /// </summary>
        /// <param name="productId">Id do produto.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <param name="startDate">Data de início.</param>
        /// <param name="endDate">Data de fim.</param>
        /// <returns>Um objeto <see cref="ProductStatisticsDto"/> com as estatísticas do produto.</returns>
        /// <exception cref="ArgumentException">Lançado se as datas estiverem fora de ordem ou se não houver compras para o produto no intervalo de datas.</exception>
        public async Task<ProductStatisticsDto> GetProductStatistics(int productId, int groupId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                throw new ArgumentException("A data inicial não pode ser posterior à data final.");
            }

            var purchases = await _purchaseRepository.GetAllPurchases(groupId);

            // Obter todas as entradas da tabela intermediária para o produto específico
            var purchasedProducts = await _db.Purchased_Products
                .Where(pp => pp.Product_Id == productId)
                .Include(pp => pp.Purchase) // Inclui a compra associada
                .ToListAsync();

            // Filtrar as compras que estão dentro do intervalo de datas
            var filteredPurchases = purchasedProducts
                .Where(pp => purchases.Any(p => p.Id == pp.Purchase_Id && p.Date >= startDate && p.Date <= endDate))
                .ToList();

            if (!filteredPurchases.Any())
            {
                throw new ArgumentException("Não existem compras registadas para o produto no intervalo de datas especificado.");
            }

            var totalSpent = filteredPurchases.Sum(pp => pp.Price);
            var totalQuantity = filteredPurchases.Sum(pp => pp.Quantity);
            var totalPurchases = filteredPurchases.Count;

            if (totalPurchases == 0)
            {
                throw new ArgumentException("Nenhuma compra foi registada para o produto no intervalo de datas especificado.");
            }

            var averageSpent = totalSpent / totalQuantity;

            return new ProductStatisticsDto
            {
                ProductId = productId,
                TotalSpent = totalSpent,
                TotalQuantity = totalQuantity,
                TotalPurchases = totalPurchases,
                AverageSpentByProduct = averageSpent
            };
        }


        /// <summary>
        /// Obtém as estatísticas para um tipo específico de produto dentro de um intervalo de tempo para um grupo.
        /// </summary>
        /// <param name="productType">Tipo de produto.</param>
        /// <param name="groupId">Id do grupo.</param>
        /// <param name="startDate">Data de início.</param>
        /// <param name="endDate">Data de fim.</param>
        /// <returns>Um objeto <see cref="TypeStatisticsDto"/> com as estatísticas do tipo de produto.</returns>
        /// <exception cref="ArgumentException">Lançado se as datas estiverem fora de ordem ou se não houver compras para o tipo de produto.</exception>
        public async Task<TypeStatisticsDto> GetStatsByType(string productType, int groupId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                throw new ArgumentException("A data inicial não pode ser posterior à data final.");
            }

            var purchases = await _purchaseRepository.GetAllPurchases(groupId);

            // Obter todos os produtos do tipo específico
            var products = await _db.Products
                .Where(p => p.Type.ToString() == productType)
                .ToListAsync();

            if (!products.Any())
            {
                throw new ArgumentException($"Não existem produtos deste tipo: '{productType}'");
            }

            // Obter todas as entradas da tabela intermediária para os produtos do tipo
            var purchasedProducts = await _db.Purchased_Products
            .Where(pp => products.Select(p => p.Id).Contains(pp.Product_Id))
            .Include(pp => pp.Purchase)
            .ToListAsync();

            // Filtrar as compras que estão dentro do intervalo de datas
            var filteredPurchases = purchasedProducts
                .Where(pp => purchases.Any(p => p.Id == pp.Purchase_Id && p.Date >= startDate && p.Date <= endDate))
                .ToList();

            if (!filteredPurchases.Any())
            {
                throw new ArgumentException("Não existem compras registadas para o tipo de produto no intervalo de datas especificado.");
            }

            var totalSpent = filteredPurchases.Sum(pp => pp.Price);
            var totalQuantity = filteredPurchases.Sum(pp => pp.Quantity);
            var totalPurchases = filteredPurchases.Count;

            if (totalPurchases == 0)
            {
                throw new ArgumentException("Nenhuma compra foi registada para o tipo de produto no intervalo de datas especificado.");
            }

            var averageSpent = totalSpent / totalPurchases;

            return new TypeStatisticsDto
            {
                ProductType = productType,
                TotalSpent = totalSpent,
                TotalQuantity = totalQuantity,
                TotalPurchases = totalPurchases,
                AverageSpent = averageSpent
            };
        }

        /// <summary>
        /// Obtém os dados de consumo total de produtos para um grupo dentro de um intervalo de datas.
        /// </summary>
        /// <param name="groupId">Id do grupo.</param>
        /// <param name="startDate">Data de início.</param>
        /// <param name="endDate">Data de tfim.</param>
        /// <returns>Uma lista de <see cref="ProductConsumptionDto"/> com o consumo total e a porcentagem de consumo.</returns>
        /// <exception cref="ArgumentException">Lançado se não houver consumo registado dentro do intervalo de tempo.</exception>
        public async Task<List<ProductConsumptionDto>> GetTotalConsumption(int groupId, DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                throw new ArgumentException("A data inicial não pode ser posterior à data final.");
            }

            var totalConsumption = await _db.Product_Use_Log
                .Where(log => log.Date >= startDate && log.Date <= endDate && log.Group_Id == groupId)
                .SumAsync(log => log.Product.Unity.ToLower() == "gramas" ? log.Quantity / 1000f : log.Quantity);

            var consumptionData = await _db.Product_Use_Log
                .Where(log => log.Date >= startDate && log.Date <= endDate && log.Group_Id == groupId)
                .GroupBy(log => new { log.Product_Id, log.Product.Name, log.Product.Unity })
                .Select(group => new ProductConsumptionDto
                {
                    ProductId = group.Key.Product_Id,
                    ProductName = group.Key.Name,
                    TotalConsumed = group.Key.Unity.ToLower() == "gramas"
                                    ? group.Sum(log => log.Quantity) / 1000f
                                    : group.Sum(log => log.Quantity),
                    ConsumptionPercentage = (totalConsumption > 0)
                        ? ((group.Key.Unity.ToLower() == "gramas"
                            ? group.Sum(log => log.Quantity) / 1000f
                            : group.Sum(log => log.Quantity)) / totalConsumption) * 100
                        : 0
                })
                .ToListAsync();

            if (!consumptionData.Any())
            {
                throw new ArgumentException("Nenhum consumo registado para o intervalo de datas especificado.");
            }

            return consumptionData;
        }

    }
}
