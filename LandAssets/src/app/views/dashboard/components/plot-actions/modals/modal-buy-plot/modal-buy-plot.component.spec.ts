import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuyPlotComponent } from './modal-buy-plot.component';

describe('ModalBuyPlotComponent', () => {
  let component: ModalBuyPlotComponent;
  let fixture: ComponentFixture<ModalBuyPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBuyPlotComponent]
    });
    fixture = TestBed.createComponent(ModalBuyPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
