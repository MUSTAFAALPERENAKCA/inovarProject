using InnovarAPI.Application.DTOs.LabResult;

namespace InnovarAPI.Application.Services;

public interface ILabResultService
{
    Task<LabResultDto> CreateLabResultAsync(CreateLabResultDto dto, Guid performedByUserId);
    Task<LabResultDto> UpdateLabResultAsync(Guid id, UpdateLabResultDto dto);
    Task<List<LabResultDto>> GetLabResultsByTubeIdAsync(Guid tubeId);
    Task<LabResultDto?> GetLabResultByIdAsync(Guid id);
}

