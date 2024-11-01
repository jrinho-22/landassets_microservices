import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import resources from 'src/app/config';
import { saleUrl } from 'src/app/helpers/urls';
import ISale from 'src/app/interfaces/ISale';
import IUser from 'src/app/interfaces/IUser';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Injectable()
export class PaymentModel extends HttpRequestService<any> {
  _user!: IUser

  constructor(http: HttpClient, snackbarService: SnackbarService, authService: AuthService) {
    super(http, snackbarService);
    authService.authenticated$.subscribe(v => {
      this._user = v.user as IUser
    })
  }

  makePayment(formData: FormGroup | FormData | Record<string, any>): Observable<ISale[]> {
    return this.http.post<ISale[]>(`${this.updatedUrl}/${this._user?.userId}`, formData, {
      headers: this._headers,
    });
  }

  config() {
    return {
      resource: resources.PAYMENT,
      apiUrl: saleUrl
    };
  }
}
