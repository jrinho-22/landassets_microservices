import { Injectable } from '@angular/core';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import { HttpClient } from '@angular/common/http';
import resources from '../../../config';
import IPlot from 'src/app/interfaces/IPlot';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { service1Url } from 'src/app/helpers/urls';

@Injectable()
export class PlotModel extends HttpRequestService<IPlot> {

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
