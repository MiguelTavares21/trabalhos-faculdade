using StockerAPI.Models.Dto;

namespace StockerAPI.Repository.Interfaces
{
    public interface IPurchaseRepository
    {
        /// <summary>
        /// Regista uma compra no sistema
        /// </summary>
        /// <param name="productList">Lista de produtos a adicionar</param>
        /// <param name="groupId">ID do grupo a que pertence a compra</param>
        /// <returns>Vazio</returns>
        Task<PurchaseDto> RegisterPurchase(List<Purchased_ProductCreateDto> productList, int groupId);

        /// <summary>
        /// Retorna o histórico de compras de um grupo
        /// </summary>
        /// <param name="groupId">ID do grupo a que pertence o histórico</param>
        /// <returns>Retorna o histórico de compras</returns>
        Task<List<PurchaseDto>> GetAllPurchases(int groupId);

        /// <summary>
        /// Retorna a informação de uma compra específica
        /// </summary>
        /// <param name="purchaseId">ID da compra específica</param>
        /// <returns>Retorna os detalhes de uma compra</returns>
        Task<PurchaseDto> GetPurchase(int purchaseId);

        /// <summary>
        /// Retorna todos os produtos de uma compra
        /// </summary>
        /// <param name="purchaseId">ID da compra</param>
        /// <returns>Retorna todos os produtos de uma compra</returns>
        Task<List<Purchased_ProductDto>> GetPurchaseProducts(int purchaseId);

        /// <summary>
        /// Elimina uma compra do histórico
        /// </summary>
        /// <param name="purchaseId">ID da compra a ser eliminada</param>
        /// <returns>Vazio</returns>
        Task DeletePurchase(int purchaseId);

        /// <summary>
        /// Retorna a lista de compras de um grupo
        /// </summary>
        /// <param name="groupId">ID do grupo</param>
        /// <returns>Retorna a lista de compras</returns>
        Task<List<ProductInListDto>> GetShoppingList(int groupId);

        /// <summary>
        /// Adiciona ou remove um produto da lista de compras
        /// </summary>
        /// <param name="productId">ID do produto a ser adicionado/removido</param>
        /// <param name="groupId">ID do grupo a que pertence a lista</param>
        /// <returns>Vazio</returns>
        Task ToggleProductInShoppingList(int productId, int groupId);
    }
}
