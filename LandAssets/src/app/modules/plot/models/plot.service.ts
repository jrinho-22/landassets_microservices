import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import resources from 'src/app/config';
import IPlot from 'src/app/interfaces/IPlot';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import { saleUrl, service1Url } from 'src/app/helpers/urls';

@Injectable({
  providedIn: 'root'
})
export class PlotModel  extends HttpRequestService<IPlot> {

  constructor(http: HttpClient, snackbarService: SnackbarService) {
    super(http, snackbarService);
  }

  config() {
    return {
      resource: resources.PLOT,
      apiUrl: service1Url
    };
  }

  dataByState(stateId: number) :Observable<IPlot[]> {
    return this.http.get<IPlot[]>(`${this.updatedUrl}`, {params: {"estate.estateId": stateId}, headers: this._headers});
  }
}
