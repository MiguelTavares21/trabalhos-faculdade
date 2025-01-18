using StockerAPI.Models;
using StockerAPI.Models.Dto;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StockerAPI.Repository.Interfaces
{
    /// <summary>
    /// Interface que define o contrato para operações relacionadas aos produtos.
    /// Contém métodos para manipular, consultar e gerenciar produtos no sistema.
    /// </summary>
    public interface IProductRepository
    {
        /// <summary>
        /// Obtém um produto específico com base no seu identificador e no grupo ao qual pertence.
        /// </summary>
        /// <param name="id">Identificador único do produto.</param>
        /// <param name="groupId">Identificador único do grupo associado.</param>
        /// <returns>Um objeto <see cref="ProductDto"/> representando o produto.</returns>
        Task<ProductDto> GetProduct(int id,int groupId);

        /// <summary>
        /// Cria um novo produto no sistema.
        /// </summary>
        /// <param name="productDto">Dados do produto a ser criado.</param>
        /// <param name="groupId">Identificador único do grupo ao qual o produto será associado.</param>
        /// <returns>Um objeto <see cref="ProductDto"/> representando o produto criado.</returns>
        Task<ProductDto> CreateProduct(ProductCreateDto productDto, int groupId);

        /// <summary>
        /// Atualiza os dados de um produto existente.
        /// </summary>
        /// <param name="id">Identificador único do produto a ser atualizado.</param>
        /// <param name="groupId">Identificador único do grupo associado ao produto.</param>
        /// <param name="productDto">Dados atualizados do produto.</param>
        /// <returns>Retorna uma tarefa representando a operação assíncrona de edição do produto.</returns>
        Task UpdateProduct(int id, int groupId, ProductUpdateDto productDto);

        /// <summary>
        /// Remove um produto do sistema com base no seu identificador e no grupo associado.
        /// </summary>
        /// <param name="id">Identificador único do produto a ser removido.</param>
        /// <param name="groupId">Identificador único do grupo associado ao produto.</param>
        /// <returns>Retorna uma tarefa representando a operação assíncrona de eliminação do produto.</returns>
        Task DeleteProduct(int id, int groupId);

        /// <summary>
        /// Verifica se um produto pode ser excluído do sistema.
        /// </summary>
        /// <param name="productId">Identificador único do produto.</param>
        /// <returns>Retorna verdadeiro se o produto pode ser eliminado; caso contrário, falso.</returns>
        Task<bool> CanDeleteProduct(int productId);

        /// <summary>
        /// Consome uma quantidade específica de um produto.
        /// </summary>
        /// <param name="productId">Identificador único do produto.</param>
        /// <param name="groupId">Identificador único do grupo associado ao produto.</param>
        /// <param name="quantity">Quantidade a ser consumida.</param>
        /// <returns>Retorna verdadeiro se o consumo foi bem-sucedido; caso contrário, falso.</returns>
        Task<Product> ConsumeProduct(int productId, int groupId, float quantity);

        /// <summary>
        /// Obtém o inventário de produtos associados a um grupo.
        /// </summary>
        /// <param name="groupId">Identificador único do grupo.</param>
        /// <returns>Uma lista de objetos <see cref="ProductDto"/> representando os produtos no inventário.</returns>
        Task<List<ProductDto>> GetInventory(int groupId);

        /// <summary>
        /// Obtém todos os produtos associados a um grupo.
        /// </summary>
        /// <param name="groupId">Identificador único do grupo.</param>
        /// <returns>Uma lista de objetos <see cref="ProductDto"/> representando todos os produtos do grupo.</returns>
        Task<List<ProductDto>> GetAllProducts(int groupId);
    }
}
