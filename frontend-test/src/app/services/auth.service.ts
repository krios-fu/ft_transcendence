import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
                responseType: 'json',
                withCredentials: true,
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
                withCredentials: true,
            },
        );
        return token$;
    }

    redirectHome(): void {
        this.router.navigate(['/home']);
    }

    redirectLogin(): void {
        this.router.navigate(['/login']);
    }

    /* Solo permite ejecución a usuarios logeados */
    logout(): void {
        const logoutEndpoint = 'http://localhost:3000/auth/logout';
        this.http.post<any>(logoutEndpoint, { })
            .subscribe({
                error: (err: any) => {
                    console.error('User already logged out');
                }
            });
        
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('username');
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return (
            this.getAuthToken() != null &&
            this.getAuthUser() != null
        );
    }

    setAuthInfo(authPayload: IAuthPayload): void {
        sessionStorage.setItem('access_token', authPayload.accessToken);
        sessionStorage.setItem('username', authPayload.username);
    }

    getAuthToken(): string | null {
        return sessionStorage.getItem('access_token');
    }

    getAuthUser(): string | null {
        return sessionStorage.getItem('username');
    }
}
