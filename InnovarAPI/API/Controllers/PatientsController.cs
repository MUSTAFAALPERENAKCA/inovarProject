using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnovarAPI.Application.DTOs.Patient;
using InnovarAPI.Application.Services;

namespace InnovarAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientsController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpPost]
    [Authorize(Roles = "Nurse")]
    public async Task<ActionResult<PatientDto>> CreateOrUpdatePatient([FromBody] CreateOrUpdatePatientDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NationalId) || dto.NationalId.Length != 11)
        {
            return BadRequest(new { message = "NationalId must be exactly 11 digits." });
        }

        try
        {
            var patient = await _patientService.CreateOrUpdatePatientAsync(dto);
            return Ok(patient);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<PatientDto>>> SearchPatients([FromQuery] string? search)
    {
        var patients = await _patientService.SearchPatientsAsync(search);
        return Ok(patients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetPatient(Guid id)
    {
        var patient = await _patientService.GetPatientByIdAsync(id);
        if (patient == null)
            return NotFound(new { message = "Patient not found." });

        return Ok(patient);
    }

    [HttpGet("{id}/labresults")]
    [Authorize(Roles = "LabTechnician")]
    public async Task<ActionResult<PatientWithResultsDto>> GetPatientWithResults(Guid id)
    {
        var result = await _patientService.GetPatientWithResultsAsync(id);
        if (result == null)
            return NotFound(new { message = "Patient not found." });

        return Ok(result);
    }
}

