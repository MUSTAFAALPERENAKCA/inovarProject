import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, ChipModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarVisible = false;
  userFullName: string | null = null;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.userFullName = this.authService.getFullName();
    this.userRole = this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getMenuItems(): any[] {
    if (this.userRole === 'Nurse') {
      return [
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/nurse/dashboard' },
        { label: 'Register Blood Tube', icon: 'pi pi-plus', routerLink: '/nurse/collect' },
        { label: 'Rack Lookup', icon: 'pi pi-search', routerLink: '/nurse/rack-lookup' },
        { label: 'My Tubes', icon: 'pi pi-list', routerLink: '/nurse/tubes' }
      ];
    } else if (this.userRole === 'LabTechnician') {
      return [
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/lab/dashboard' },
        { label: 'Pending Tubes', icon: 'pi pi-clock', routerLink: '/lab/pending' },
        { label: 'Search Patient', icon: 'pi pi-search', routerLink: '/lab/patients' }
      ];
    }
    return [];
  }
}

