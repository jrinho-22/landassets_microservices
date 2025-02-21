import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestService } from './HttpRequest.service';
import { getPropertyFromResource } from '../utils/typeUtil/resourceKey';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SnackbarService } from './snackbar.service';
import IUser, { IUserGuest } from '../interfaces/IUser';
import { authUrl } from '../helpers/urls';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpRequestService<String> {
  private _authenticatedSubject = new BehaviorSubject<{
    // authenticated: 'conceded' | 'denied';
    user: IUser | IUserGuest;
  }>({ user: {type: 'guest'} });

  private _authenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    http: HttpClient,
    snackbarService: SnackbarService,
    private router: Router,
  ) {
    super(http, snackbarService);

    const token = localStorage.getItem('token');
    if (token) {
      const arrayToken = token.split('.');
      const userData = JSON.parse(atob(arrayToken[1]));
      this.getUser(userData.userId).subscribe((user: IUser) => {
        if (user) {
          this._authenticatedSubject.next({user: user });
        } 
      });
    }
  }

  config() {
    return {
      resource: getPropertyFromResource('LOGIN'),
      apiUrl: authUrl,
    };
  }

  getUser(userId: number | string): Observable<IUser> {
    return this.http.get<IUser>(`${authUrl}/user/${userId}`, {
      headers: this._headers,
    }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        // if (errorResponse.error.message == "Unauthorized") {
        //   this._authenticatedSubject.next({user: {type: 'guest'} });
        // }
        this.snackbarService.openSnack({
          panel: 'error', message: `Session Expired`
        })
        localStorage.removeItem('token');
        return throwError(() => undefined);
      })
    );
  }

  signIn(email: string, pass: string) {
    this.getToken(email, pass).subscribe(
      (token: { access_token: string; user: IUser }) => {
        localStorage.setItem('token', token.access_token);
        this.authenticatedSubject.next({
          // authenticated: 'conceded',
          user: token.user,
        });
        this.router.navigate(['dashboard']);
      }
    );
  }

  signUp(form: FormGroup) {
    this.http
      .post<{ access_token: string; user: any }>(
        `${this.updatedUrl}/register`,
        form
      )
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.openSnack({ panel: 'error', message: errorResponse.error.message })
          return throwError(() => new Error('Error from catch error'));
        })
      )
      .subscribe((token: { access_token: string; user: any }) => {
        localStorage.setItem('token', token.access_token);
        this.authenticatedSubject.next({
          user: token.user,
        });
        this.router.navigate(['dashboard']);
      });
  }

  getToken(
    email: string,
    pass: string
  ): Observable<{ access_token: string; user: any }> {
    return this.http.post<{ access_token: string; user: IUser }>(
      `${this.updatedUrl}`,
      {
        email: email,
        password: pass,
      }
    ).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.snackbarService.openSnack({ panel: 'error', message: errorResponse.error.message })
        return throwError(() => new Error('User not found'));
      })
    );;
  }

  get authenticatedSubject() {
    return this._authenticatedSubject;
  }

  get authenticated$() {
    return this._authenticated$;
  }
}
