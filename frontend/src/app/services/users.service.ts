import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dtos/user.dto';
import { environment } from 'src/environments/environment';

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

    getUser(user : string) {
      return this.http.get<UserDto>(environment.apiUrl + 'users/' + user);
    }

    getUserById(user_id : number) {
      return this.http.get<UserDto>(environment.apiUrl + 'users/' + user_id);
    }

    getFriends(user: string) {
      return this.http.get(environment.apiUrl + 'users/' + user + '/friends/as_pending');
    }
}
