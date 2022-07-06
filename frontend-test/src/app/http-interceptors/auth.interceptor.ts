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
import { IAuthPayload } from '../interfaces/iauth-payload.interface';

/* implementamos aqui la logica de refresco y redireccion,
    las peticiones de authentificacion deben pasar limpias */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler)
        : Observable<HttpEvent<unknown>> {
        const accessToken: string | null = this.authService.getAuthToken();
        const reqAuth: HttpRequest<unknown> = req.clone({
           headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });

        return next.handle(reqAuth)
            .pipe(catchError((err => this.handleHttpError(err))));
    }

    private handleHttpError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 401) {
            const tokenPetition$ = this.authService.refreshToken();

            tokenPetition$.subscribe({
                next: (res: HttpResponse<IAuthPayload>) => {
                    console.log('oof!3');
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
                    /* retry here */
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.authService.logout();
                    }
                    return throwError(() => error);
                },
            }); 
        } else {
            this.authService.logout();
        }
        console.log('oof!5');
        return throwError(() => error);
    }
}
