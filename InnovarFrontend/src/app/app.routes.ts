import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'nurse',
    loadChildren: () => import('./features/nurse/nurse.routes').then(m => m.NURSE_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Nurse'] }
  },
  {
    path: 'lab',
    loadChildren: () => import('./features/lab/lab.routes').then(m => m.LAB_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['LabTechnician'] }
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
