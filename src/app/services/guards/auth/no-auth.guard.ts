import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(AuthService).isAuthenticated$.pipe(
    map(isAuth => {
      if (isAuth) {
        router.navigateByUrl('/');
        return false;
      }
      return true;
    })
  );
};
