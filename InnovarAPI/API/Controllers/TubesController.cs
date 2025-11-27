using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnovarAPI.Application.DTOs.BloodTube;
using InnovarAPI.Application.Services;

namespace InnovarAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TubesController : ControllerBase
{
    private readonly ITubeService _tubeService;

    public TubesController(ITubeService tubeService)
    {
        _tubeService = tubeService;
    }

    [HttpPost]
    [Authorize(Roles = "Nurse")]
    public async Task<ActionResult<BloodTubeDto>> CreateTube([FromBody] CreateBloodTubeDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.BarcodeNumber))
        {
            return BadRequest(new { message = "BarcodeNumber is required." });
        }

        if (dto.RackRow < 1 || dto.RackRow > 10 || dto.RackColumn < 1 || dto.RackColumn > 10)
        {
            return BadRequest(new { message = "RackRow and RackColumn must be between 1 and 10." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user." });
        }

        try
        {
            var tube = await _tubeService.CreateTubeAsync(dto, userId);
            return Ok(tube);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the tube.", error = ex.Message });
        }
    }

    [HttpGet("by-position")]
    [Authorize(Roles = "Nurse")]
    public async Task<ActionResult<BloodTubeDto>> GetTubeByPosition([FromQuery] int row, [FromQuery] int column)
    {
        if (row < 1 || row > 10 || column < 1 || column > 10)
        {
            return BadRequest(new { message = "Row and column must be between 1 and 10." });
        }

        var tube = await _tubeService.GetTubeByPositionAsync(row, column);
        if (tube == null)
            return NotFound(new { message = "No tube found at the specified position." });

        return Ok(tube);
    }

    [HttpGet("by-barcode/{barcode}")]
    [Authorize(Roles = "Nurse")]
    public async Task<ActionResult<BloodTubeDto>> GetTubeByBarcode(string barcode)
    {
        var tube = await _tubeService.GetTubeByBarcodeAsync(barcode);
        if (tube == null)
            return NotFound(new { message = "No tube found with the specified barcode." });

        return Ok(tube);
    }

    [HttpGet("nurse/list")]
    [Authorize(Roles = "Nurse")]
    public async Task<ActionResult<List<BloodTubeDto>>> GetNurseTubes([FromQuery] string? status)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid user." });
        }

        var tubes = await _tubeService.GetTubesByNurseAsync(userId, status);
        return Ok(tubes);
    }

    [HttpGet("lab/pending")]
    [Authorize(Roles = "LabTechnician")]
    public async Task<ActionResult<List<BloodTubeDto>>> GetPendingTubes()
    {
        var tubes = await _tubeService.GetPendingTubesForLabAsync();
        return Ok(tubes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BloodTubeDto>> GetTube(Guid id)
    {
        var tube = await _tubeService.GetTubeByIdAsync(id);
        if (tube == null)
            return NotFound(new { message = "Tube not found." });

        return Ok(tube);
    }
}

