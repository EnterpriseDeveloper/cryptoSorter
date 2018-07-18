import { TestBed, inject } from '@angular/core/testing';

import { ListWalletService } from './list-wallet.service';

describe('ListWalletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListWalletService]
    });
  });

  it('should be created', inject([ListWalletService], (service: ListWalletService) => {
    expect(service).toBeTruthy();
  }));
});
