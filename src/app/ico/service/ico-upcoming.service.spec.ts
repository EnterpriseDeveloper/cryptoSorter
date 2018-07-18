import { TestBed, inject } from '@angular/core/testing';

import { IcoUpcomingService } from './ico-upcoming.service';

describe('IcoUpcomingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcoUpcomingService]
    });
  });

  it('should be created', inject([IcoUpcomingService], (service: IcoUpcomingService) => {
    expect(service).toBeTruthy();
  }));
});
