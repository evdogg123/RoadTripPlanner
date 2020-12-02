import { TestBed } from '@angular/core/testing';

import { EditTripInfoService } from './edit-trip-info.service';

describe('EditTripInfoService', () => {
  let service: EditTripInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditTripInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
