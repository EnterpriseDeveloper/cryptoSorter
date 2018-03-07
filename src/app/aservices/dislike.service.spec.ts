import { TestBed, inject } from '@angular/core/testing';

import { DislikeService } from './dislike.service';

describe('DislikeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DislikeService]
    });
  });

  it('should be created', inject([DislikeService], (service: DislikeService) => {
    expect(service).toBeTruthy();
  }));
});
