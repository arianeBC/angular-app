import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email, 
            resData.localId, 
            resData.idToken,
            +resData.expiresIn, 
          );
        })
      );
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
      .pipe(
        catchError(this.handleError), 
        tap(resData => {
          this.handleAuthentication(
            resData.email, 
            resData.localId, 
            resData.idToken,
            +resData.expiresIn, 
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/connexion']);
  }

  private handleAuthentication(
    email: string, 
    userId: string, 
    token: string, 
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
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