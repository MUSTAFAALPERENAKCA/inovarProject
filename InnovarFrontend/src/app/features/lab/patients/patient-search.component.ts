import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ApiService, Patient, BloodTube, LabResult } from '../../../core/services/api.service';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TagModule,
    TabsModule,
    ToastModule,
    AvatarModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.css'
})
export class PatientSearchComponent {
  searchTerm = '';
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  patientTubes: BloodTube[] = [];
  patientResults: LabResult[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.patients = [];
      return;
    }

    this.loading = true;
    this.apiService.searchPatients(this.searchTerm).subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to search patients'
        });
      }
    });
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.loadPatientData(patient.id);
  }

  loadPatientData(patientId: string): void {
    this.apiService.getPatientWithResults(patientId).subscribe({
      next: (data) => {
        this.patientTubes = data.bloodTubes || [];
        this.patientResults = data.allLabResults || [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patient data'
        });
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | null {
    switch (status) {
      case 'Registered': return 'info';
      case 'InAnalysis': return 'warn';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  }
}

