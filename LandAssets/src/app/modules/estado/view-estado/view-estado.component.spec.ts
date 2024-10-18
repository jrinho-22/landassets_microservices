import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEstadoComponent } from './view-estado.component';

describe('ViewEstadoComponent', () => {
  let component: ViewEstadoComponent;
  let fixture: ComponentFixture<ViewEstadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEstadoComponent]
    });
    fixture = TestBed.createComponent(ViewEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
