using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;


namespace StockerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupRepository _groupService;

        public GroupsController(IGroupRepository groupService)
        {
            _groupService = groupService;
        }

        /// <summary>
        /// Cria um novo grupo
        /// </summary>
        /// <param name="group">Detalhes do grupo a ser criado</param>
        /// <returns>É retornado o grupo criado com as suas informações</returns>
        [HttpPost("create")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GroupDto>> CreateGroup([FromBody] GroupCreateDto group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userEmailClaim = User.FindFirst(ClaimTypes.Email);

                if (userEmailClaim == null)
                {
                    return BadRequest("User email não foi encontrado nos claims do token");
                }

                var userId = await _groupService.GetIdByEmail(userEmailClaim.Value);

                if (userId == 0)
                {
                    return NotFound();
                }

                var newGroup = await _groupService.CreateGroup(group, userId);

                return CreatedAtAction(nameof(CreateGroup), new { id = newGroup.Id }, newGroup);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint serve para se obter a lista de utilizadores associados a um grupo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <returns>Lista de utilizadores do grupo</returns>
        [HttpGet("{groupId:int}/getUsers")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<userInGroupDto>>> GetUsers(int groupId)
        {
            try
            {
                var users = await _groupService.GetUsersByGroup(groupId);
                return Ok(users);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }

        }

        /// <summary>
        /// Obtem as informações de um determinado grupo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <returns>Detahes do grupo</returns>
        [HttpGet("{groupId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<GroupDto>> GetGroup(int groupId)
        {
            try
            {
                var group = await _groupService.GetGroup(groupId);
                return Ok(group);
            }
            catch (ArgumentException e)
            {
                return NotFound();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return NotFound(ModelState);
            }

        }

        /// <summary>
        /// Remove o utilizador autenticado de um determinado grupo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <returns>Retorna o status da operação</returns>
        [HttpDelete("leave/{groupId:int}")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LeaveGroup(int groupId)
        {
            try
            {
                var userEmailClaim = User.FindFirst(ClaimTypes.Email);
                if (userEmailClaim == null)
                {
                    return BadRequest("Email do utilizador não encontrado nos claims.");
                }

                
                var userId = await _groupService.GetIdByEmail(userEmailClaim.Value);
                if (userId == 0)
                {
                    return NotFound("Utilizador não encontrado.");
                }

                await _groupService.LeaveGroup(userId, groupId);

                return NoContent();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }

        }

        /// <summary>
        /// Este endpoint serve para um utilizador com a role de admin possa mudar a role de outros utilizadores
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="userId">Id do user</param>
        /// <returns>É retornado o status da operação/returns>
        [HttpPut("{groupId:int}/changeRole/{userId:int}")]
        [Authorize]
        [IsAdmin]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangeRole(int groupId, int userId)
        {
            try
            {
                var userEmailClaim = User.FindFirst(ClaimTypes.Email);
                if (userEmailClaim == null)
                {
                    return BadRequest("Email do utilizador não encontrado nos claims.");
                }

                var adminUserId = await _groupService.GetIdByEmail(userEmailClaim.Value);
                if (adminUserId == 0)
                {
                    return NotFound("Utilizador não encontrado.");
                }

                await _groupService.ChangeRole(adminUserId, userId, groupId);

                return Ok(new { message = "Role alterada com sucesso." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Este endpoint serve para um utilizador com a role de admin possa remover um membro de um grupo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="userId">Id do user a ser removido</param>
        /// <returns>É retornado o status da operação</returns>
        [HttpDelete("{groupId:int}/remove-member/{userId:int}")]
        [Authorize]
        [IsAdmin]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveMember(int groupId, int userId)
        {
            try
            {

                await _groupService.RemoveMember(userId, groupId);

                return Ok(new { message = "Membro removido com sucesso." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Este endpoint serve para um utilizador com a role de admin possa editar os detalhes do grupo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="groupUpdateDto">Dados para a atualização do grupo</param>
        /// <returns>É retornado o grupo atualizado</returns>
        [HttpPut("edit-group/{groupId:int}")]
        [Authorize]
        [IsAdmin]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GroupDto>> EditGroup(int groupId, [FromBody] GroupEditDto groupUpdateDto)
        {
            try
            {
                var updatedGroup = await _groupService.EditGroup(groupUpdateDto, groupId);

                return Ok(updatedGroup);
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return NotFound(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint serve para um utilizador com a role de admin possa apagar um grupo
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <returns>É retornado o status da operação</returns>
        [HttpDelete("delete-group/{groupId:int}")]
        [Authorize]
        [IsAdmin]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteGroup(int groupId)
        {
            try
            {
               await _groupService.DeleteGroup(groupId);

                return NoContent();
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return NotFound(ModelState);
            }
        }

        /// <summary>
        /// Obtém a role de um utilizador específico num grupo.
        /// </summary>
        /// <param name="groupId">Id do grupo</param>
        /// <param name="userId">Id do user</param>
        /// <returns>Role do utilizador no grupo</returns>
        [HttpGet("{groupId:int}/users/{userId:int}/role")]
        [Authorize]
        [IsMember]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> GetUserRole(int groupId, int userId)
        {
            try
            {
                var role = await _groupService.getuserRole(groupId, userId);
                return Ok(new { role });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Error", ex.Message);
                return BadRequest(ModelState);
            }
        }



    }
}
