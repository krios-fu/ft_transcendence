import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dtos/user.dto';
import { environment } from 'src/environments/environment';
import { Roles } from '../roles';
import { AlertServices } from './alert.service';
import { Friendship } from '../dtos/block.dto';
// import { SocketNotificationService } from './socket-notification.service';

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
    private alertService: AlertServices,
    // private socketGameNotification: SocketNotificationService,


  ) { }

  getUser(user: string) {
    return this.http.get<UserDto>(environment.apiUrl + 'users/' + user);
  }

  getUserById(user_id: number) {
    return this.http.get<UserDto>(environment.apiUrl + 'users/' + user_id);
  }

  getFriends(user: string) {
    return this.http.get(environment.apiUrl + 'users/' + user + '/friends/as_pending');
  }

  get_role(user: UserDto) {
    user.role = {
      is_super_admin: false,
      is_admin: false,
      is_owner_room: false,
      is_banned: false,
      is_silenced: false,
      is_moderator: false,
      is_player : false
    }
    this.http.get(`${environment.apiUrl}user_roles/users/${user.id}`)
      .subscribe((payload) => {
        const roles = Object.assign(payload);
        roles.forEach((user_roles: any) => {
          switch (user_roles.roleId) {
            case Roles.super_admin:
              user.role.is_super_admin = true;
              break;
            case Roles.banned:
              user.role.is_banned = true;
              break;
            case Roles.admin:
              user.role.is_admin = true;
              break;
            case Roles.silenced:
              user.role.is_silenced = true;
              break;
              case Roles.moderator:
                user.role.is_moderator = true;
              break; 
              case Roles.player:
                user.role.is_player = true;
          };
        });
      });
  }



  get_role_user_room(user: UserDto, room_id: number) {

    this.http.get(`${environment.apiUrl}user_room_roles/users/${user.id}/rooms/${room_id}`)
      .subscribe((payload) => {
        const roles = Object.assign(payload);
        roles.forEach((user_roles: any) => {
          switch (user_roles.roleId) {
            case Roles.banned:
              user.role.is_banned = true;
              break;
            case Roles.admin:
              user.role.is_admin = true;
              break;
            case Roles.silenced:
              user.role.is_silenced = true;
              break;
              case Roles.player:
                user.role.is_player = true;
                break;
          };
        });
      });
  }


  delete_role_banned(user: UserDto, room_id: number){

    this.http.get(`${environment.apiUrl}ban`)
    .subscribe((payload : any)=>{
       payload = Object.assign(payload)
       payload.forEach((banned : any) => {
         if (banned.roomId == room_id && banned.userId == user.id)
          this.http.delete(`${environment.apiUrl}ban/${banned.id}`)
          .subscribe((lol : any) =>{
            user.role.is_banned = false;
          })
       })
    })

  }

  deleted_role_room(user: UserDto, room_id: number, roleId: number) {
    this.http.get(`${environment.apiUrl}user_room_roles/users/${user.id}/rooms/${room_id}`)
      .subscribe((payload) => {
        const roles = Object.assign(payload);
        let user_room_role_id = roles.find(
          (user_room_role: any) => {
            user_room_role.roleId == roleId; return user_room_role
          });
        if (user_room_role_id)
          this.deleted_role_user_room(user, user_room_role_id.id, roleId);
      });
  }


  deleted_role_user_room(user: UserDto, user_room_role_id: number, roleId: number) {
    this.http.delete(`${environment.apiUrl}user_room_roles/${user_room_role_id}`)
      .subscribe((data: any) => {
        switch (roleId) {
          case Roles.banned:
            user.role.is_banned = false;
            break;
          case Roles.admin:
            user.role.is_admin = false;
            break;
          case Roles.silenced:
            user.role.is_silenced = false;
        };
        // this.socketGameNotification.roomAdmin(roomId.toString(), user);


      });
  }

  deleted_role(user: UserDto, user_role_id: number) {
    this.http.delete(`${environment.apiUrl}user_roles/${user_role_id}`)
      .subscribe((data: any) => {
        // user.role.is_banned = false;
      });
  }

  delete_role_user(user: UserDto, id_role: number) {
    this.http.get(`${environment.apiUrl}user_roles/users/${user.id}`)
      .subscribe((payload: any) => {
        const roles = Object.assign(payload);
        let role = roles.find((role: any) => { role.roleId == id_role; return role })
        if (role)
        console.log(role);
          this.deleted_role(user, role.id);
      });
  }

  post_role_user_room(user: UserDto, roleId: number, roomId: number) {

    if(roleId === Roles.player){
      this.http.post(`${environment.apiUrl}user_room_roles/as_player`, { userId: user.id, roleId: roleId, roomId: roomId })
        .subscribe((payload: any) => {
          this.get_role_user_room(user, roomId);
        })
    }
    else if (roleId === Roles.banned) {
      this.http.post(`${environment.apiUrl}ban`, { userId: user.id.toString(), roomId: roomId.toString() })
      .subscribe((payload : any)=>{
        user.role.is_banned = true;
      })

    }
    else
      this.http.post(`${environment.apiUrl}user_room_roles`, { userId: user.id, roleId: roleId, roomId: roomId })
        .subscribe((payload: any) => {
          this.get_role_user_room(user, roomId);
        })
  }

  post_role(user: UserDto, role_id: number) {
    this.http.post(`${environment.apiUrl}user_roles`, { userId: user.id, roleId: role_id })
      .subscribe(
        (data: any) => {
          console.log(data);
          this.get_role(user);
        }
      )
  }

  block_user(user : UserDto){
    return this.http.post(`${environment.apiUrl}users/me/blocked`, {
      blockReceiverId: user.id
    })
  }

  get_blocked_users(){
    return this.http.get<Friendship []>(`${environment.apiUrl}users/me/blocked`);
  }

  get_blocked_user_id(user: UserDto){
   return this.http.get<any>(`${environment.apiUrl}users/me/friends/${user.id}/blocked`)
  
  }

}
