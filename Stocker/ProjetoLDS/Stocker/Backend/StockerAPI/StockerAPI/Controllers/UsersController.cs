using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using StockerAPI.Data;
using StockerAPI.Models;
using StockerAPI.Models.Dto;
using StockerAPI.Repository.Interfaces;
using System.Security.Claims;

namespace StockerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userService;
        private readonly IGroupRepository _groupService;

        public UsersController(IUserRepository userService, IGroupRepository groupService)
        {
            _userService = userService;
            _groupService = groupService;
        }

        /// <summary>
        /// Obtem um utilizador através do id
        /// </summary>
        /// <param name="id">Id do utilizador</param>
        /// <returns>Retorna um userDto que contem os detalhes do mesmo, sem a informação sensível</returns>
        [HttpGet("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var userDto = await _userService.GetUser(id);
                return Ok(userDto);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Regista um novo utilizador
        /// </summary>
        /// <param name="user">Dados para a criação do utilizador</param>
        /// <returns>Retorna um userDto dom as informações do utilizador criado</returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserCreateDto user)
        {

            try
            {
                var register = await _userService.Register(user);
                return CreatedAtAction(nameof(GetUser), new { id = register.Id }, register);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint serve para realizar o login
        /// </summary>
        /// <param name="user">Dados do login (email e password)</param>
        /// <returns>Retorna o jwt token</returns>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> Login([FromBody] UserLoginDto user)
        {
            try
            {
                var token = await _userService.Login(user);
                return Ok(new { Token = token });
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Permite que o utilizador entre num grupo através de um código de acesso
        /// </summary>
        /// <param name="accessCode">Código de acesso ao grupo</param>
        /// <returns>É retornado o status da operação</returns>
        [HttpPost("join-group")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult> JoinGroup([FromBody] string accessCode)
        {
            try
            {
                if (string.IsNullOrEmpty(accessCode))
                {
                    return BadRequest("Código de acesso é obrigatório");
                }

                var userEmailClaim = User.FindFirst(ClaimTypes.Email);
                if (userEmailClaim == null)
                {
                    return BadRequest("User email não foi encontrado nos claims do token");
                }

                var userId = await _groupService.GetIdByEmail(userEmailClaim.Value);
                if (userId == 0)
                {
                    return NotFound("User não encontrado.");
                }

                var group = await _groupService.GetGroupByAccessCode(accessCode);

                var userGroupExists = await _groupService.UserIsInGroup(userId, group.Id);
                if (userGroupExists)
                {
                    return BadRequest("O utilizador já faz parte deste grupo!");
                }

                await _userService.AddUserToGroup(userId, group.Id);

                return Ok("Utilizador juntou-se ao grupo.");
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return NotFound(ModelState);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint serve para ir buscar os grupos associados ao utilizador autenticado
        /// </summary>
        /// <returns>Lista com os grupos a que o utilizador pertence</returns>
        [HttpGet("getGroups")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<GroupDto>>> GetUserGroups()
        {
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
                    return NotFound("User não encontrado.");
                }

                var userGroups = await _userService.GetGroupsByUser(userId);

                return Ok(userGroups);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Permite que o utilizador altere a palavra passe
        /// </summary>
        /// <param name="passwordDto">PasswordDto contém a password atual e a nova password</param>
        /// <returns>É retornado o status da operação</returns>
        [HttpPut("change-password")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto passwordDto)
        {
            try
            {
                var emailUser = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(emailUser))
                {
                    return BadRequest("User email não foi encontrado nos claims do token");
                }

                var userId = await _groupService.GetIdByEmail(emailUser);
                if (userId == 0)
                {
                    return NotFound("User não encontrado.");
                }

                await _userService.ChangePassword(userId, passwordDto.NovaPass, passwordDto.PassAtual);
                return Ok(new { message = "Password alterada com sucesso." });
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

        /// <summary>
        /// Este endpoint serve para o utilizador atualizar a sua conta pessoal como email, nome e o estado das notificações (ativo, desativado)
        /// </summary>
        /// <param name="userUpdate">userUpdate contém os dados a serem atualizados</param>
        /// <returns>É retornado o utilizador atualizado</returns>
        [HttpPut("edit-account")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<UserDto>> EditAccount([FromBody] UserUpdateDto userUpdate)
        {
            try
            {
                var emailUser = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(emailUser))
                {
                    return BadRequest("User email não foi encontrado nos claims do token");
                }

                var userId = await _groupService.GetIdByEmail(emailUser);
                if (userId == 0)
                {
                    return NotFound("User não encontrado.");
                }

                var user = await _userService.UpdateAccount(userId, userUpdate);
                return Ok(user);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Error", e.Message);
                return BadRequest(ModelState);
            }
        }

    }
}
