import { TestBed, inject } from '@angular/core/testing';

import { EmailShareService } from './email-share.service';

describe('EmailShareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailShareService]
    });
  });

  it('should be created', inject([EmailShareService], (service: EmailShareService) => {
    expect(service).toBeTruthy();
  }));
});
