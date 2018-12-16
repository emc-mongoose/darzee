import { TestBed } from '@angular/core/testing';

import { IpAddressService } from './ip-address.service';

describe('IpAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpAddressService = TestBed.get(IpAddressService);
    expect(service).toBeTruthy();
  });
});
