import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientPlotComponent } from './view-client-plot.component';

describe('ViewClientPlotComponent', () => {
  let component: ViewClientPlotComponent;
  let fixture: ComponentFixture<ViewClientPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewClientPlotComponent]
    });
    fixture = TestBed.createComponent(ViewClientPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
