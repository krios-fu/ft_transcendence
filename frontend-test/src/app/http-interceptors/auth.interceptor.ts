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
        const reqAuth = this.setAuthHeaders(req);

        return next.handle(reqAuth)
            .pipe(catchError((((err/*, caught*/) => this.handleHttpError(err/*, caught, req*/, next)))));
    }

    private handleHttpError(error: HttpErrorResponse, /*catch failed request here */ next: HttpHandler): Observable<never> {
        if (error.status === 401) {
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
                    /*
                    const reqValidAuth = this.setAuthHeaders(req);
                    return next.handle(reqValidAuth); ????

                    */
                    /* retry here */
                    
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        //this.authService.logout();
                    }
                    return throwError(() => error);
                },
            }); 
        } else {
        //    this.authService.logout();
            /* aquí van redirecciones a páginas de error personalizadas (foribidden, ise, ...) */
        }
        return throwError(() => error);
    }

    private setAuthHeaders(req: HttpRequest<any>): HttpRequest<any> {
        const accessToken = this.authService.getAuthToken();

        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
    }
}
