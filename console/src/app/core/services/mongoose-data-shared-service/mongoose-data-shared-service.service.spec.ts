import { TestBed } from '@angular/core/testing';

import { MongooseDataSharedServiceService } from './mongoose-data-shared-service.service';

describe('MongooseDataSharedServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MongooseDataSharedServiceService = TestBed.get(MongooseDataSharedServiceService);
    expect(service).toBeTruthy();
  });
});
