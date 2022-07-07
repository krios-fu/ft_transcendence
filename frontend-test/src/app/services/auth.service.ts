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

    isAuthorized(): Observable<HttpResponse<any>> {
        const httpUrl = 'http://localhost:3000/auth/is_authenticated';
        const isAuth$ = this.http.get<any>(httpUrl, { });

        return isAuth$;
    }

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
        console.log('frontend ping(refreshToken)');
        const tokenEndpoint = 'http://localhost:3000/auth/token?user=' + this.getAuthUser();
        const token$ = this.http.get<IAuthPayload>
        (
            tokenEndpoint, {
                observe: 'response',
                responseType: 'json',
            },
        ).pipe(
            tap(res => { console.log('tapado: ' + res)})
        );
        return token$;
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
