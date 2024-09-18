import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authsService = inject(AuthService);
  const router = inject(Router);

  try {
    if (authsService.getRole() !== null) {
      if (
        authsService.getToken() &&
        (route.data as any).roles.includes(authsService.getRole())
      ) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }
    router.navigate(['/login']);
    return false;
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
};
