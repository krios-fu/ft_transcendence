import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    private handleHttpError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 401) {
            this.router.navigate(['login']);
        }
        return throwError((err: HttpErrorResponse) => {
          return err;
        });
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authToken = this.authService.getAuthToken();

        console.log(authToken);
        if (authToken === null) {
            return next.handle(request);
        }
        const reqWithAuth = request.clone({
            headers: request.headers.set('Authorizaton', `Bearer ${authToken}`),
        });

        return next.handle(reqWithAuth)
            .pipe(catchError(this.handleHttpError));
  } 
}
