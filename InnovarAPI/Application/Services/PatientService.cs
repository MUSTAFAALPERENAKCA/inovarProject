using Microsoft.EntityFrameworkCore;
using InnovarAPI.Application.DTOs.Patient;
using InnovarAPI.Domain.Entities;
using InnovarAPI.Infrastructure.Data;

namespace InnovarAPI.Application.Services;

public class PatientService : IPatientService
{
    private readonly ApplicationDbContext _context;

    public PatientService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PatientDto> CreateOrUpdatePatientAsync(CreateOrUpdatePatientDto dto)
    {
        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.NationalId == dto.NationalId);

        if (patient == null)
        {
            patient = new Patient
            {
                Id = Guid.NewGuid(),
                NationalId = dto.NationalId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DateOfBirth = dto.DateOfBirth,
                Gender = Enum.TryParse<Gender>(dto.Gender, out var gender) ? gender : null,
                PhoneNumber = dto.PhoneNumber,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Patients.Add(patient);
        }
        else
        {
            patient.FirstName = dto.FirstName;
            patient.LastName = dto.LastName;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.Gender = Enum.TryParse<Gender>(dto.Gender, out var gender) ? gender : null;
            patient.PhoneNumber = dto.PhoneNumber;
            patient.Notes = dto.Notes;
            patient.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return MapToDto(patient);
    }

    public async Task<List<PatientDto>> SearchPatientsAsync(string? search)
    {
        var query = _context.Patients.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(p =>
                p.NationalId.Contains(search) ||
                p.FirstName.Contains(search) ||
                p.LastName.Contains(search) ||
                (p.FirstName + " " + p.LastName).Contains(search));
        }

        var patients = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        return patients.Select(MapToDto).ToList();
    }

    public async Task<PatientDto?> GetPatientByIdAsync(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        return patient == null ? null : MapToDto(patient);
    }

    public async Task<PatientWithResultsDto?> GetPatientWithResultsAsync(Guid id)
    {
        var patient = await _context.Patients
            .Include(p => p.BloodTubes)
                .ThenInclude(bt => bt.CollectedByUser)
            .Include(p => p.BloodTubes)
                .ThenInclude(bt => bt.LabResults)
                    .ThenInclude(lr => lr.PerformedByUser)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (patient == null)
            return null;

        var bloodTubes = patient.BloodTubes.Select(bt => new Application.DTOs.BloodTube.BloodTubeDto
        {
            Id = bt.Id,
            BarcodeNumber = bt.BarcodeNumber,
            PatientId = bt.PatientId,
            Patient = MapToDto(patient),
            CollectedByUserId = bt.CollectedByUserId,
            CollectedByUserName = bt.CollectedByUser.FullName,
            CollectionDateTime = bt.CollectionDateTime,
            RackRow = bt.RackRow,
            RackColumn = bt.RackColumn,
            Status = bt.Status.ToString(),
            Notes = bt.Notes,
            CreatedAt = bt.CreatedAt
        }).ToList();

        var allResults = patient.BloodTubes
            .SelectMany(bt => bt.LabResults)
            .Select(lr => new Application.DTOs.LabResult.LabResultDto
            {
                Id = lr.Id,
                BloodTubeId = lr.BloodTubeId,
                PerformedByUserId = lr.PerformedByUserId,
                PerformedByUserName = lr.PerformedByUser.FullName,
                TestType = lr.TestType,
                ResultValues = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(lr.ResultValuesJson) ?? new(),
                ResultStatus = lr.ResultStatus.ToString(),
                ResultDateTime = lr.ResultDateTime,
                Comments = lr.Comments,
                CreatedAt = lr.CreatedAt
            }).ToList();

        return new PatientWithResultsDto
        {
            Patient = MapToDto(patient),
            BloodTubes = bloodTubes,
            AllLabResults = allResults
        };
    }

    private static PatientDto MapToDto(Patient patient)
    {
        return new PatientDto
        {
            Id = patient.Id,
            NationalId = patient.NationalId,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            DateOfBirth = patient.DateOfBirth,
            Gender = patient.Gender?.ToString(),
            PhoneNumber = patient.PhoneNumber,
            Notes = patient.Notes,
            CreatedAt = patient.CreatedAt
        };
    }
}

