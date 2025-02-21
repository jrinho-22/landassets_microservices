import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FORM_SUBMIT } from 'src/app/tokens/formSubmitHandler';
import { CustomValidators } from 'src/app/utils/validators/CustomValidators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  loginForm: BehaviorSubject<boolean> = new BehaviorSubject(true)
  loginFormObs$: Observable<boolean> = this.loginForm.asObservable()
  loginData: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    protected AuthService: AuthService,
    @Inject(FORM_SUBMIT)
    private formSubmitted: BehaviorSubject<{ formSubmitted: boolean }>
  ) {     
    this.loginData = this.formBuilder.group({
      name: ['', [], CustomValidators.requiredIf(this.checkIfSignUp())],
      email: ['admin@gmail.com',[ Validators.required, Validators.email]],
      password: ['123', Validators.required]
    });
  }

  checkIfSignUp(): Observable<boolean> {
    return this.loginFormObs$.pipe(take(1), map(v => !v))
  }

  change() {
    this.loginForm.next(!this.loginForm.getValue())
    this.loginData.reset()
  }

  requiredIfFun() {
    return !this.loginForm
  }

  login() {
    this.validCheck() &&
      this.AuthService.signIn(
        this.loginData.value['email'],
        this.loginData.value['password']
      )
  }


  signUp() {
    this.validCheck() && this.AuthService.signUp({...this.loginData.value, admin: false})
  }

  validCheck() {
    this.formSubmitted.next({
      formSubmitted: true
    })
    this.loginData.markAllAsTouched()
    if (this.loginData.status == 'VALID') {
      return true
    } return false

  }
}
