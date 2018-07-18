import { TestBed, inject } from '@angular/core/testing';

import { SpinnerLoadService } from './spinner-load.service';

describe('SpinnerLoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerLoadService]
    });
  });

  it('should be created', inject([SpinnerLoadService], (service: SpinnerLoadService) => {
    expect(service).toBeTruthy();
  }));
});
