using InnovarAPI.Application.DTOs.BloodTube;

namespace InnovarAPI.Application.Services;

public interface ITubeService
{
    Task<BloodTubeDto> CreateTubeAsync(CreateBloodTubeDto dto, Guid collectedByUserId);
    Task<BloodTubeDto?> GetTubeByPositionAsync(int row, int column);
    Task<BloodTubeDto?> GetTubeByBarcodeAsync(string barcode);
    Task<List<BloodTubeDto>> GetTubesByNurseAsync(Guid nurseId, string? status);
    Task<List<BloodTubeDto>> GetPendingTubesForLabAsync();
    Task<BloodTubeDto?> GetTubeByIdAsync(Guid tubeId);
}

