import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) { }  

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authToken = 'Bearer ' + this.authService.getAuthToken();

        console.log(authToken);
        if (authToken === null) {
            return next.handle(request);
        }
        const reqWithAuth = request.clone({
            headers: request.headers.set('Authorizaton', authToken),
        });
        console.log(reqWithAuth.headers.get('Authorization'));

        return next.handle(reqWithAuth);    
  } 
}
