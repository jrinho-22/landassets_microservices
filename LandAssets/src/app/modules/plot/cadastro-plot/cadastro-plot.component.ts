import { Component } from '@angular/core';
import { PlotModel } from '../models/plot.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import IPlot from 'src/app/interfaces/IPlot';
import { EstateModel } from '../models/estate.service';
import IState from 'src/app/interfaces/IState';
import { MatSnackBar } from '@angular/material/snack-bar';
import IFormParent from 'src/app/interfaces/IFormParent';
import { convertMoneyFormat } from 'src/app/helpers/inputs/moneyMaskConverter';

@Component({
  selector: 'app-cadastro-plot',
  templateUrl: './cadastro-plot.component.html',
  styleUrls: ['./cadastro-plot.component.sass'],
  providers: [EstateModel]
})
export class CadastroPlotComponent implements IFormParent<IPlot>{
  plotForm: FormGroup<{ [key in keyof Omit<IPlot, 'plotId'>]: FormControl }>;
  states: IState[] = []

  constructor(
    private formBuilder: FormBuilder,
    protected plotModel: PlotModel,
    private stateModel: EstateModel,
  ) {
    this.plotForm = this.formBuilder.group({
      estateId: ['', Validators.required],
      number: ['', Validators.required],
      pricePerSQM: ['', Validators.required],
      size: ['', Validators.required],
      priceSQMPartialPayment: ['', Validators.required],
      totalCashPrice: ['', Validators.required],
      totalPartialPaymentPrice: ['', Validators.required],
      firstInstallment: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getStates()
  }

  getStates() {
    this.stateModel.getData('').subscribe((states: IState[]) => {
      this.states = states
    })
  }

  beforeLoad(data: IPlot) {
    return { ...data, estateId: data['estate']?.estateId }
  }

  beforePost(data: FormGroup){
    // if text field has been edited will be string, if not it will be what came from back
    const newData = {
      ...data.value,
      totalCashPrice: convertMoneyFormat(data.value.totalCashPrice),
      totalPartialPaymentPrice: convertMoneyFormat(data.value.totalPartialPaymentPrice),
      firstInstallment: convertMoneyFormat(data.value.firstInstallment),
      pricePerSQM: convertMoneyFormat(data.value.pricePerSQM),
      priceSQMPartialPayment: convertMoneyFormat(data.value.priceSQMPartialPayment)
    }
    return newData
  }
}
