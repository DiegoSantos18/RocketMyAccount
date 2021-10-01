import { TestBed } from '@angular/core/testing';

import { ElevationGuard } from './elevation.guard';

describe('ElevationGuard', () => {
  let guard: ElevationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ElevationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
