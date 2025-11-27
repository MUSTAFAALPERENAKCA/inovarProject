using InnovarAPI.Application.DTOs.Auth;

namespace InnovarAPI.Application.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    string GenerateJwtToken(Guid userId, string username, string role);
}

