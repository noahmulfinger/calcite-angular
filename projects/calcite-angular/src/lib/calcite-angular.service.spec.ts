import { TestBed, inject } from '@angular/core/testing';

import { CalciteAngularService } from './calcite-angular.service';

describe('CalciteAngularService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalciteAngularService]
    });
  });

  it('should be created', inject([CalciteAngularService], (service: CalciteAngularService) => {
    expect(service).toBeTruthy();
  }));
});
