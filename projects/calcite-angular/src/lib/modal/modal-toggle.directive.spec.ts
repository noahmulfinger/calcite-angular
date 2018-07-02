/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { CalciteModalToggleDirective } from "./modal-toggle.directive";
import { CalciteModalService } from "./modal.service";

describe("CalciteModalToggleDirective", () => {
  it("should create an instance", () => {
    const directive = new CalciteModalToggleDirective(
      new CalciteModalService()
    );
    expect(directive).toBeTruthy();
  });
});
