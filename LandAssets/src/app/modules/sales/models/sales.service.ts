import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import resources from 'src/app/config';
import { saleUrl } from 'src/app/helpers/urls';
import ISale from 'src/app/interfaces/ISale';
import IUser from 'src/app/interfaces/IUser';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Injectable()
export class SalesModel extends HttpRequestService<ISale> {
  _user!: IUser

  constructor(http: HttpClient, snackbarService: SnackbarService, authService: AuthService) {
    super(http, snackbarService);
    authService.authenticated$.subscribe(v => {
      this._user = v.user as IUser
    })
  }

  config() {
    return {
      resource: '',
      apiUrl: saleUrl
    };
  }
}
