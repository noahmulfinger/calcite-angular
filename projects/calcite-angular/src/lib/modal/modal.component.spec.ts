/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CalciteModalComponent } from "./modal.component";
import { CalciteModalToggleDirective } from "./modal-toggle.directive";
import { CalciteModalService } from "./modal.service";

describe("CalciteModalComponent", () => {
  let component: CalciteModalComponent;
  let fixture: ComponentFixture<CalciteModalComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CalciteModalComponent, CalciteModalToggleDirective],
        providers: [CalciteModalService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalciteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});
