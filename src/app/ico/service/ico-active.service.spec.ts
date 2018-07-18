import { TestBed, inject } from '@angular/core/testing';

import { IcoActiveService } from './ico-active.service';

describe('IcoActiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcoActiveService]
    });
  });

  it('should be created', inject([IcoActiveService], (service: IcoActiveService) => {
    expect(service).toBeTruthy();
  }));
});
