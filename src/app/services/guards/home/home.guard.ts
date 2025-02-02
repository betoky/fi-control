import { CanActivateFn, Router } from '@angular/router';
import { HomeService } from '../../home/home.service';
import { inject } from '@angular/core';

export const homeGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const hasHome = await inject(HomeService).hasHome();
  
  if (!hasHome) {
    router.navigateByUrl('/registration');
    return false;
  }
  return true;
};
