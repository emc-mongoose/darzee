import { TestBed } from '@angular/core/testing';

import { PrometheusApiService } from './prometheus-api.service';

describe('PrometheusApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrometheusApiService = TestBed.get(PrometheusApiService);
    expect(service).toBeTruthy();
  });
});
