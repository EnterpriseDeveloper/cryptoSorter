import { TestBed, inject } from '@angular/core/testing';

import { ChartDayService } from './chart-day.service';

describe('ChartDayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartDayService]
    });
  });

  it('should be created', inject([ChartDayService], (service: ChartDayService) => {
    expect(service).toBeTruthy();
  }));
});
