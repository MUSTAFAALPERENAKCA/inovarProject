import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    MessageModule,
    ToastModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login response:', response);
          console.log('User role:', response.role);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Welcome, ${response.fullName}!`
          });

          // Redirect based on role
          setTimeout(() => {
            const role = response.role;
            console.log('Redirecting with role:', role);
            if (role === 'Nurse') {
              this.router.navigate(['/nurse/dashboard']).then(success => {
                console.log('Navigation success:', success);
              }).catch(err => {
                console.error('Navigation error:', err);
              });
            } else if (role === 'LabTechnician') {
              this.router.navigate(['/lab/dashboard']).then(success => {
                console.log('Navigation success:', success);
              }).catch(err => {
                console.error('Navigation error:', err);
              });
            } else {
              console.error('Unknown role:', role);
            }
          }, 500);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error.error?.message || 'Invalid username or password'
          });
        }
      });
    }
  }
}

