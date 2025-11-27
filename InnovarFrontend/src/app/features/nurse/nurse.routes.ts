import { Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

export const NURSE_ROUTES: Routes = [
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
        loadComponent: () => import('./dashboard/nurse-dashboard.component').then(m => m.NurseDashboardComponent)
      },
      {
        path: 'collect',
        loadComponent: () => import('./collect/blood-collection-form.component').then(m => m.BloodCollectionFormComponent)
      },
      {
        path: 'rack-lookup',
        loadComponent: () => import('./rack-lookup/rack-position-lookup.component').then(m => m.RackPositionLookupComponent)
      },
      {
        path: 'tubes',
        loadComponent: () => import('./tubes/tube-search.component').then(m => m.TubeSearchComponent)
      }
    ]
  }
];

