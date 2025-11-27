import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ApiService, BloodTube } from '../../../core/services/api.service';

@Component({
  selector: 'app-tube-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule, TableModule, TagModule, DialogModule, ToastModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './tube-search.component.html',
  styleUrl: './tube-search.component.css'
})
export class TubeSearchComponent implements OnInit {
  tubes: BloodTube[] = [];
  filteredTubes: BloodTube[] = [];
  searchTerm = '';
  loading = false;
  selectedTube: BloodTube | null = null;
  dialogVisible = false;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTubes();
  }

  loadTubes(): void {
    this.loading = true;
    this.apiService.getNurseTubes().subscribe({
      next: (tubes) => {
        this.tubes = tubes;
        this.filteredTubes = tubes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tubes'
        });
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTubes = this.tubes;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredTubes = this.tubes.filter(tube =>
      tube.barcodeNumber.toLowerCase().includes(term) ||
      tube.patient.nationalId.includes(term) ||
      tube.patient.firstName.toLowerCase().includes(term) ||
      tube.patient.lastName.toLowerCase().includes(term)
    );
  }

  showDetails(tube: BloodTube): void {
    this.selectedTube = tube;
    this.dialogVisible = true;
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

