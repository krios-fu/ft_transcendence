import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthInfo } from '../interfaces/iauth-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
    constructor(
        private http: HttpClient,
    ) { }

    authUser(authCode: string): Observable<HttpResponse<IAuthInfo>> {
        const httpAuthGet = 'http://localhost:3000/auth/42';
        const auth$ = this.http.get<IAuthInfo>(
            httpAuthGet, {
                params: {
                    code: authCode,
                },
                observe: 'response',
                responseType: 'json'
            }
        );

        return auth$;
    }

    setAuth(token: string): void {
        console.log(token);
        sessionStorage.setItem('auth_token', token);
    }

    getAuthToken(): string | null {
        return sessionStorage.getItem('auth_token');
    }
}
