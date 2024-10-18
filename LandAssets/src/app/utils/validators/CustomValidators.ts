import { ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable, map } from "rxjs";

export class CustomValidators {
  static currencyMasked = (minValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      var value: string | number = control.value;
      var trueValue: number
      if (!value) {
        return null;
      }
      if (typeof value == 'number') {
        trueValue = value
      }
      value = String(value)
      trueValue = parseFloat(value.replace("$", "").replace(",", "").trim())

      return trueValue < minValue ? { minValue: true } : null;
    };
  }

  static requiredIf = (required: Observable<boolean>): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return required.pipe(
        map((response => { return response && !control.value ? { required: true } : null })))
    }
  }

  static radioType = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      var value: string | number = control.value;
      if (value == 'full_payment' || value == 'partial_payment') {
        return null
      }

      return { requiredRadio: true }
    }
  }

  static maxValue = (maxValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      var value: number = control.value;
      if (!value) {
        return null;
      }
      if (value > maxValue) {
        return { maxValue: maxValue }
      }
      return null
    }
  }

  static minValue = (minValue: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      var value: number = control.value;
      if (!value) {
        return null;
      }
      if (value < minValue) {
        return { minValue: minValue }
      }
      return null
    }
  }
}