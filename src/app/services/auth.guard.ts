import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).isAuthenticated$
    .pipe(tap(isAuth => !isAuth && router.navigateByUrl('/auth/login')));
};
