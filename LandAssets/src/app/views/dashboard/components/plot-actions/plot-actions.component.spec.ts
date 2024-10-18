import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotActionsComponent } from './plot-actions.component';

describe('PlotActionsComponent', () => {
  let component: PlotActionsComponent;
  let fixture: ComponentFixture<PlotActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotActionsComponent]
    });
    fixture = TestBed.createComponent(PlotActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
