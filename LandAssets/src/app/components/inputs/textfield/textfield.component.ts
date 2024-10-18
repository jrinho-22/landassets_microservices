import { Component, Input, forwardRef, ViewEncapsulation, Injector, Optional, Inject, ChangeDetectorRef, numberAttribute } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, ControlContainer, FormControl, FormControlName, FormGroupDirective, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../helpers/inputs/textfieldError';
import { CommonModule } from '@angular/common';
import { InputMaskModule, InputmaskOptions } from '@ngneat/input-mask';
import { BehaviorSubject, Subscription, merge, startWith } from 'rxjs';
import { getErrorMessage } from 'src/app/utils/validators/validatorsMessages';
import { FORM_SUBMIT } from 'src/app/tokens/formSubmitHandler';
import { currencyInputMask } from 'src/app/utils/masks/currency';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.sass'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextfieldComponent),
      multi: true
    },

  ],
  imports: [MatProgressSpinnerModule, InputMaskModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, CommonModule],
})
export class TextfieldComponent implements ControlValueAccessor {
  @Input() mask: any
  @Input({ transform: numberAttribute }) maxLenght: number | undefined
  @Input({ transform: numberAttribute }) maxValue: number | undefined
  @Input() placeholder: string = ""
  @Input() disabled: boolean = false
  @Input() type: 'text' | 'number' | 'numeric' = 'text'
  @Input() password: boolean = false
  @Input() suffix: string | undefined
  @Input() value: string | number | null = null;
  @Input() appearance: "outline" | "fill" = 'fill';
  @Input() formControlName!: string
  ngForm!: FormGroupDirective | null
  suffixAply: string | undefined = ''
  myControl: AbstractControl<any, any> | undefined
  errorMsg: string = ''
  subscriptions: Subscription = new Subscription();
  matcher = new MyErrorStateMatcher()
  currencyInputMask: InputmaskOptions<unknown> = currencyInputMask
  loading = true

  onChange: any = () => { };
  onTouch: any = () => { };

  applyMask() {
    if (this.mask) {
      return this.mask
    }
    if (this.type == 'numeric') {
      return this.currencyInputMask
    }

    return
  }

  constructor(
    @Optional() public controlContainer: ControlContainer,
    @Inject(FORM_SUBMIT)
    private formSubmitted: BehaviorSubject<{ formSubmitted: boolean }>,
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
  ) {
    setTimeout(() => {
      this.loading = false      
    }, 1400);
    this.formSubmitted.subscribe(v => {
      if (v.formSubmitted) {
        this.matcher.form = this.controlContainer;
      }
    })
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  blockText(event: KeyboardEvent) {
    if (this.type == 'number') {
      const allowedKeys = ['Backspace', 'Delete', 'Enter'];
      return allowedKeys.includes(event.key) || /^[0-9]$/.test(event.key);
    }
    return true
  }

  onFocus(): void {
    this.suffixAply = this.suffix
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let cursorPosition = inputElement.selectionStart;
    const getDotComma = (value: string) => value.match(/[,.]/g)
    const startDots = getDotComma(inputElement.value)

    if (this.type == 'numeric') {
      let value = inputElement.value.replaceAll(".", "").replaceAll(",", "").replaceAll("$", "").trim();
      let decimals = value.slice(-2)
      value = value.slice(0, -2)
      if (this.maxValue && Number(value) > this.maxValue) {
        value = value.slice(0, -1)
      }
      inputElement.value = value + '.' + decimals
    }

    if (this.type == 'number') {
      let value = inputElement.value.replaceAll(",", "").replaceAll(".", "");
      if (this.maxValue && Number(value) > this.maxValue) {
        value = value.slice(0, -1)
      }
      value ? inputElement.value = Number(value).toLocaleString('pt-BR') : inputElement.value = ''
      this.onChange(value);
      this.onTouch();
    }

    const endDots = getDotComma(inputElement.value)
    const dif = (endDots?.length || 0) - (startDots?.length || 0);
    const rangeAfterfix = (cursorPosition || 0) + dif < 0 ? 0 : (cursorPosition || 0) + dif

    inputElement.setSelectionRange(rangeAfterfix, rangeAfterfix);
  }

  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (!value) this.suffixAply = undefined
  }

  getValue() {
    if (this.type == 'number'){
      this.value = (this.value as number).toLocaleString('pt-BR');
      return this.suffix ? String(this.value + ' ' + this.suffix) : this.value
    }
    return this.value
  }

  writeValue(value: any): void {
    if (this.type == 'number') this.value = value.toLocaleString('pt-BR');
    if (value) this.suffixAply = this.suffix
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
}
