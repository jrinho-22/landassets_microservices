import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, of } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const autrorized: Observable<boolean> = authService.authenticated$.pipe(map(v => v.user.type == 'admin'))

  return autrorized.pipe(map(v => {
    if (v) return v
    return router.createUrlTree(['/dashboard']);
  })) 
};
