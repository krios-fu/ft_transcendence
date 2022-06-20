import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getUser(username: string): Observable/*<IUser>/* {
    /* username = username.trim() */
    const userParam = new HttpParams().set('id', username);

    const userOptions = {
      observe: 'body',
      params: new HttpParams().set('id', username),
      responseType: 'json'
    };

    return this.http.get/*<IUser>*/( 'http://localhost:3000/users/', userOptions);
  } 
}
