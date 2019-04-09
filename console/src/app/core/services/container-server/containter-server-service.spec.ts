import { TestBed } from '@angular/core/testing';
import { ContainerServerService } from './container-server-service';

describe('ContainerServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContainerServerService = TestBed.get(ContainerServerService);
    expect(service).toBeTruthy();
  });
});
