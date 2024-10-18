import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPlotComponent } from './cadastro-plot.component';

describe('CadastroPlotComponent', () => {
  let component: CadastroPlotComponent;
  let fixture: ComponentFixture<CadastroPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroPlotComponent]
    });
    fixture = TestBed.createComponent(CadastroPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
