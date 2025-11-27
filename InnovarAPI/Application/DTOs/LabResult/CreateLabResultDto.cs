namespace InnovarAPI.Application.DTOs.LabResult;

public class CreateLabResultDto
{
    public Guid BloodTubeId { get; set; }
    public string TestType { get; set; } = string.Empty;
    public Dictionary<string, string> ResultValues { get; set; } = new();
    public string ResultStatus { get; set; } = string.Empty;
    public string? Comments { get; set; }
}

