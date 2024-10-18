import { ControlContainer, FormControl, FormGroupDirective, FormGroupName, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public form!: ControlContainer

  isErrorState(control: FormControl | null): boolean {
    let submitted: boolean = false
    if (this.form instanceof FormGroupDirective) {
      submitted = this.form.submitted
    }
    if (this.form instanceof FormGroupName) {
      submitted = (this.form.formDirective as FormGroupDirective).submitted
    }
    return !!(control && control.invalid && submitted);
  }
}