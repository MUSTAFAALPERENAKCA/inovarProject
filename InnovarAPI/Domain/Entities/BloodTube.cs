namespace InnovarAPI.Domain.Entities;

public class BloodTube
{
    public Guid Id { get; set; }
    public string BarcodeNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid CollectedByUserId { get; set; }
    public DateTime CollectionDateTime { get; set; } = DateTime.UtcNow;
    public int RackRow { get; set; }
    public int RackColumn { get; set; }
    public BloodTubeStatus Status { get; set; } = BloodTubeStatus.Registered;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Patient Patient { get; set; } = null!;
    public User CollectedByUser { get; set; } = null!;
    public ICollection<LabResult> LabResults { get; set; } = new List<LabResult>();
}

