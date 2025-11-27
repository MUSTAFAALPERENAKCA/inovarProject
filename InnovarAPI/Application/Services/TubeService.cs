using Microsoft.EntityFrameworkCore;
using InnovarAPI.Application.DTOs.BloodTube;
using InnovarAPI.Application.DTOs.Patient;
using InnovarAPI.Domain.Entities;
using InnovarAPI.Infrastructure.Data;

namespace InnovarAPI.Application.Services;

public class TubeService : ITubeService
{
    private readonly ApplicationDbContext _context;
    private readonly IPatientService _patientService;

    public TubeService(ApplicationDbContext context, IPatientService patientService)
    {
        _context = context;
        _patientService = patientService;
    }

    public async Task<BloodTubeDto> CreateTubeAsync(CreateBloodTubeDto dto, Guid collectedByUserId)
    {
        // Create or update patient
        var patientDto = await _patientService.CreateOrUpdatePatientAsync(dto.Patient);

        // Check if barcode already exists
        var existingTube = await _context.BloodTubes
            .FirstOrDefaultAsync(bt => bt.BarcodeNumber == dto.BarcodeNumber);

        if (existingTube != null)
            throw new InvalidOperationException($"A tube with barcode {dto.BarcodeNumber} already exists.");

        // Check if position is already occupied
        var existingAtPosition = await _context.BloodTubes
            .FirstOrDefaultAsync(bt => bt.RackRow == dto.RackRow && bt.RackColumn == dto.RackColumn && 
                                       bt.Status != BloodTubeStatus.Cancelled);

        if (existingAtPosition != null)
            throw new InvalidOperationException($"Position ({dto.RackRow}, {dto.RackColumn}) is already occupied.");

        var tube = new BloodTube
        {
            Id = Guid.NewGuid(),
            BarcodeNumber = dto.BarcodeNumber,
            PatientId = patientDto.Id,
            CollectedByUserId = collectedByUserId,
            CollectionDateTime = DateTime.UtcNow,
            RackRow = dto.RackRow,
            RackColumn = dto.RackColumn,
            Status = BloodTubeStatus.Registered,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.BloodTubes.Add(tube);
        await _context.SaveChangesAsync();

        return await GetTubeByIdAsync(tube.Id) ?? throw new InvalidOperationException("Failed to retrieve created tube.");
    }

    public async Task<BloodTubeDto?> GetTubeByPositionAsync(int row, int column)
    {
        var tube = await _context.BloodTubes
            .Include(bt => bt.Patient)
            .Include(bt => bt.CollectedByUser)
            .FirstOrDefaultAsync(bt => bt.RackRow == row && bt.RackColumn == column);

        return tube == null ? null : MapToDto(tube);
    }

    public async Task<BloodTubeDto?> GetTubeByBarcodeAsync(string barcode)
    {
        var tube = await _context.BloodTubes
            .Include(bt => bt.Patient)
            .Include(bt => bt.CollectedByUser)
            .FirstOrDefaultAsync(bt => bt.BarcodeNumber == barcode);

        return tube == null ? null : MapToDto(tube);
    }

    public async Task<List<BloodTubeDto>> GetTubesByNurseAsync(Guid nurseId, string? status)
    {
        var query = _context.BloodTubes
            .Include(bt => bt.Patient)
            .Include(bt => bt.CollectedByUser)
            .Where(bt => bt.CollectedByUserId == nurseId);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<BloodTubeStatus>(status, out var statusEnum))
        {
            query = query.Where(bt => bt.Status == statusEnum);
        }

        var tubes = await query.OrderByDescending(bt => bt.CreatedAt).ToListAsync();
        return tubes.Select(MapToDto).ToList();
    }

    public async Task<List<BloodTubeDto>> GetPendingTubesForLabAsync()
    {
        var tubes = await _context.BloodTubes
            .Include(bt => bt.Patient)
            .Include(bt => bt.CollectedByUser)
            .Where(bt => bt.Status == BloodTubeStatus.Registered || bt.Status == BloodTubeStatus.InAnalysis)
            .OrderByDescending(bt => bt.CollectionDateTime)
            .ToListAsync();

        return tubes.Select(MapToDto).ToList();
    }

    public async Task<BloodTubeDto?> GetTubeByIdAsync(Guid tubeId)
    {
        var tube = await _context.BloodTubes
            .Include(bt => bt.Patient)
            .Include(bt => bt.CollectedByUser)
            .FirstOrDefaultAsync(bt => bt.Id == tubeId);

        return tube == null ? null : MapToDto(tube);
    }

    private static BloodTubeDto MapToDto(BloodTube tube)
    {
        return new BloodTubeDto
        {
            Id = tube.Id,
            BarcodeNumber = tube.BarcodeNumber,
            PatientId = tube.PatientId,
            Patient = new PatientDto
            {
                Id = tube.Patient.Id,
                NationalId = tube.Patient.NationalId,
                FirstName = tube.Patient.FirstName,
                LastName = tube.Patient.LastName,
                DateOfBirth = tube.Patient.DateOfBirth,
                Gender = tube.Patient.Gender?.ToString(),
                PhoneNumber = tube.Patient.PhoneNumber,
                Notes = tube.Patient.Notes,
                CreatedAt = tube.Patient.CreatedAt
            },
            CollectedByUserId = tube.CollectedByUserId,
            CollectedByUserName = tube.CollectedByUser.FullName,
            CollectionDateTime = tube.CollectionDateTime,
            RackRow = tube.RackRow,
            RackColumn = tube.RackColumn,
            Status = tube.Status.ToString(),
            Notes = tube.Notes,
            CreatedAt = tube.CreatedAt
        };
    }
}

