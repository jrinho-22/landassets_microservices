import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, Injector, Input, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormControlName, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { merge, startWith, Subscription } from 'rxjs';
import { getErrorMessage } from 'src/app/utils/validators/validatorsMessages';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-radio',
  templateUrl: './form-radio.component.html',
  styleUrls: ['./form-radio.component.sass'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadioComponent),
      multi: true
    }, 
  ],
  imports: [MatRadioModule, CommonModule, ReactiveFormsModule,MatInputModule, MatFormFieldModule]
})
export class FormRadioComponent {
  @Input() collections: { value: any, label: string }[] = []
  @Input() formControlName!: string
  subscriptions: Subscription = new Subscription();
  myControl: AbstractControl<any, any> | undefined
  errorMsg: string = ''
  myvalue: any
  disabled: boolean = false;

  constructor(
    public controlContainer: ControlContainer,
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
  ) {}

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
}
