using Microsoft.EntityFrameworkCore;
using InnovarAPI.Domain.Entities;

namespace InnovarAPI.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<BloodTube> BloodTubes { get; set; }
    public DbSet<LabResult> LabResults { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
        });

        // Patient configuration
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.NationalId).IsUnique();
            entity.Property(e => e.NationalId).IsRequired().HasMaxLength(11).IsFixedLength();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
        });

        // BloodTube configuration
        modelBuilder.Entity<BloodTube>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BarcodeNumber).IsUnique();
            entity.Property(e => e.BarcodeNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.RackRow).IsRequired();
            entity.Property(e => e.RackColumn).IsRequired();

            entity.HasOne(e => e.Patient)
                  .WithMany(p => p.BloodTubes)
                  .HasForeignKey(e => e.PatientId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.CollectedByUser)
                  .WithMany(u => u.CollectedTubes)
                  .HasForeignKey(e => e.CollectedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // LabResult configuration
        modelBuilder.Entity<LabResult>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TestType).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ResultValuesJson).IsRequired();

            entity.HasOne(e => e.BloodTube)
                  .WithMany(bt => bt.LabResults)
                  .HasForeignKey(e => e.BloodTubeId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.PerformedByUser)
                  .WithMany(u => u.PerformedResults)
                  .HasForeignKey(e => e.PerformedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // AuditLog configuration
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EntityName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntityId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(50);

            entity.HasOne(e => e.PerformedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.PerformedByUserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}

