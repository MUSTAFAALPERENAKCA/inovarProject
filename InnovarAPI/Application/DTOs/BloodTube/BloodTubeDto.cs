using InnovarAPI.Application.DTOs.Patient;

namespace InnovarAPI.Application.DTOs.BloodTube;

public class BloodTubeDto
{
    public Guid Id { get; set; }
    public string BarcodeNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public PatientDto Patient { get; set; } = null!;
    public Guid CollectedByUserId { get; set; }
    public string CollectedByUserName { get; set; } = string.Empty;
    public DateTime CollectionDateTime { get; set; }
    public int RackRow { get; set; }
    public int RackColumn { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

