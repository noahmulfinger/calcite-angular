/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CalciteSelectedOptionComponent } from "./selected-option.component";

describe("CalciteSelectedOptionComponent", () => {
  let component: CalciteSelectedOptionComponent;
  let fixture: ComponentFixture<CalciteSelectedOptionComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CalciteSelectedOptionComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalciteSelectedOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});
