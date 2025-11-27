import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService, BloodTube } from '../../../core/services/api.service';

@Component({
  selector: 'app-pending-tubes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './pending-tubes-list.component.html',
  styleUrl: './pending-tubes-list.component.css'
})
export class PendingTubesListComponent implements OnInit {
  tubes: BloodTube[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPendingTubes();
  }

  loadPendingTubes(): void {
    this.loading = true;
    this.apiService.getPendingTubes().subscribe({
      next: (tubes) => {
        this.tubes = tubes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load pending tubes'
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

