import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRole = authService.getRole();
  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // Redirect based on user role
  if (authService.hasRole('Nurse')) {
    router.navigate(['/nurse/dashboard']);
  } else if (authService.hasRole('LabTechnician')) {
    router.navigate(['/lab/dashboard']);
  } else {
    router.navigate(['/auth/login']);
  }

  return false;
};

