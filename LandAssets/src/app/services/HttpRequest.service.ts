import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import resources from '../config/resources';
import { SnackbarService } from './snackbar.service';
import { environment } from 'src/environments/environment';

@Injectable()
export abstract class HttpRequestService<T> {
  // protected _apiUrl: string = environment.API_URL;
  // protected _apiUrl: string
  private _config: { resource: string, apiUrl: string } = { resource: '', apiUrl: '' };
  private _token: string | null;
  protected _headers: HttpHeaders | undefined;

  constructor(protected http: HttpClient, protected snackbarService: SnackbarService) {
    this._config = this.config();
    this._token = localStorage.getItem('token');

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
  abstract config(): { resource: (typeof resources)[keyof typeof resources], apiUrl: string };

  getData(params?: any): Observable<T[]> {
    return this.http.get<T[]>(`${this.updatedUrl}`, {
      headers: this._headers,
      params: params,
    });
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
