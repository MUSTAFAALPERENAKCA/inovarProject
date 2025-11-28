import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ApiService, BloodTube } from '../../../core/services/api.service';

@Component({
  selector: 'app-rack-position-lookup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputNumberModule, ButtonModule, TagModule, ToastModule, PanelModule, DividerModule],
  providers: [MessageService],
  templateUrl: './rack-position-lookup.component.html',
  styleUrl: './rack-position-lookup.component.css'
})
export class RackPositionLookupComponent {
  lookupForm: FormGroup;
  loading = false;
  tube: BloodTube | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService
  ) {
    this.lookupForm = this.fb.group({
      row: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      column: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  onSearch(): void {
    if (this.lookupForm.valid) {
      this.loading = true;
      this.tube = null;
      const { row, column } = this.lookupForm.value;

      this.apiService.getTubeByPosition(row, column).subscribe({
        next: (tube) => {
          this.tube = tube;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 404) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Not Found',
              detail: `No tube found at position (${row}, ${column})`
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to lookup tube'
            });
          }
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

