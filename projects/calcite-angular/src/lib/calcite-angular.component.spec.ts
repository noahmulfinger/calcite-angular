import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalciteAngularComponent } from './calcite-angular.component';

describe('CalciteAngularComponent', () => {
  let component: CalciteAngularComponent;
  let fixture: ComponentFixture<CalciteAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalciteAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalciteAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
