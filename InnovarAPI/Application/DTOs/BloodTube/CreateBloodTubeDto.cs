using InnovarAPI.Application.DTOs.Patient;

namespace InnovarAPI.Application.DTOs.BloodTube;

public class CreateBloodTubeDto
{
    public string BarcodeNumber { get; set; } = string.Empty;
    public int RackRow { get; set; }
    public int RackColumn { get; set; }
    public string? Notes { get; set; }
    public CreateOrUpdatePatientDto Patient { get; set; } = null!;
}

