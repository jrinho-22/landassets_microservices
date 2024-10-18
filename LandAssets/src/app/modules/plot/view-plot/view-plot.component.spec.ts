import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlotComponent } from './view-plot.component';

describe('ViewPlotComponent', () => {
  let component: ViewPlotComponent;
  let fixture: ComponentFixture<ViewPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPlotComponent]
    });
    fixture = TestBed.createComponent(ViewPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
