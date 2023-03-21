import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { UserDto } from '../dtos/user.dto';

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

    // getUser(): Observable<IUser> {
      

    //   return this.http.get<IUser>( 'http://localhost:3000/users/me');
    // }

    getUser(user : string) {
      return this.http.get<UserDto[]>(`http://localhost:3000/users/${user}`);
    }

    getFriends(user: string){
      return this.http.get(`http://localhost:3000/users/${user}/friends/as_pending`)
    }
}
