import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { InputmaskOptions } from '@ngneat/input-mask';
import { cardNumberMask, cardValidadeMask, cardCodigoMask } from 'src/app/utils/masks/currency';
import { MODAL_BUY_PLOT_VALUES } from 'src/app/tokens/modal-token';
import ISale from 'src/app/interfaces/ISale';
import { PaymentModel } from '../../models/payment.service';
import IFormParent from 'src/app/interfaces/IFormParent';
import { CustomValidators } from 'src/app/utils/validators/CustomValidators';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass'],
  providers: [PaymentModel]
})
export class ModalPaymentComponent implements IFormParent<{}> {
  modalForm: FormGroup;
  cardNumberMask: InputmaskOptions<unknown> = cardNumberMask
  cardValidadeMask: InputmaskOptions<unknown> = cardValidadeMask
  cardCodigoMask: InputmaskOptions<unknown> = cardCodigoMask
  radioValues = [{ value: 'full_payment', label: 'Full Payment' }, { value: 'partial_payment', label: 'Installment Payment' }]
  @ViewChild('myForm', { read: ViewContainerRef }) myForm!: ViewContainerRef;
  plotId: any;

  constructor(
    @Inject(MODAL_BUY_PLOT_VALUES)
    private modalBuyPlotValues: BehaviorSubject<ISale>,
    public paymentModel: PaymentModel,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
  ) {
    this.modalForm = this.formBuilder.group({
      plotNumber: [{ value: '', disabled: true }],
      stateName: [{ value: '', disabled: true }],
      totalPrice: [{ value: '', disabled: true }],
      installmentPrice: [{ value: '', disabled: true }],
      fullPayment: ['', CustomValidators.radioType()]
    });

    this.modalBuyPlotValues.subscribe((v: ISale) => {
      this.plotId = v.plotId
      if (v.plot?.number !== undefined)
        this.modalForm.patchValue({ plotNumber: v.plot.number });
      if (v.plot?.estate !== undefined)
        this.modalForm.patchValue({ stateName: v.plot.estate.name });
      if (v.totalCost !== undefined)
        this.modalForm.patchValue({ totalPrice: v.totalCost });
      if (v.totalCost && v.totalInstallments) {
        this.modalForm.patchValue({ installmentPrice: v.totalCost / v.totalInstallments });
      } else this.modalForm.patchValue({ installmentPrice: 0 });
    });
  }

  async submit() {
    let modalFormValues = {
      ...this.modalForm.value,
      fullPayment: this.modalForm.controls['fullPayment'].value == 'full_payment' ? true : false
    }
    this.paymentModel.makePayment({
      plotId: this.plotId, fullPayment: modalFormValues.fullPayment
    }).subscribe({
      complete: () => {
        this.snackbarService.openSnack({
          panel: 'success', message: 'Pagamento realizado com SUCESSO', menuMargin: false
        })
        this.reload()
      }
    }
    )
  }

  reload() {
    setTimeout(() => {
      window.location.reload()
    }, 1200);
  }
}
