import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, combineLatest, combineLatestWith, concat, concatMap, delay, from, interval, map, of, retry, retryWhen, switchMap, takeWhile, tap, throwError, timer } from 'rxjs';
import { FormGroup } from '@angular/forms';
import resources from '../config/resources';
import { SnackbarService } from './snackbar.service';
import { count } from 'console';

@Injectable()
export abstract class HttpRequestService<T> {
  // protected _apiUrl: string = environment.API_URL;
  // protected _apiUrl: string
  static _connected = { service1: false, auth: false, sales: false }
  private _config: { resource: string, apiUrl: string } = { resource: '', apiUrl: '' };
  private _token: string | null;
  protected _headers: HttpHeaders | undefined;

  constructor(protected http: HttpClient, protected snackbarService: SnackbarService) {
    this._config = this.config();
    this._token = localStorage.getItem('token');
    if (!HttpRequestService._connected.auth && !HttpRequestService._connected.sales && !HttpRequestService._connected.sales) {
      this.connect()
    }

    if (this._token) {
      this._headers = new HttpHeaders({
        Authorization: `Bearer ${this._token}`,
      });
    }
  }

  get updatedUrl() {
    return this._config.resource.length ?
      `${this._config.apiUrl}/${this._config.resource}` :
      `${this._config.apiUrl}`
  }

  // typeof resources[keyof typeof resources] accept all return types containning in resources
  abstract config(): { resource: typeof resources[keyof typeof resources], apiUrl: string };

  connect() {
    console.log("connectttt", this.config())
    const observables = [
      this.http.get<{ value: "Connected" }>(`api/sales/connection`, { headers: this._headers }),
      this.http.get<{ value: "Connected" }>(`api/auth/connection`, { headers: this._headers }),
      this.http.get<{ value: "Connected" }>(`api/service1/connection`, { headers: this._headers }),
    ];

    interval(5000).pipe(
      combineLatestWith(...observables),
      // takeWhile(() => !HttpRequestService._connected.auth && !HttpRequestService._connected.sales && !HttpRequestService._connected.sales),
      tap(([interval, sales, auth, service1]) => {
        console.log(interval, sales)
        if (sales.value == "Connected") HttpRequestService._connected.sales = true
        if (auth.value == "Connected") HttpRequestService._connected.auth = true
        if (service1.value == "Connected") HttpRequestService._connected.service1 = true
      }),
      retry({count: 55, delay: (error: HttpErrorResponse) => {
        return timer(3000);
      } }),
      catchError(error => of([]))
    ).subscribe({
      next: (value) => console.log(value),
      error: (error => console.log(error, 'erroo')),
      complete: () => console.log('Complete'),
    });
  }

  getData(params?: any): Observable<T[]> {
    return this.http.get<T[]>(`${this.updatedUrl}`, {
      headers: this._headers,
      params: params,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackbarService.openSnack({
          panel: 'error', message: error.error.message || `Erro loading ${this._config.resource}`
        })
        window.location.reload();
        return throwError(() => error);
        // .pipe(
        //   delay(3000)  // 2000 milliseconds = 2 seconds
        // );
      })
    );
  }

  getItem(id: string | number, params?: any): Observable<T> {
    return this.http.get<T>(`${this.updatedUrl}/${id}`, {
      headers: this._headers,
      params: params,
    });
  }

  getDataa(): Observable<Blob> {
    return this.http.get(this.updatedUrl, { responseType: 'blob' });
  }

  deleteData(id: string): Observable<T> {
    return this.http.delete<T>(`${this.updatedUrl}/${id}`, {
      headers: this._headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackbarService.openSnack({ panel: 'error', message: error.error.message })
        return throwError(() => new Error('Error from catchError'));
      })
    );
  }

  postData(formData: FormGroup | FormData | Record<string, any>): Observable<T> {
    return this.http.post<T>(this.updatedUrl, formData, {
      headers: this._headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        // Here we log the error to verify it is caught
        console.log('Caught in catchError', error);
        this.snackbarService.openSnack({ panel: 'error', message: error.error.message })
        return throwError(() => new Error('Error from catchError'));
      })
    );
  }

  putData(id: number | string, formData: FormGroup | FormData | Record<string, any>): Observable<T> {
    return this.http.put<T>(`${this.updatedUrl}/${id}`, formData, {
      headers: this._headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackbarService.openSnack({ panel: 'error', message: error.error.message })
        return throwError(() => new Error('error'));
      })
    );;
  }
}
