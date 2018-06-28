import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalciteCopyableTextComponent } from './copyable-text.component';

describe('CopyableTextComponent', () => {
  let component: CalciteCopyableTextComponent;
  let fixture: ComponentFixture<CalciteCopyableTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalciteCopyableTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalciteCopyableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
