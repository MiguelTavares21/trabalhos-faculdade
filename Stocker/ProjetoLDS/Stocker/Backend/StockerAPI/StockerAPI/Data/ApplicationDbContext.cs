using StockerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace StockerAPI.Data
{
    /// <summary>
    /// Representa o contexto principal da base de dados para a aplicação.
    /// Gerencia os conjuntos de entidades e a configuração de mapeamento.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Inicializa uma nova instância de <see cref="ApplicationDbContext"/> com as opções fornecidas.
        /// </summary>
        /// <param name="options">Opções de configuração do contexto.</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        /// <summary>
        /// Tabela de utilizadores.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Tabela de grupos.
        /// </summary>
        public DbSet<Group> Groups { get; set; }

        /// <summary>
        /// Tabela intermédia entre utilizadores e grupos.
        /// </summary>
        public DbSet<User_Group> Users_Groups { get; set; }

        /// <summary>
        /// Tabela de receitas.
        /// </summary>
        public DbSet<Recipe> Recipes { get; set; }

        /// <summary>
        /// Tabela de produtos.
        /// </summary>
        public DbSet<Product> Products { get; set; }

        /// <summary>
        /// Tabela intermédia entre receitas e produtos.
        /// </summary>
        public DbSet<Recipe_Product> Recipes_Products { get; set; }

        /// <summary>
        /// Tabela de compras.
        /// </summary>
        public DbSet<Purchase> Purchases { get; set; }

        /// <summary>
        /// Tabela de produtos adquiridos em compras.
        /// </summary>
        public DbSet<Purchased_Product> Purchased_Products { get; set; }

        /// <summary>
        /// Tabela de logs de uso de produtos.
        /// </summary>
        public DbSet<Product_Use_Log> Product_Use_Log { get; set; } 


        /// <summary>
        /// Configurações adicionais de mapeamento para as entidades.
        /// Utiliza classes de configuração específicas para aplicar regras de mapeamento detalhadas.
        /// </summary>
        /// <param name="modelBuilder">Construtor do modelo do Entity Framework.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users

            modelBuilder.ApplyConfiguration(new UserConfiguration());

            // Groups

            modelBuilder.ApplyConfiguration(new GroupConfiguration());

            // Users_Groups

            modelBuilder.ApplyConfiguration(new User_GroupConfiguration());

            // Recipes

            modelBuilder.ApplyConfiguration(new RecipeConfiguration());
                

            // Products

            modelBuilder.ApplyConfiguration(new ProductConfiguration());

            // Recipes_Products

            modelBuilder.ApplyConfiguration(new Recipe_ProductConfiguration());

            // Purchases

            modelBuilder.ApplyConfiguration(new PurchaseConfiguration());

            // Purchased_Products

            modelBuilder.ApplyConfiguration(new Purchase_ProductConfiguration());

            // Product_Use_Logs

            modelBuilder.ApplyConfiguration(new Product_Use_LogsConfiguration());
        }
    }
}
