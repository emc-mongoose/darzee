import { TestBed } from '@angular/core/testing';

import { MongooseRecordsProvierService } from './mongoose-records-provier.service';

describe('MongooseRecordsProvierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MongooseRecordsProvierService = TestBed.get(MongooseRecordsProvierService);
    expect(service).toBeTruthy();
  });
});
