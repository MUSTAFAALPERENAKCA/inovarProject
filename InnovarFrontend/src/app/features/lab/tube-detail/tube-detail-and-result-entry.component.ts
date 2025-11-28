import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService, BloodTube, LabResult } from '../../../core/services/api.service';

@Component({
  selector: 'app-tube-detail-and-result-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './tube-detail-and-result-entry.component.html',
  styleUrl: './tube-detail-and-result-entry.component.css'
})
export class TubeDetailAndResultEntryComponent implements OnInit {
  tube: BloodTube | null = null;
  labResults: LabResult[] = [];
  resultForm: FormGroup;
  loading = false;
  resultValues: { key: string; value: string }[] = [{ key: '', value: '' }];
  statusOptions = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Final', value: 'Final' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService
  ) {
    this.resultForm = this.fb.group({
      testType: ['', Validators.required],
      resultStatus: ['Draft', Validators.required],
      comments: ['']
    });
  }

  ngOnInit(): void {
    const tubeId = this.route.snapshot.paramMap.get('id');
    if (tubeId) {
      this.loadTubeDetails(tubeId);
      this.loadLabResults(tubeId);
    }
  }

  loadTubeDetails(tubeId: string): void {
    this.apiService.getTube(tubeId).subscribe({
      next: (tube) => {
        this.tube = tube;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tube details'
        });
        this.router.navigate(['/lab/pending']);
      }
    });
  }

  loadLabResults(tubeId: string): void {
    this.apiService.getLabResultsByTube(tubeId).subscribe({
      next: (results) => {
        this.labResults = results;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load lab results'
        });
      }
    });
  }

  addResultValue(): void {
    this.resultValues.push({ key: '', value: '' });
  }

  removeResultValue(index: number): void {
    this.resultValues.splice(index, 1);
  }

  updateResultValueKey(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.resultValues[index]) {
      this.resultValues[index].key = target.value;
    }
  }

  updateResultValueValue(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.resultValues[index]) {
      this.resultValues[index].value = target.value;
    }
  }

  onSubmit(): void {
    if (this.resultForm.valid && this.tube) {
      // resultValues array'ini kontrol et ve temizle
      const validValues: { [key: string]: string } = {};
      
      for (let i = 0; i < this.resultValues.length; i++) {
        const rv = this.resultValues[i];
        if (rv && rv.key && rv.value) {
          const key = String(rv.key).trim();
          const value = String(rv.value).trim();
          
          if (key.length > 0 && value.length > 0) {
            validValues[key] = value;
          }
        }
      }

      if (Object.keys(validValues).length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Please add at least one result value. Both parameter name and value must be filled.'
        });
        return;
      }

      this.loading = true;
      const formValue = this.resultForm.value;

      const resultData = {
        bloodTubeId: this.tube.id,
        testType: formValue.testType,
        resultValues: validValues,
        resultStatus: formValue.resultStatus,
        comments: formValue.comments
      };

      this.apiService.createLabResult(resultData).subscribe({
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Lab result saved successfully'
          });
          this.resultForm.reset();
          this.resultForm.patchValue({ resultStatus: 'Draft' });
          this.resultValues = [{ key: '', value: '' }];
          this.loadLabResults(this.tube!.id);
          if (formValue.resultStatus === 'Final') {
            setTimeout(() => {
              this.router.navigate(['/lab/pending']);
            }, 1500);
          }
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to save lab result'
          });
        }
      });
    }
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

