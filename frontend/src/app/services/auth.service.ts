import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
    constructor(
        private http: HttpClient,
        private router: Router,
        private cookies: CookieService,
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

    directRefreshToken(): Observable<IAuthPayload | undefined> {
        return (
            new Observable((subscriber) => {
                this.refreshToken().subscribe((data) => {
                    console.log("Refresh data: ", data.body);
                    if (!data.body)
                        subscriber.next(undefined);
                    else
                    {
                        this.setAuthInfo({
                            accessToken: data.body.accessToken,
                            username: data.body.username,
                            id: data.body.id
                        });
                        subscriber.next(data.body);
                    }
                    subscriber.complete();
                })
            })
        );
    }

    redirectHome(): void {
        this.router.navigate(['/home/profile']);
    }

    redirecOtpSesion(): void {
        this.router.navigate(['/otp_session']);
    }

    redirectLogin(): void {
        this.router.navigateByUrl('/login');
    }

    /* Solo permite ejecución a usuarios logeados */
    logout(): void {
        this.cookies.delete('refresh_token', '/', 'localhost', true, 'None');
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        this.router.navigateByUrl('/login');

    }

    isAuthenticated(): boolean {
        return (
            this.getAuthToken() != null &&
            this.getAuthUser() != null
        );
    }

    setAuthInfo(authPayload: IAuthPayload) {
        localStorage.setItem('access_token', authPayload.accessToken);
        localStorage.setItem('username', authPayload.username);
        localStorage.setItem('user_id', String(authPayload.id));
    }

    getAuthToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getAuthUser(): string | null {
        return localStorage.getItem('username');
    }
}
