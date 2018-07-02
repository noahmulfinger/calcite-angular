/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { CalciteModalService } from "./modal.service";

describe("CalciteModalService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalciteModalService]
    });
  });

  it(
    "should ...",
    inject([CalciteModalService], (service: CalciteModalService) => {
      expect(service).toBeTruthy();
    })
  );
});
