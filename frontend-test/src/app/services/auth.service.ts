import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';

export interface ITokenDto {
    auth_token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
    constructor(
        private http: HttpClient,
    ) { }

    private handleAuthError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 0) {
            console.error('Network error: ' + error.error);
        } else {
            console.error('Backend returned status ' + error.status + ': ' + error.error);
        }
        return throwError(() => {
            new Error('Failed to get client response');
        });
    }

    authorizeUser(): Observable<ITokenDto> {
        const httpAuthGet = 'http://localhost:3000/auth/42';
        const auth$ = this.http.get<ITokenDto>(httpAuthGet, {
            observe: 'body',
            responseType: 'json',
        }).pipe(
            catchError(this.handleAuthError),
        )
        
        return auth$;
    }

    getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }
}
