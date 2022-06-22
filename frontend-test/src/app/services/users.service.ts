import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  email: string;
  photoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    constructor(
      private http: HttpClient,
    ) { }

    handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 0) {
            console.error('Network error: ' + JSON.stringify(error.error));
        } else {
            console.error('Backend threw following error: ' + JSON.stringify(error.error))
        }
        return throwError(() => {
            new Error('service returned with an error status');
        })
    }
    getUser(username: string): Observable<IUser> {
      /* username = username.trim() */
      const userParam = new HttpParams().set('id', username);

      return this.http.get<IUser>( 
        'http://localhost:3000/users/', {
          observe: 'body',
          params: userParam,
          responseType: 'json',
        }).pipe(
          tap(console.log),
          catchError(this.handleError)
        );
    }
}
