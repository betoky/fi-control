import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HomeService } from '../../home/home.service';

export const noHomeGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const hasHome = await inject(HomeService).hasHome();

  if (hasHome) {
    router.navigateByUrl('/');
    return false
  }
  return true;
};
