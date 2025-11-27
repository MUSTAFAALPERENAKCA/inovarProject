using InnovarAPI.Application.DTOs.BloodTube;
using InnovarAPI.Application.DTOs.LabResult;

namespace InnovarAPI.Application.DTOs.Patient;

public class PatientWithResultsDto
{
    public PatientDto Patient { get; set; } = null!;
    public List<BloodTubeDto> BloodTubes { get; set; } = new();
    public List<LabResultDto> AllLabResults { get; set; } = new();
}

