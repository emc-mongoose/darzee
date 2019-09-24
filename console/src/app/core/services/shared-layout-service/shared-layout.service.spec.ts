import { TestBed } from '@angular/core/testing';

import { SharedLayoutService } from './shared-layout.service';

describe('SharedLayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedLayoutService = TestBed.get(SharedLayoutService);
    expect(service).toBeTruthy();
  });
});
