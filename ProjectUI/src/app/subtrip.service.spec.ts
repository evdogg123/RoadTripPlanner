import { TestBed } from '@angular/core/testing';

import { SubtripService } from './subtrip.service';

describe('SubtripService', () => {
  let service: SubtripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
