import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noHomeGuard } from './no-home.guard';

describe('noHomeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noHomeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
