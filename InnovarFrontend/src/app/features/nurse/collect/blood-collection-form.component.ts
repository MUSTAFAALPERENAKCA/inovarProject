import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-blood-collection-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    FieldsetModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './blood-collection-form.component.html',
  styleUrl: './blood-collection-form.component.css'
})
export class BloodCollectionFormComponent {
  collectionForm: FormGroup;
  loading = false;
  maxDate: string;
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.collectionForm = this.fb.group({
      patient: this.fb.group({
        nationalId: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: [null],
        gender: [null],
        phoneNumber: [''],
        notes: ['']
      }),
      barcodeNumber: ['', Validators.required],
      rackRow: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      rackColumn: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.collectionForm.valid) {
      this.loading = true;
      const formValue = this.collectionForm.value;

      const tubeData = {
        barcodeNumber: formValue.barcodeNumber,
        rackRow: formValue.rackRow,
        rackColumn: formValue.rackColumn,
        notes: formValue.notes || '',
        patient: {
          nationalId: formValue.patient.nationalId,
          firstName: formValue.patient.firstName,
          lastName: formValue.patient.lastName,
          dateOfBirth: formValue.patient.dateOfBirth ? 
            new Date(formValue.patient.dateOfBirth).toISOString() : undefined,
          gender: formValue.patient.gender || undefined,
          phoneNumber: formValue.patient.phoneNumber || undefined,
          notes: formValue.patient.notes || undefined
        }
      };

      console.log('Submitting tube data:', tubeData);

      this.apiService.createTube(tubeData).subscribe({
        next: (tube) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Blood tube registered successfully! Barcode: ${tube.barcodeNumber}`
          });
          setTimeout(() => {
            this.collectionForm.reset({
              rackRow: 1,
              rackColumn: 1,
              patient: {
                nationalId: '',
                firstName: '',
                lastName: '',
                dateOfBirth: null,
                gender: null,
                phoneNumber: '',
                notes: ''
              },
              barcodeNumber: '',
              notes: ''
            });
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating tube:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to register blood tube'
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.collectionForm.controls).forEach(key => {
        const control = this.collectionForm.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(subKey => {
            control.get(subKey)?.markAsTouched();
          });
        } else {
          control?.markAsTouched();
        }
      });
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.'
      });
    }
  }
}

