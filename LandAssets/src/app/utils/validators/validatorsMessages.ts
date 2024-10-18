import { AbstractControl, ValidationErrors } from "@angular/forms";

export const getErrorMessage = (control: AbstractControl<any, any>): string | undefined => {
    if (control.hasError('required')) {
       return 'Field required'
    }
    if (control.hasError('email')) {
       return 'Not a valid email'
    }
    if (control.hasError('requiredRadio')) {
      return 'Selecione uma opção'
   }
    if (control.hasError('minValue')) {
      const error: ValidationErrors  | null = control.errors
      return `valor minimo: ${error?.["minValue"]}`;
   }
   if (control.hasError('maxValue')) {
      const error: ValidationErrors  | null = control.errors
      return `valor máximo: ${error?.["maxValue"]}`;
   }

    return undefined
}