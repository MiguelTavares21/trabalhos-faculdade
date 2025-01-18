using Microsoft.EntityFrameworkCore;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;

namespace StockerAPI.Repository.Services
{
    public class PurchaseRepository : IPurchaseRepository
    {

        private readonly ApplicationDbContext _db;

        public PurchaseRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<PurchaseDto> RegisterPurchase(List<Purchased_ProductCreateDto> productList, int groupId)
        {
            using var transaction = await _db.Database.BeginTransactionAsync();

            try
            {
                var purchase = new Purchase
                {
                    Group_Id = groupId,
                    Price = 0.0f
                };

                await _db.Purchases.AddAsync(purchase);
                await _db.SaveChangesAsync();

                var totalPrice = 0.0f;

                foreach (var product in productList)
                {
                    if (product.Quantity > 0.0f && product.Price >= 0.0f)
                    {
                        var productInTable = await _db.Products.FirstOrDefaultAsync(u => u.Id == product.Product_Id && u.Group_Id == groupId);

                        if (productInTable == null)
                        {
                            throw new ArgumentException("Não pode adicionar produtos que não são referentes ao seu grupo.");
                        }

                        totalPrice += product.Price;

                        var purchaseProduct = new Purchased_Product
                        {
                            Price = product.Price,
                            Product_Id = product.Product_Id,
                            Purchase_Id = purchase.Id,
                            Quantity = product.Quantity,
                            Unity = product.Unity
                        };

                        productInTable.Quantity += product.Quantity;

                        if (productInTable.Quantity > productInTable.Order_Point && productInTable.In_List == true)
                        {
                            productInTable.In_List = false;
                        }

                        await _db.Purchased_Products.AddAsync(purchaseProduct);
                    }
                }

                purchase.Price = totalPrice;

                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                return new PurchaseDto
                {
                    Date = purchase.Date,
                    Group_Id = groupId,
                    Id = purchase.Id,
                    Price = purchase.Price
                };
            }
            catch (ArgumentException e)
            {
                await transaction.RollbackAsync();
                throw new ArgumentException(e.Message);
            }
        }

        public async Task<List<PurchaseDto>> GetAllPurchases(int groupId)
        {
            var purchases = await _db.Purchases
                .Where(p => p.Group_Id == groupId)
                .ToListAsync();

            if (purchases.Count == 0)
            {
                return new List<PurchaseDto>();
            }

            var purchaseDtos = purchases.Select(p => new PurchaseDto
            {
                Id = p.Id,
                Group_Id = p.Group_Id,
                Date = p.Date,
                Price = p.Price
            }).ToList();

            return purchaseDtos;
        }

        private async Task<Purchase> getPurchase(int purchaseId)
        {
            var purchase = await _db.Purchases.FindAsync(purchaseId);

            if (purchase == null)
            {
                throw new ArgumentException("Compra não foi encontrada.");
            }

            return purchase;
        }

        public async Task<PurchaseDto> GetPurchase(int purchaseId)
        {
            var purchase = await getPurchase(purchaseId);

            return new PurchaseDto
            {
                Date = purchase.Date,
                Price = purchase.Price,
                Group_Id = purchase.Group_Id,
                Id = purchase.Id
            };
        }

        public async Task<List<Purchased_ProductDto>> GetPurchaseProducts(int purchaseId)
        {
            var purchase = await getPurchase(purchaseId);

            var purchasedProducts = await _db.Purchased_Products.Where(p => p.Purchase_Id == purchase.Id).Include(p => p.Product).ToListAsync();

            if (purchasedProducts.Count == 0)
            {
                return new List<Purchased_ProductDto>();
            }

            var purchaseProductsDtos = purchasedProducts.Select(p => new Purchased_ProductDto
            {
                Product_Id = p.Product_Id,
                Name = p.Product.Name,
                Price = p.Price,
                Quantity = p.Quantity,
                Unity = p.Unity
            }).ToList();

            return purchaseProductsDtos;
        }

        public async Task DeletePurchase(int purchaseId)
        {
            var purchase = await getPurchase(purchaseId);

            _db.Purchases.Remove(purchase);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ProductInListDto>> GetShoppingList(int groupId)
        {
            var shoppingList = await _db.Products.Where(p => p.In_List == true && p.Group_Id == groupId).ToListAsync();

            if (shoppingList.Count == 0)
            {
                return new List<ProductInListDto>();
            }

            var shoppingListDtos = shoppingList.Select(p =>
            {
                var quantityInShoppingList = (p.Ideal_Point ?? 0) - p.Quantity;

                if (quantityInShoppingList < 0)
                {
                    throw new InvalidOperationException($"A quantidade do produto '{p.Name}' não pode ser negativa.");
                }

                return new ProductInListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Quantity = quantityInShoppingList,
                    Unity = p.Unity
                };
            }).ToList();

            return shoppingListDtos;
        }

        public async Task ToggleProductInShoppingList(int productId, int groupId)
        {
            var product = await _db.Products.FindAsync(productId);

            if (product == null)
            {
                throw new ArgumentException("Produto não existe.");
            }

            if (product.Group_Id != groupId)
            {
                throw new ArgumentException("Produto não pertence ao grupo.");
            }

            if (product.Quantity >= product.Ideal_Point)
            {
                throw new ArgumentException("Produto já está na quantidade desejada, altere o ponto ideal.");
            }

            if (product.Ideal_Point == null)
            {
                throw new ArgumentException("Produto não tem ponto ideal definido.");
            }

            product.In_List = !product.In_List;

            await _db.SaveChangesAsync();
        }
    }
}
