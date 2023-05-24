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

/* implementamos aqui la logica de refresco y redireccion,
    las peticiones de authentificacion deben pasar limpias */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    isRequestingNewCreds: boolean = false;
    newCredsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        let reqAuth: HttpRequest<any> = req;

        if (this.authService.getAuthToken()) {
            reqAuth = this.setAuthHeaders(req);
        }
        return next.handle(reqAuth)
            .pipe
            (
                catchError((err: HttpErrorResponse) => {
                    console.log('ERROR: Se prendió la wea');
                    console.log(`2FA: ${err.headers.get('Location')}`);
                    if (err.status === 401 && err.headers.get('Location') === '/login/2fa') {
                        console.log('2FA: OTP redirection route');
                        this.authService.redirect2FA();
                        return throwError(() => err);
                    }
                    if (!this.authService.getAuthUser()) {
                        console.log('TOKEN: No user to provide refresh token')
                        this.authService.logout();
                        return throwError(() => err);
                    }
                    if (err.status === 401 && req.url.indexOf('/token') == -1) {
                        console.log('TOKEN: Authentication flow');
                        return this.handleAuthError(req, next);
                    } else {
                        return throwError(() => {
                            if (err.status === 0) {
                                return new HttpErrorResponse({
                                    status: HttpStatusCode.InternalServerError,
                                    statusText: 'Internal Server Error',
                                });
                            }
                            if (err.status === 401) {
                                this.authService.logout();
                            }
                            return err;
                        });
                    }
                })
            );
    }

    private handleAuthError
    (
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        if (this.isRequestingNewCreds) {
            return this.newCredsSubject
                .pipe
                (
                    take(1),
                    filter((state: boolean) => !state),
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
                    console.log(`TOKEN: status - ${res.status}, auth: ${res.body.accessToken}`);
                    return next.handle(this.setAuthHeaders(req));
                }),
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.authService.logout();
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
