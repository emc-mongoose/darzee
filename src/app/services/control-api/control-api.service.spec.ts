import { TestBed } from '@angular/core/testing';

import { ControlApiService } from './control-api.service';

describe('ControlApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControlApiService = TestBed.get(ControlApiService);
    expect(service).toBeTruthy();
  });
});
