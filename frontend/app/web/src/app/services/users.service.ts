import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';

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

    getUser(username: string): Observable<IUser> {
      /* username = username.trim() */
      // const userParam = new HttpParams().set('id', username);
      

      return this.http.get<IUser>( 'http://localhost:3000/users/me');
      // .pipe(tap((user) => console.log('tapped: ' + JSON.stringify(user))))
        // 'http://localhost:3000/users/', {
        //   observe: 'body',
        //   params: userParam,
        //   responseType: 'json',
        // }).pipe(tap((user) => console.log('tapped: ' + JSON.stringify(user))))
    }
}
