import { TestBed, inject } from '@angular/core/testing';

import { IcoDbService } from './ico-db.service';

describe('IcoDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcoDbService]
    });
  });

  it('should be created', inject([IcoDbService], (service: IcoDbService) => {
    expect(service).toBeTruthy();
  }));
});
