using Microsoft.EntityFrameworkCore;
using InnovarAPI.Application.DTOs.LabResult;
using InnovarAPI.Domain.Entities;
using InnovarAPI.Infrastructure.Data;
using System.Text.Json;

namespace InnovarAPI.Application.Services;

public class LabResultService : ILabResultService
{
    private readonly ApplicationDbContext _context;

    public LabResultService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LabResultDto> CreateLabResultAsync(CreateLabResultDto dto, Guid performedByUserId)
    {
        var tube = await _context.BloodTubes.FindAsync(dto.BloodTubeId);
        if (tube == null)
            throw new InvalidOperationException("Blood tube not found.");

        var resultStatus = Enum.TryParse<ResultStatus>(dto.ResultStatus, out var status) ? status : ResultStatus.Draft;

        var labResult = new LabResult
        {
            Id = Guid.NewGuid(),
            BloodTubeId = dto.BloodTubeId,
            PerformedByUserId = performedByUserId,
            TestType = dto.TestType,
            ResultValuesJson = JsonSerializer.Serialize(dto.ResultValues),
            ResultStatus = resultStatus,
            ResultDateTime = DateTime.UtcNow,
            Comments = dto.Comments,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.LabResults.Add(labResult);

        // Update tube status
        if (resultStatus == ResultStatus.Final)
        {
            tube.Status = BloodTubeStatus.Completed;
        }
        else if (tube.Status == BloodTubeStatus.Registered)
        {
            tube.Status = BloodTubeStatus.InAnalysis;
        }
        tube.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetLabResultByIdAsync(labResult.Id) ?? throw new InvalidOperationException("Failed to retrieve created lab result.");
    }

    public async Task<LabResultDto> UpdateLabResultAsync(Guid id, UpdateLabResultDto dto)
    {
        var labResult = await _context.LabResults
            .Include(lr => lr.BloodTube)
            .FirstOrDefaultAsync(lr => lr.Id == id);

        if (labResult == null)
            throw new InvalidOperationException("Lab result not found.");

        var resultStatus = Enum.TryParse<ResultStatus>(dto.ResultStatus, out var status) ? status : ResultStatus.Draft;

        labResult.TestType = dto.TestType;
        labResult.ResultValuesJson = JsonSerializer.Serialize(dto.ResultValues);
        labResult.ResultStatus = resultStatus;
        labResult.Comments = dto.Comments;
        labResult.UpdatedAt = DateTime.UtcNow;

        // Update tube status if result is final
        if (resultStatus == ResultStatus.Final && labResult.BloodTube.Status != BloodTubeStatus.Completed)
        {
            labResult.BloodTube.Status = BloodTubeStatus.Completed;
            labResult.BloodTube.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return await GetLabResultByIdAsync(id) ?? throw new InvalidOperationException("Failed to retrieve updated lab result.");
    }

    public async Task<List<LabResultDto>> GetLabResultsByTubeIdAsync(Guid tubeId)
    {
        var results = await _context.LabResults
            .Include(lr => lr.PerformedByUser)
            .Where(lr => lr.BloodTubeId == tubeId)
            .OrderByDescending(lr => lr.ResultDateTime)
            .ToListAsync();

        return results.Select(MapToDto).ToList();
    }

    public async Task<LabResultDto?> GetLabResultByIdAsync(Guid id)
    {
        var result = await _context.LabResults
            .Include(lr => lr.PerformedByUser)
            .FirstOrDefaultAsync(lr => lr.Id == id);

        return result == null ? null : MapToDto(result);
    }

    private static LabResultDto MapToDto(LabResult result)
    {
        return new LabResultDto
        {
            Id = result.Id,
            BloodTubeId = result.BloodTubeId,
            PerformedByUserId = result.PerformedByUserId,
            PerformedByUserName = result.PerformedByUser.FullName,
            TestType = result.TestType,
            ResultValues = JsonSerializer.Deserialize<Dictionary<string, string>>(result.ResultValuesJson) ?? new(),
            ResultStatus = result.ResultStatus.ToString(),
            ResultDateTime = result.ResultDateTime,
            Comments = result.Comments,
            CreatedAt = result.CreatedAt
        };
    }
}

