import { TestBed } from '@angular/core/testing';

import { ChartsProviderServiceService } from './charts-provider-service.service';

describe('ChartsProviderServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartsProviderServiceService = TestBed.get(ChartsProviderServiceService);
    expect(service).toBeTruthy();
  });
});
