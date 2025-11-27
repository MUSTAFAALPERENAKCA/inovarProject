namespace InnovarAPI.Domain.Entities;

public class Patient
{
    public Guid Id { get; set; }
    public string NationalId { get; set; } = string.Empty; // 11-digit Turkish T.C. number
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<BloodTube> BloodTubes { get; set; } = new List<BloodTube>();
}

