import { TestBed, inject } from '@angular/core/testing';

import { IsEmptyWalletService } from './is-empty-wallet.service';

describe('IsEmptyWalletService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsEmptyWalletService]
    });
  });

  it('should be created', inject([IsEmptyWalletService], (service: IsEmptyWalletService) => {
    expect(service).toBeTruthy();
  }));
});
