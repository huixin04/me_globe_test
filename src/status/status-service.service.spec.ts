/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StatusServiceService } from './status-service.service';

describe('Service: StatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusServiceService]
    });
  });

  it('should ...', inject([StatusServiceService], (service: StatusServiceService) => {
    expect(service).toBeTruthy();
  }));
});
