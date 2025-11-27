namespace InnovarAPI.Application.DTOs.LabResult;

public class UpdateLabResultDto
{
    public string TestType { get; set; } = string.Empty;
    public Dictionary<string, string> ResultValues { get; set; } = new();
    public string ResultStatus { get; set; } = string.Empty;
    public string? Comments { get; set; }
}

