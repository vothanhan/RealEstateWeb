import { TestBed, inject } from '@angular/core/testing';

import { TimevalueService } from './timevalue.service';

describe('TimevalueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimevalueService]
    });
  });

  it('should be created', inject([TimevalueService], (service: TimevalueService) => {
    expect(service).toBeTruthy();
  }));
});
