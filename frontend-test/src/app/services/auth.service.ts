import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccessToken } from '../interfaces/iaccess-token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
    constructor(
        private http: HttpClient,
    ) { }

    authUser(authCode: string): Observable<HttpResponse<any>> {
        const httpAuthGet = 'http://localhost:3000/auth/42';
        const auth$ = this.http.get<any>
        (
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

    refreshToken(): Observable<HttpResponse<IAccessToken>> {
        const tokenEndpoint = 'http://localhost:3000/auth/token';
        const token$ = this.http.post<IAccessToken>
        (
            tokenEndpoint, {
                observe: 'response',
                responseType: 'json',
            }
        );

        return token$;
    }
}
