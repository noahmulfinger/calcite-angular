/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CalciteSelectComponent } from "./select.component";
import { CalciteSelectedOptionComponent } from "./selected-option.component";
import { CalciteSelectSuggestionComponent } from "./select-suggestion.component";

describe("CalciteSelectComponent", () => {
  let component: CalciteSelectComponent;
  let fixture: ComponentFixture<CalciteSelectComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          CalciteSelectComponent,
          CalciteSelectedOptionComponent,
          CalciteSelectSuggestionComponent
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalciteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});
