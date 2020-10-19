import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({providedIn:'root'})
export class AuthService {

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBjF_me0299D9WO6zR-TWa8XqaByw7wOz4', 
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    ).pipe(catchError(
      errorRes => {
        let errorMessage = 'Désolé, une erreur est survenue'
        if(!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch(errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'Cette adresse e-mail est déjà enregistrée';

        }
        return throwError(errorMessage);
      }
    ));
  }
}