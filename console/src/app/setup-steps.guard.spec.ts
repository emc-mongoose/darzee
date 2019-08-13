import { TestBed, async, inject } from '@angular/core/testing';

import { SetupStepsGuard } from './setup-steps.guard';

describe('SetupStepsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetupStepsGuard]
    });
  });

  it('should ...', inject([SetupStepsGuard], (guard: SetupStepsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
