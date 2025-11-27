import { Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

export const LAB_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/lab-dashboard.component').then(m => m.LabDashboardComponent)
      },
      {
        path: 'pending',
        loadComponent: () => import('./pending/pending-tubes-list.component').then(m => m.PendingTubesListComponent)
      },
      {
        path: 'tubes/:id',
        loadComponent: () => import('./tube-detail/tube-detail-and-result-entry.component').then(m => m.TubeDetailAndResultEntryComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./patients/patient-search.component').then(m => m.PatientSearchComponent)
      }
    ]
  }
];

