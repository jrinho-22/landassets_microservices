import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormRecord,
  Validators,
} from '@angular/forms';
import { EstateModel } from 'src/app/views/dashboard/models/estate.service';
import { MODAL_BUY_PLOT_VALUES } from '../../../../../../tokens/modal-token';
import { BehaviorSubject, Observable, combineLatestWith, take } from 'rxjs';
import IModalBuyPlotValues from 'src/app/interfaces/plot-actions/IModalBuyPlotValues';
import { SalesService } from 'src/app/views/dashboard/models/sales.service';
import { AuthService } from 'src/app/services/auth.service';
import { InputmaskOptions } from '@ngneat/input-mask';
import { cardCodigoMask, cardNumberMask, cardValidadeMask } from 'src/app/utils/masks/currency';
import ISale from 'src/app/interfaces/ISale';
import IFormParent from 'src/app/interfaces/IFormParent';
import { CustomValidators } from 'src/app/utils/validators/CustomValidators';

@Component({
  selector: 'app-modal-buy-plot',
  templateUrl: './modal-buy-plot.component.html',
  styleUrls: ['./modal-buy-plot.component.sass'],
  providers: [EstateModel],
})
export class ModalBuyPlotComponent implements IFormParent<ISale> {
  modalForm!: FormGroup;
  saleForm!: FormGroup;
  partialPaymentSub = new BehaviorSubject<boolean>(false)
  paymentControl!: AbstractControl | null
  totalInstallments!: AbstractControl | null;
  stateArray!: FormRecord;
  paymentTypeCollection: Array<any> = []
  userId: any
  plotId: any
  cardNumberMask: InputmaskOptions<unknown> = cardNumberMask
  cardValidadeMask: InputmaskOptions<unknown> = cardValidadeMask
  cardCodigoMask: InputmaskOptions<unknown> = cardCodigoMask

  @ViewChild('myForm', { read: ViewContainerRef }) myForm!: ViewContainerRef;

  constructor(
    @Inject(MODAL_BUY_PLOT_VALUES)
    private modalBuyPlotValues: BehaviorSubject<IModalBuyPlotValues>,
    private formBuilder: FormBuilder,
    protected EstateModel: EstateModel,
    protected SaleModel: SalesService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.paymentTypeCollection = this.paymentType()
    this.modalForm = this.formBuilder.group({
      plotNumber: [{ value: '', disabled: true }],
      stateName: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
      cardNumber: ['', Validators.required],
      validade: ['', Validators.required],
      codigoSeguranca: ['', Validators.required],
      saleForm: this.formBuilder.group({
        paymentType: ['', [Validators.required]],
        totalInstallments: ['', [CustomValidators.maxValue(34), CustomValidators.minValue(2)]],
        totalCost: [{ value: '', disabled: true }],
      })
    });
    this.saleForm = this.modalForm.get('saleForm') as FormGroup
    this.modalBuyPlotValuesSubscribe()
    this.paymentControl = this.saleForm.get('paymentType')
    this.totalInstallments = this.saleForm.get('totalInstallments')
    this.totalInstallments?.addAsyncValidators(CustomValidators.requiredIf(this.checkIfInstallments()))
  }

  checkIfInstallments(): Observable<boolean> {
    this.paymentControl?.valueChanges.subscribe((v: 'partial' | 'cash') => {
      const partial = v == 'partial';
      this.partialPaymentSub.next(partial),
        !partial ? (this.totalInstallments?.reset(), this.totalInstallments?.updateValueAndValidity()) : undefined
    })
    return this.partialPaymentSub.pipe(take(1))
  }

  modalBuyPlotValuesSubscribe() {
    this.partialPaymentSub.pipe(combineLatestWith(this.modalBuyPlotValues)).subscribe(([partial, plotValues]) => {
      this.plotId = plotValues.plotId
      if (plotValues.number !== undefined)
        this.modalForm.patchValue({ plotNumber: plotValues.number });
      if (plotValues.size !== undefined)
        this.modalForm.patchValue({ size: plotValues.size });
      if (plotValues.estate !== undefined)
        this.modalForm.patchValue({ stateName: plotValues.estate });
      if (plotValues.totalCashPrice !== undefined && plotValues.totalPartialPaymentPrice !== undefined)
        if (partial) {
          this.saleForm.patchValue({ totalCost: plotValues.totalCashPrice });
        } else {
          this.saleForm.patchValue({ totalCost: plotValues.totalPartialPaymentPrice });
        }

    })
  }

  ngAfterViewInit() {
    this.auth.authenticated$.subscribe(v => this.userId = v.user?.userId)
  }

  paymentType() {
    return [
      { value: 'cash', label: 'Cash Payment' },
      { value: 'partial', label: 'Partial Payment' }
    ]
  }

  beforePost(data: FormGroup): Record<string, any> {
    const modalForm = data?.get('saleForm') as FormGroup
    let rawRecord = modalForm.getRawValue() 
    if (!rawRecord.totalInstallments) rawRecord.totalInstallments = 0
    const record: Record<string, any> = {
      ...rawRecord,
      userId: this.userId,
      plotId: this.plotId
    }
    return record
  }
}
