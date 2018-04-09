import { TestBed, inject } from '@angular/core/testing';

import { SharedLinkService } from './shared-link.service';

describe('SharedLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedLinkService]
    });
  });

  it('should be created', inject([SharedLinkService], (service: SharedLinkService) => {
    expect(service).toBeTruthy();
  }));
});
