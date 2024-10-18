import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Injector, Input, Optional, ViewEncapsulation, forwardRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormControl, FormControlName, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MyErrorStateMatcher } from '../../../helpers/inputs/textfieldError';
import { BehaviorSubject, Subscription, merge, startWith } from 'rxjs';
import { FORM_SUBMIT } from 'src/app/tokens/formSubmitHandler';
import { getErrorMessage } from 'src/app/utils/validators/validatorsMessages';

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.sass'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }, 
  ],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
})
export class FormSelectComponent implements ControlValueAccessor{
  @Input() placeholder: string = "Select a option"
  @Input() disabled: boolean = false
  @Input() value: string = 'value'
  @Input() label: string = 'label'
  @Input() options: any = [{label: '123', value: 123}, {label: '123', value: 321}] 
  @Input() formControlName!: string
  subscriptions: Subscription = new Subscription();
  myvalue: any
  myControl: AbstractControl<any, any> | undefined
  errorMsg: string = ''
  matcher = new MyErrorStateMatcher()

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.myvalue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl | null | FormControlName = this.injector.get(NgControl, null);
    if (ngControl) {
      this.myControl = (ngControl?.control || this.controlContainer.control?.get(this.formControlName)) as FormControl
      this.subscribeToChanges()
    }
    this.cdRef.detectChanges();
  }
  
  subscribeToChanges() {
    if (this.myControl) {
      const mysub = merge(
        this.myControl.valueChanges,
        this.myControl.statusChanges.pipe(startWith(this.myControl.status))
      ).subscribe((v) => {
        this.errorMsg = (getErrorMessage((this.myControl as AbstractControl)) as string)
      });
      this.subscriptions.add(mysub);
    }
  }

  constructor(
    @Optional() public controlContainer: ControlContainer,
    @Inject(FORM_SUBMIT)
    private formSubmitted: BehaviorSubject<{ formSubmitted: boolean }>,
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
  ) {
    this.formSubmitted.subscribe(v => {
      if (v.formSubmitted) {
        this.matcher.form = this.controlContainer;
      }
    })
  }
}
