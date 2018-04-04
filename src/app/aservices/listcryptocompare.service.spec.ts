import { TestBed, inject } from '@angular/core/testing';

import { ListcryptocompareService } from './listcryptocompare.service';

describe('ListcryptocompareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListcryptocompareService]
    });
  });

  it('should be created', inject([ListcryptocompareService], (service: ListcryptocompareService) => {
    expect(service).toBeTruthy();
  }));
});
