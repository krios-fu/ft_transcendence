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
import { catchError, Observable, retryWhen, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IAccessToken } from '../interfaces/iaccess-token.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private cookieService: CookieService,
        private router: Router,
    ) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler)
        : Observable<HttpEvent<unknown>> {
        return next.handle(req)
            .pipe
            (
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        return this.handleAuthError(req, next, err);
                    }
                    throw err;
                })
            )
    } 

    private handleAuthError(req: HttpRequest<unknown>, next: HttpHandler, err: HttpErrorResponse) {
        let accessToken: string;
        const requestForToken$ = this.authService.refreshToken();
        const observeToken = {
            next: (res: HttpResponse<IAccessToken>) => {
                if (res.body === null ) {
                    throw new HttpErrorResponse({
                        status: HttpStatusCode.Unauthorized,
                        statusText: 'User unauthorized',
                    });
                }
                accessToken = res.body.accessToken;
               this.cookieService.set('access_token', req.body.accessToken);
            }
        }
    }
}
