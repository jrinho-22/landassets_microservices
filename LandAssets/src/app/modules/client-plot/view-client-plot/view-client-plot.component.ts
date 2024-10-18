import { Component, Inject } from '@angular/core';
import { baseRoute } from '../routes';
import { SalesModel } from '../models/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { BehaviorSubject } from 'rxjs';
import { MODAL_BUY_PLOT_VALUES } from 'src/app/tokens/modal-token';
import ISale from 'src/app/interfaces/ISale';
import IPlot from 'src/app/interfaces/IPlot';

@Component({
  selector: 'app-view-client-plot',
  templateUrl: './view-client-plot.component.html',
  styleUrls: ['./view-client-plot.component.sass'],
  providers: [SalesModel],
})
export class ViewClientPlotComponent {
  collection: Array<any> | undefined = undefined
  basePath: string = baseRoute;
  headers: any[] = [
    { field: 'plot.number', label: 'Plot Number' },
    { field: 'totalCost', label: 'Total Price',  render: (v: number) => 'R$ ' + v.toLocaleString('pt-BR')  },
    { field: 'installmentCost', label : 'Installment Price',  render: (v: number) => 'R$ ' + v.toLocaleString('pt-BR') },
    { field: 'remainingInstallments', label: 'Remaining installments' },
    { field: 'totalInstallments', label: 'Total Installments'},
  ];

  constructor(
    @Inject(MODAL_BUY_PLOT_VALUES)
    private modalBuyPlotValues: BehaviorSubject<ISale>,
    public salesModel: SalesModel,
    public dialog: MatDialog,
  ) { }

  async openDialog(sale: ISale) {
    const { ModalPaymentComponent } = await import('../modals/payment/payment.component')
    const currentModalValues = this.modalBuyPlotValues.getValue()
    this.modalBuyPlotValues.next({
      ...currentModalValues,
      plotId: (sale.plot as IPlot).plotId,
      plot: sale.plot,
      totalCost: sale.totalCost,
      totalInstallments: sale.totalInstallments
    })

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        size: 'lg',
        component: ModalPaymentComponent,
        text: { title: 'Plot Payment', action: 'CONFIRM', close: 'CANCEL' },
      } ,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was sed');
    });
  }

  ngOnInit() {
    this.salesModel.getPlotsByUser().subscribe((v: ISale[]) => {
      this.collection = v
    });
  }
}
