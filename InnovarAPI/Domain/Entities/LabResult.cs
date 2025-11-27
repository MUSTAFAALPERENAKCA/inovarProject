namespace InnovarAPI.Domain.Entities;

public class LabResult
{
    public Guid Id { get; set; }
    public Guid BloodTubeId { get; set; }
    public Guid PerformedByUserId { get; set; }
    public string TestType { get; set; } = string.Empty;
    public string ResultValuesJson { get; set; } = string.Empty; // JSON string
    public ResultStatus ResultStatus { get; set; } = ResultStatus.Draft;
    public DateTime ResultDateTime { get; set; } = DateTime.UtcNow;
    public string? Comments { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public BloodTube BloodTube { get; set; } = null!;
    public User PerformedByUser { get; set; } = null!;
}

