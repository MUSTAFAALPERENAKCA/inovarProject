import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-lab-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TagModule, DividerModule, BadgeModule, ChipModule, SkeletonModule],
  templateUrl: './lab-dashboard.component.html',
  styleUrl: './lab-dashboard.component.css'
})
export class LabDashboardComponent implements OnInit {
  pendingCount = 0;
  completedToday = 0;
  loading = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.apiService.getPendingTubes().subscribe({
      next: (tubes) => {
        this.pendingCount = tubes.length;
        const today = new Date().toDateString();
        // Count completed results (would need additional endpoint for this)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

