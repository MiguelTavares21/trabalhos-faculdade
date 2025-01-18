import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selectedGroupGuard } from './selected-group.guard';

describe('selectedGroupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selectedGroupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
