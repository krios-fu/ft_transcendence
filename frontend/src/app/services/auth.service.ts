import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private cookies: CookieService,
    ) { }

    private getUserCredentials(authCode: string): Observable<HttpResponse<any>> {
      const httpAuthGet: string = environment.apiUrl + 'auth/42';

      return this.http.get<any>
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
    }

    public authUser(code: string) {
      this.getUserCredentials(code)
        .subscribe({
          next: (res: HttpResponse<IAuthPayload>) => {
            if (res.body === null) {
              throw new HttpErrorResponse({
                statusText: 'successful login never returned credentials',
                status: HttpStatusCode.InternalServerError,
              })
            }
            this.setAuthInfo({
              "accessToken": res.body.accessToken,
              "username": res.body.username,
              "id": res.body.id
            });
            this.redirectHome();
          },
          error: (err: HttpErrorResponse) => new HttpResponse({status: 200})
        });
    }

    public refreshToken(): Observable<HttpResponse<IAuthPayload>> {
        const tokenEndpoint: string = environment.apiUrl + 'auth/token?user=' + this.getAuthUser();
        return this.http.get<IAuthPayload>
        (
            tokenEndpoint, {
                observe: 'response',
                responseType: 'json',
                withCredentials: true,
            },
        );
    }

    public directRefreshToken(): Observable<IAuthPayload | undefined> {
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

    public confirm2FA(code: string): void {
        this.http.post<IAuthPayload>(
            environment.apiUrl + 'auth/2fa/validate',
            { token: code }
        )
            .subscribe({
                next: (creds: IAuthPayload) => {
                    this.setAuthInfo({
                        'accessToken': creds.accessToken,
                        'username': creds.username,
                        'id': creds.id
                    });
                    this.redirectHome();
                },
                error: (err: HttpErrorResponse) => {
                    alert('Invalid OTP code');  /* TODO: testear que no de problemas al esperar la resolución de la alerta */
                }
            });
    }

    public redirectHome(): void {
        this.router.navigate(['/profile/me']);
    }

    public redirect2FA(): void {
        this.router.navigate(['/login/2fa']);
    }

    redirectLogin(): void {
        this.router.navigateByUrl('/login');
    }

    /* Solo permite ejecución a usuarios logeados */
    public logout(): void {
      console.log('unsetting local storage!');
        this.cookies.delete('refresh_token', '/', 'localhost', true, 'None');
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        this.redirectLogin();
    }

    public isAuthenticated(): boolean {
        return (
            this.getAuthToken() != null &&
            this.getAuthUser() != null
        );
    }

    public setAuthInfo(authPayload: IAuthPayload) {
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

    getAuthId(): string | null {
        return localStorage.getItem('user_id');
    }
}
