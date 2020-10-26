import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map(resData => {
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            return new AuthActions.Login({
              email: resData.email, 
              userID: resData.localId, 
              token: resData.idToken, 
              expirationDate: expirationDate
            })
          }),
          catchError(errorRes => {
            let errorMessage = 'Désolé, une erreur est survenue'
            if(!errorRes.error || !errorRes.error.error) {
              return of(new AuthActions.LoginFail(errorMessage));
            }
            switch(errorRes.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'Cette adresse e-mail est déjà enregistrée';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = "Votre nom d'utilisateur ou votre mot de passe ne correspondent pas. Veuillez réessayer.";
                break;
              case 'INVALID_PASSWORD':
                errorMessage = "Votre nom d'utilisateur ou votre mot de passe ne correspondent pas. Veuillez réessayer.";
                break;
            }
            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN), 
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions, 
    private http: HttpClient,
    private router: Router
  ) { }
}