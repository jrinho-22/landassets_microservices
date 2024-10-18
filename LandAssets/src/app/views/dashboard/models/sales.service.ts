import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import resources from 'src/app/config';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import ISale from 'src/app/interfaces/ISale';
import { saleUrl } from 'src/app/helpers/urls';

@Injectable({
  providedIn: 'root'
})
export class SalesService extends HttpRequestService<ISale> {

  constructor(http: HttpClient, snackbarService: SnackbarService) {
    super(http, snackbarService);
  }

  config() {
    return {
      resource: '',
      apiUrl: saleUrl
    };
  }
}
