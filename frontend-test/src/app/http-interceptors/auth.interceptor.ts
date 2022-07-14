import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';
import { Router } from '@angular/router';

/* implementamos aqui la logica de refresco y redireccion,
    las peticiones de authentificacion deben pasar limpias */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler)
        : Observable<HttpEvent<unknown>> {
        const reqAuth = this.setAuthHeaders(req);

        return next.handle(reqAuth)
            .pipe
            (
                catchError((err: HttpErrorResponse) => {
                    console.error(JSON.stringify(err));
                    if (err.status === 401 && req.url.indexOf('/token') == -1) {
                        return this.handleAuthError(err, req, next);
                    } else {
                        return throwError(() => {
                            if (err.status === 401) {
                                this.router.navigate(['/login']);
                            }
                            if (err.status === 500) {
                                this.router.navigate(['/500']);
                            } else if (err.status === 403) {
                                this.router.navigate(['/403']);
                            } else if (err.status === 404) {
                                this.router.navigate(['/404']);
                            } else {
                                this.router.navigate(['/400']);
                            }
                            return err;
                        });
                    }
                }),
            );
    }

    private handleAuthError
    (
        error: HttpErrorResponse, 
        req: HttpRequest<any>, 
        next: HttpHandler
    ): Observable<never> {
        const tokenPetition$ = this.authService.refreshToken();
        
        tokenPetition$.subscribe({
            next: (res: HttpResponse<IAuthPayload>) => {
                if (res.body === null) {
                    throw new HttpErrorResponse({
                        status: HttpStatusCode.InternalServerError,
                        statusText:'Successful refresh token petition did not return body',
                    });
                }
                this.authService.setAuthInfo({
                    'accessToken': res.body.accessToken,
                    'username': res.body.username
                });
                const reqValidAuth = this.setAuthHeaders(req);
                return next.handle(reqValidAuth);
            },
            error: (error: HttpErrorResponse) => {
                if (error.status === 401) {
                    sessionStorage.removeItem('access_token');
                    sessionStorage.removeItem('username');
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            },
        }); 
        return throwError(() => error);
    }

    private setAuthHeaders(req: HttpRequest<any>): HttpRequest<any> {
        const accessToken = this.authService.getAuthToken();

        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
    }
}
