import { TestBed } from '@angular/core/testing';

import { ValesService } from './vales.service';

describe('ValesService', () => {
  let service: ValesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
