using Microsoft.AspNetCore.Http;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

/// <summary>
/// Middleware responsável por verificar se um utilizador tem privilégios de administrador para acessar
/// um recurso protegido por um endpoint com o atributo <see cref="IsAdminAttribute"/>.
/// </summary>
public class AdminAuthorizationMiddleware
{
    private readonly RequestDelegate _next;

    public AdminAuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    /// <summary>
    /// Método que processa a requisição HTTP e verifica se o utilizador é um administrador.
    /// Caso o endpoint exija privilégios de administrador, o middleware valida se o utilizador está autenticado,
    /// se é um administrador e se possui permissão para acessar o recurso.
    /// </summary>
    /// <param name="context">Contexto HTTP que contém informações sobre a requisição.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        // Obter o IServiceProvider do contexto
        var groupService = context.RequestServices.GetService<IGroupRepository>();

        var endpoint = context.GetEndpoint();

        // Verifica se o endpoint possui o atributo `[IsAdmin]`
        var isAdminRequired = endpoint?.Metadata.GetMetadata<IsAdminAttribute>() != null;

        if (isAdminRequired)
        {
            var emailClaim = context.User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(emailClaim))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Utilizador não autenticado.");
                return;
            }

            var userId = await groupService.GetIdByEmail(emailClaim);

            if (userId == 0)
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                await context.Response.WriteAsync("Utilizador não encontrado.");
                return;
            }

            // Extrair o groupId da rota
            if (!context.Request.RouteValues.TryGetValue("groupId", out var groupIdValue) || !int.TryParse(groupIdValue?.ToString(), out var groupId))
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync("ID do grupo inválido ou não especificado.");
                return;
            }

            var isAdmin = await groupService.isAdmin(userId, groupId);

            if (!isAdmin)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Acesso negado: apenas administradores podem acessar este recurso.");
                return;
            }
        }

        await _next(context);
    }
}