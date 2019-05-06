import { TestBed } from '@angular/core/testing';
import { ChartsProviderService } from './charts-provider.service';


describe('ChartsProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartsProviderService = TestBed.get(ChartsProviderService);
    expect(service).toBeTruthy();
  });
});
