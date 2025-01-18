using Microsoft.EntityFrameworkCore;

namespace StockerAPI.Data
{
    /// <summary>
    /// Classe de extensão para aplicar migrações automaticamente ao iniciar a aplicação.
    /// </summary>
    public static class MigrationExtensions
    {
        /// <summary>
        /// Método de extensão que aplica as migrações pendentes à base de dados.
        /// Este método utiliza um escopo de serviço para obter o contexto da base de dados 
        /// e invocar o método de migração automática.
        /// </summary>
        /// <param name="app">O <see cref="IApplicationBuilder"/> da aplicação.</param>
        public static void AplyMigrations(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();

            using ApplicationDbContext dbContext =
                scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            dbContext.Database.Migrate();
        }
    }
}
