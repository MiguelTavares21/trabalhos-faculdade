using Microsoft.AspNetCore.Http;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

/// <summary>
/// Middleware responsável por verificar se um utilizador é membro de um grupo específico.
/// Ele intercepta as requisições e valida se o utilizador está autenticado e se pertence ao grupo
/// conforme definido pelo atributo <see cref="IsMemberAttribute"/>.
/// </summary>
public class GroupMembershipMiddleware
{
    private readonly RequestDelegate _next;

    public GroupMembershipMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    /// <summary>
    /// Método que processa a requisição HTTP.
    /// Verifica se o utilizador está autenticado e se é membro do grupo relacionado ao endpoint.
    /// Caso contrário, retorna um erro apropriado.
    /// </summary>
    /// <param name="context">Contexto HTTP que contém informações sobre a requisição.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        var groupService = context.RequestServices.GetService<IGroupRepository>();

        var endpoint = context.GetEndpoint();

        // Verifica se o endpoint possui o atributo `[IsMember]`
        var isMemberRequired = endpoint?.Metadata.GetMetadata<IsMemberAttribute>() != null;

        if (isMemberRequired)
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

            // Verificar se o usuário pertence ao grupo
            var isMember = await groupService.UserIsInGroup(userId, groupId);

            if (!isMember)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Acesso negado: o utilizador não pertence ao grupo.");
                return;
            }
        }

        await _next(context);
    }
}
