import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
    constructor(
        private http: HttpClient,
        private router: Router,
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

    refreshToken(): Observable<HttpResponse<IAuthPayload>> {
        const tokenEndpoint = 'http://localhost:3000/auth/token?user=' + this.getAuthUser();
        const token$ = this.http.get<IAuthPayload>
        (
            tokenEndpoint, {
                observe: 'response',
                responseType: 'json',
            },
        );
        return token$;
    }

    logout(): void {
        const logoutEndpoint = 'http://localhost:3000/auth/logout';
        this.http.post<any>(logoutEndpoint, { })
            .subscribe({
                error: (err: any) => {
                    console.error('User already logged out');
                }
            });
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
    }

    setAuthInfo(authPayload: IAuthPayload): void {
        localStorage.setItem('access_token', authPayload.accessToken);
        localStorage.setItem('username', authPayload.username);
    }

    getAuthToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getAuthUser(): string | null {
        return localStorage.getItem('username');
    }
}
