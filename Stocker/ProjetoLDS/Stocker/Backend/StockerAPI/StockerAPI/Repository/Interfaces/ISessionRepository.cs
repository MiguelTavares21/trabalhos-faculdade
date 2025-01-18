using StockerAPI.Models;

namespace StockerAPI.Repository.Interfaces
{
    public interface ISessionRepository
    {
        string CreateToken(User user);
    }
}
