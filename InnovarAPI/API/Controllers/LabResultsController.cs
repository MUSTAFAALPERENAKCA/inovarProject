using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnovarAPI.Application.DTOs.LabResult;
using InnovarAPI.Application.Services;

namespace InnovarAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "LabTechnician")]
public class LabResultsController : ControllerBase
{
    private readonly ILabResultService _labResultService;

    public LabResultsController(ILabResultService labResultService)
    {
        _labResultService = labResultService;
    }

    [HttpPost]
    public async Task<ActionResult<LabResultDto>> CreateLabResult([FromBody] CreateLabResultDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.TestType))
        {
            return BadRequest(new { message = "TestType is required." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user." });
        }

        try
        {
            var result = await _labResultService.CreateLabResultAsync(dto, userId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the lab result.", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<LabResultDto>> UpdateLabResult(Guid id, [FromBody] UpdateLabResultDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.TestType))
        {
            return BadRequest(new { message = "TestType is required." });
        }

        try
        {
            var result = await _labResultService.UpdateLabResultAsync(id, dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the lab result.", error = ex.Message });
        }
    }

    [HttpGet("by-tube/{tubeId}")]
    public async Task<ActionResult<List<LabResultDto>>> GetLabResultsByTube(Guid tubeId)
    {
        var results = await _labResultService.GetLabResultsByTubeIdAsync(tubeId);
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LabResultDto>> GetLabResult(Guid id)
    {
        var result = await _labResultService.GetLabResultByIdAsync(id);
        if (result == null)
            return NotFound(new { message = "Lab result not found." });

        return Ok(result);
    }
}

