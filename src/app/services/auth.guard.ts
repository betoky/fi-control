import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated$
    .pipe(tap(isAuth => !isAuth && inject(Router).navigateByUrl('/auth/login')));
};
