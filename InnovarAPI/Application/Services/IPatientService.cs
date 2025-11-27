using InnovarAPI.Application.DTOs.Patient;

namespace InnovarAPI.Application.Services;

public interface IPatientService
{
    Task<PatientDto> CreateOrUpdatePatientAsync(CreateOrUpdatePatientDto dto);
    Task<List<PatientDto>> SearchPatientsAsync(string? search);
    Task<PatientDto?> GetPatientByIdAsync(Guid id);
    Task<PatientWithResultsDto?> GetPatientWithResultsAsync(Guid id);
}

