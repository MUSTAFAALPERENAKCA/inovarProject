import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-lab-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TagModule],
  templateUrl: './lab-dashboard.component.html',
  styleUrl: './lab-dashboard.component.css'
})
export class LabDashboardComponent implements OnInit {
  pendingCount = 0;
  completedToday = 0;
  loading = true;

  constructor(private apiService: ApiService) {}

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

