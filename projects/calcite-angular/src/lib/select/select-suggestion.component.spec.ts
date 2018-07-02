/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CalciteSelectSuggestionComponent } from "./select-suggestion.component";

describe("CalciteSelectSuggestionComponent", () => {
  let component: CalciteSelectSuggestionComponent;
  let fixture: ComponentFixture<CalciteSelectSuggestionComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CalciteSelectSuggestionComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalciteSelectSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});
