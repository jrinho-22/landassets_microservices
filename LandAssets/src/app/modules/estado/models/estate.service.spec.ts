import { TestBed } from '@angular/core/testing';

import { EstateModel } from './estate.service';

describe('EstateModel', () => {
  let service: EstateModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstateModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
