import { Component } from '@angular/core';
import { SalesModel } from '../models/sales.service';
import ISale from 'src/app/interfaces/ISale';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.sass'],
  providers: [SalesModel]
})
export class ViewSalesComponent {
  collection: ISale[] | undefined = undefined;
  headers: any[] = [
    { field: 'users.email', label: 'User email' },
    { field: 'plot.plotId', label: 'Plot Id' },
    { field: 'totalCost', label: 'Total Cost' },
    { field: 'remainingInstallments', label: 'Fully Paid', render: (v: number) => v == 0 ? 'Yes' : 'No' }
  ];
  basePath: string = '';

  constructor(protected salesModel: SalesModel) {
    salesModel.getData().subscribe(v => {
      this.collection = v
    })
  }
}
