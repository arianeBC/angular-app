import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({providedIn:'root'})
export class AuthService {

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBjF_me0299D9WO6zR-TWa8XqaByw7wOz4', 
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBjF_me0299D9WO6zR-TWa8XqaByw7wOz4'
        ,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Désolé, une erreur est survenue'
    if(!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Cette adresse e-mail est déjà enregistrée';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "Votre nom d'utilisateur et votre mot de passe ne correspondent pas. Veuillez réessayer.";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = "Votre nom d'utilisateur et votre mot de passe ne correspondent pas. Veuillez réessayer.";
        break;
    }
    return throwError(errorMessage);
  }
}