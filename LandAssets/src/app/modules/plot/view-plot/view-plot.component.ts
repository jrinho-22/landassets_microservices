import { Component } from '@angular/core';
import IPlot from 'src/app/interfaces/IPlot';
import { PlotModel } from '../models/plot.service';
import { baseRoute } from '../routes';

@Component({
  selector: 'app-view-plot',
  templateUrl: './view-plot.component.html',
  styleUrls: ['./view-plot.component.sass']
})
export class ViewPlotComponent {
  plot: IPlot[] | undefined = undefined;
  headers: any[] = [
    { field: 'number', label: 'Number' },
    { field: 'size', label: 'Size', render: (v: number) => v.toLocaleString('pt-BR') + ' m2' },
    { field: 'estate.name', label: 'Estado' },
    { field: 'totalCashPrice', label: 'Total Cash Price', render: (v: number) => 'R$' + v.toLocaleString('pt-BR') },
    { field: 'totalPartialPaymentPrice', label: 'Total Partial Payment Price', render: (v: number) => 'R$' + v.toLocaleString('pt-BR') }
  ];
  basePath: string = '';

  constructor(public plotModel: PlotModel) {}

  ngOnInit() {
    this.basePath = baseRoute
    this.plotModel.getData('').subscribe((v: IPlot[]) => (this.plot = v));
  }
}
