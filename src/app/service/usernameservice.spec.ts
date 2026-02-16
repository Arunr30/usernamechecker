import { TestBed } from '@angular/core/testing';

import { Usernameservice } from './usernameservice';

describe('Usernameservice', () => {
  let service: Usernameservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Usernameservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
