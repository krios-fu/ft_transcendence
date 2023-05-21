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
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';
import { Router } from '@angular/router';

/* implementamos aqui la logica de refresco y redireccion,
    las peticiones de authentificacion deben pasar limpias */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    isRequestingNewCreds: boolean = false;
    newCredsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor(private authService: AuthService,
                private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        const reqAuth = this.setAuthHeaders(req);
        return next.handle(reqAuth)
            .pipe
            (
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 401 && err.headers.get('Location') === '/auth/2fa') {
                        this.router.navigateByUrl('/auth/2fa');
                        return throwError(() => err);
                    }
                    if (err.status === 401 && req.url.indexOf('/token') == -1) {
                        return this.handleAuthError(req, next);
                    } else {
                        return throwError(() => {
                            if (err.status === 0) {
                                return new HttpErrorResponse({
                                    status: HttpStatusCode.InternalServerError,
                                    statusText: 'Internal Server Error',
                                });
                            }
                            return err;
                        });
                    }
                })
            );
    }

    private handleAuthError(
        req: HttpRequest<any>, 
        next: HttpHandler
    ): Observable<any> {
        if (this.isRequestingNewCreds == true) {
            return this.newCredsSubject
                .pipe
                (
                    take(1),
                    filter((state: boolean) => state == false),
                    switchMap(() => {
                        return next.handle(this.setAuthHeaders(req));
                    })
                )
        }
        this.newCredsSubject.next(true);
        this.isRequestingNewCreds = true;
        return this.authService.refreshToken()
            .pipe
            (
                switchMap((res: HttpResponse<IAuthPayload>) => {
                    if (res.body == null) {
                        return throwError(() => {
                            return new HttpErrorResponse({
                                status: HttpStatusCode.InternalServerError,
                                statusText:'Successful refresh token petition did not return body',
                            });
                        });
                    }
                    this.authService.setAuthInfo({
                        'accessToken': res.body.accessToken,
                        'username': res.body.username,
                        'id': res.body.id
                    });
                    return next.handle(this.setAuthHeaders(req));
                }),
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        window.localStorage.removeItem('access_token');;
                        window.localStorage.removeItem('username');
                        window.localStorage.removeItem('id');
                        this.authService.redirectLogin();
                    }
                    return throwError(() => err);
                }),
                finalize(() => {
                    this.isRequestingNewCreds = false;
                    this.newCredsSubject.next(false);
                })
            )
    }

    private setAuthHeaders(req: HttpRequest<any>): HttpRequest<any> {
        const accessToken = this.authService.getAuthToken();

        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
    }
}
