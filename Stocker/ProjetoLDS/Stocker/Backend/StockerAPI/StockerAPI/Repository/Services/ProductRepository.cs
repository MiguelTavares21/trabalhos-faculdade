using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Drawing;
using System.Text.RegularExpressions;

namespace StockerAPI.Repository.Services
{
    /// <summary>
    /// Serviço de repositório responsável por gerenciar as operações relacionadas aos produtos.
    /// Implementa a interface <see cref="IProductRepository"/>.
    /// </summary>
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _db;

        /// <summary>
        /// Construtor que inicializa o repositório com o contexto da base de dados.
        /// </summary>
        /// <param name="db">Contexto da base de dados.</param>
        public ProductRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Obtém um produto pelo seu ID e grupo associado.
        /// </summary>
        /// <param name="id">ID do produto a ser buscado.</param>
        /// <param name="groupId">ID do grupo associado ao produto.</param>
        /// <returns>Um objeto <see cref="ProductDto"/> com os dados do produto.</returns>
        /// <exception cref="ArgumentException">Lançada quando o produto não é encontrado.</exception>
        /// <exception cref="Exception">Lançada quando o produto não está associado ao grupo fornecido.</exception>
        public async Task<ProductDto> GetProduct(int id, int groupId)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
            {
                throw new ArgumentException("Produto não encontrado.");
            }

            if (product.Group_Id != groupId)
            {
                throw new Exception("Este produto não se encontra associado a este grupo.");
            }


            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Quantity = product.Quantity,
                Unity = product.Unity,
                Order_Point = product.Order_Point,
                Ideal_Point = product.Ideal_Point,
                In_List = product.In_List,
                Type = product.Type,
                Group_Id = product.Group_Id
            };
        }

        /// <summary>
        /// Cria um novo produto e o associa a um grupo.
        /// </summary>
        /// <param name="productDto">Dados do produto a ser criado.</param>
        /// <param name="groupId">ID do grupo ao qual o produto será associado.</param>
        /// <returns>O produto criado no formato <see cref="ProductDto"/>.</returns>
        /// <exception cref="Exception">Lançada quando já existe um produto com o mesmo nome no grupo.</exception>
        public async Task<ProductDto> CreateProduct(ProductCreateDto productDto, int groupId)
        {
            var validate = await _db.Products.FirstOrDefaultAsync(p => p.Name == productDto.Name && p.Group_Id == groupId);

            if (validate != null)
            {
                throw new Exception("Ja existe um produto com o mesmo nome.");
            }

            var inList = false;

            if (productDto.Quantity < productDto.Order_Point)
            {
                inList = true;
            }


            var product = new Product
            {
                Name = productDto.Name,
                Quantity = productDto.Quantity,
                Unity = productDto.Unity,
                Order_Point = productDto.Order_Point,
                Ideal_Point = productDto.Ideal_Point,
                Type = productDto.Type,
                In_List = inList,
                Group_Id = groupId
            };

            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Quantity = product.Quantity,
                Unity = product.Unity,
                Order_Point = product.Order_Point,
                Ideal_Point = product.Ideal_Point,
                Type = product.Type,
                In_List = product.In_List,
                Group_Id = groupId
            };
        }

        /// <summary>
        /// Atualiza os dados de um produto existente.
        /// </summary>
        /// <param name="id">ID do produto a ser atualizado.</param>
        /// <param name="groupId">ID do grupo associado ao produto.</param>
        /// <param name="productDto">Dados atualizados do produto.</param>
        /// <returns>Task a representar a operação assíncrona.</returns>
        /// <exception cref="Exception">Lançada quando o produto não está associado ao grupo fornecido.</exception>
        public async Task UpdateProduct(int id, int groupId, ProductUpdateDto productDto)
        {
            var product = await _db.Products.FindAsync(id);

            if (product.Group_Id != groupId)
            {
                throw new Exception("Este produto não se encontra associado a este grupo.");
            }

            product.Name = productDto.Name;
            product.Quantity = productDto.Quantity;
            product.Order_Point = productDto.Order_Point;
            product.Ideal_Point = productDto.Ideal_Point;

            if (product.Quantity <= 0 || (product.Order_Point.HasValue && product.Quantity <= product.Order_Point))
            {
                product.In_List = true; 
            }
            else
            {
                product.In_List = false; 
            }

            _db.Products.Update(product);
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Remove um produto do banco de dados.
        /// </summary>
        /// <param name="id">ID do produto a ser removido.</param>
        /// <param name="groupId">ID do grupo associado ao produto.</param>
        /// <returns>Task a representar a operação assíncrona.</returns>
        /// <exception cref="Exception">Lançada quando o produto não está associado ao grupo 
        /// fornecido ou quando não pode ser eliminado (por exemplo, se está em uso em receitas).</exception>
        public async Task DeleteProduct(int id, int groupId)
        {
            var product = await _db.Products.FindAsync(id);

            if (product.Group_Id != groupId)
            {
                throw new Exception("Este produto não se encontra associado a este grupo.");
            }

            var canDelete = await CanDeleteProduct(id);
            if (!canDelete)
            {
                throw new Exception("Produto não pode ser removido. (Utilizado em receitas)");
            }

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Verifica se um produto pode ser eliminado (não está a ser usado em receitas).
        /// </summary>
        /// <param name="productId">ID do produto a ser verificado.</param>
        /// <returns>True se o produto pode ser eliminado, caso contrário False.</returns>
        public async Task<bool> CanDeleteProduct(int productId)
        {
            var product = await _db.Recipes_Products.FirstOrDefaultAsync(r => r.Product_Id == productId);

            return product == null;
        }

        /// <summary>
        /// Consome uma quantidade específica de um produto e atualiza o seu stock.
        /// </summary>
        /// <param name="productId">ID do produto a ser consumido.</param>
        /// <param name="groupId">ID do grupo associado ao produto.</param>
        /// <param name="quantity">Quantidade do produto a ser consumida.</param>
        /// <returns>True se o consumo foi bem-sucedido, caso contrário False.</returns>
        /// <exception cref="Exception">Lançada quando o produto não está associado ao grupo fornecido.</exception>
        public async Task<Product> ConsumeProduct(int productId, int groupId, float quantity)
        {
            var product = await _db.Products.FindAsync(productId);

            if (product == null)
            {
                throw new Exception("Produto não encontrado.");
            }

            if (product.Group_Id != groupId)
            {
                throw new Exception("Este produto não se encontra associado a este grupo.");
            }

            if (product.Quantity < quantity)
            {
                throw new Exception("Quantidade insuficiente no estoque.");
            }

            if (quantity > 0) { 

            product.Quantity -= quantity;


            if (product.Quantity <= 0 || product.Quantity <= product.Order_Point)
            {
                product.In_List = true;
            }
            else
            {
                product.In_List = false;
            }


                _db.Product_Use_Log.Add(new Product_Use_Log
                {
                    Group_Id = groupId,
                    Product_Id = productId,
                    Quantity = quantity,
                    Date = DateTime.Now
                });

                _db.Products.Update(product);
                await _db.SaveChangesAsync();
            }

            return product;
        }

        /// <summary>
        /// Obtém todos os produtos disponíveis em stock para um grupo específico.
        /// </summary>
        /// <param name="groupId">ID do grupo ao qual os produtos estão associados.</param>
        /// <returns>Uma lista de produtos disponíveis no formato <see cref="ProductDto"/>.</returns>
        /// <exception cref="Exception">Lançada quando não existem produtos no stock.</exception>
        public async Task<List<ProductDto>> GetInventory(int groupId)
        {
            var productsInInventory = await _db.Products
                .Where(p => p.Quantity > 0 && p.Group_Id == groupId)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Quantity = p.Quantity,
                    Unity = p.Unity,
                    Order_Point = p.Order_Point,
                    Ideal_Point = p.Ideal_Point,
                    In_List = p.In_List,
                    Type = p.Type,
                    Group_Id = p.Group_Id
                })
                .ToListAsync();

            return productsInInventory ?? new List<ProductDto>();
        }

        /// <summary>
        /// Obtém todos os produtos de um grupo específico.
        /// </summary>
        /// <param name="groupId">ID do grupo ao qual os produtos estão associados.</param>
        /// <returns>Uma lista de produtos no formato <see cref="ProductDto"/>.</returns>
        /// <exception cref="Exception">Lançada quando não existem produtos associados ao grupo.</exception>
        public async Task<List<ProductDto>> GetAllProducts(int groupId)
        {
            var products = await _db.Products
                .Where(p => p.Group_Id == groupId)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Quantity = p.Quantity,
                    Unity = p.Unity,
                    Order_Point = p.Order_Point,
                    Ideal_Point = p.Ideal_Point,
                    In_List = p.In_List,
                    Type = p.Type,
                    Group_Id = p.Group_Id
                })
                .ToListAsync();

            if (products == null || !products.Any())
            {
                throw new Exception("Não existe nenhum produto associado a este grupo.");
            }

            return products;
        }
    }
}
