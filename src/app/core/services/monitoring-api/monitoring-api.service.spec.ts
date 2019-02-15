import { TestBed } from '@angular/core/testing';

import { MonitoringApiService } from './monitoring-api.service';

describe('MonitoringApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoringApiService = TestBed.get(MonitoringApiService);
    expect(service).toBeTruthy();
  });
});
