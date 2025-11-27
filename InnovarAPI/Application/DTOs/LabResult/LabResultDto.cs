namespace InnovarAPI.Application.DTOs.LabResult;

public class LabResultDto
{
    public Guid Id { get; set; }
    public Guid BloodTubeId { get; set; }
    public Guid PerformedByUserId { get; set; }
    public string PerformedByUserName { get; set; } = string.Empty;
    public string TestType { get; set; } = string.Empty;
    public Dictionary<string, string> ResultValues { get; set; } = new();
    public string ResultStatus { get; set; } = string.Empty;
    public DateTime ResultDateTime { get; set; }
    public string? Comments { get; set; }
    public DateTime CreatedAt { get; set; }
}

