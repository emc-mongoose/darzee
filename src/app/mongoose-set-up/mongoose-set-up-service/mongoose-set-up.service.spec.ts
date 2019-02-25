import { TestBed } from '@angular/core/testing';

import { MongooseSetUpService } from './mongoose-set-up.service';

describe('MongooseSetUpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MongooseSetUpService = TestBed.get(MongooseSetUpService);
    expect(service).toBeTruthy();
  });
});
