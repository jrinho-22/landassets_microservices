import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentComponent } from './payment.component';

describe('ModalPaymentComponent', () => {
  let component: ModalPaymentComponent;
  let fixture: ComponentFixture<ModalPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPaymentComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
