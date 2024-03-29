import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';

@Component({
  selector: 'app-friend-notification',
  templateUrl: './friend-notification.component.html',
  styleUrls: ['./friend-notification.component.scss']
})
export class FriendNotificationComponent implements OnInit {
  public FRIENDS_USERS_PENDDING = [] as UserDto[];
  public FRIENDS_USER = [] as UserDto[];

  urlApi = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertServices,
    private userService: UsersService,
    private socketNotiServices: SocketNotificationService
    ){}

  ngOnInit(): void {
    const user_sesion = this.authService.getAuthUser();
    this.get_room_online();
    
    this.http.get<any[]>(`${environment.apiUrl}users/me/friends/as_pending`)
    .subscribe((friends: any[]) => {
      for (let friend in friends) {
        const { receiver } = friends[friend];
        const { sender } = friends[friend];
        
        const user = (receiver) ? receiver : sender;
          if (sender && (sender.username !== user_sesion))
            this.FRIENDS_USERS_PENDDING.push(user);
        }
      })
      this.get_friends()
  }

  get_friends(){
    this.http.get(`${environment.apiUrl}users/me/friends`)
    .subscribe((friends: any) =>{
      for (let friend in friends) {
        const { receiver } = friends[friend];
        const { sender } = friends[friend];
        const user = (receiver) ? receiver : sender;
        if (user){
          this.socketNotiServices.send_request_online(user);
          this.FRIENDS_USER.push(user);
        }
      }
    })
  }

  add_friend(friend: UserDto) {
    this.http.patch(`${environment.apiUrl}users/me/friends/accept`, {
      id: friend.id
    })
      .subscribe(() => {
        this.FRIENDS_USER.push(friend);
        this.FRIENDS_USERS_PENDDING = this.FRIENDS_USERS_PENDDING.filter((user: UserDto) => user.id !== friend.id)
        this.alertService.openSnackBar("Friend add", "Close");
      })
  }

  delete_friend_as_pending(id_friend: number) {

    this.http.get<any[]>(`${environment.apiUrl}users/me/friends/as_pending`)
      .subscribe((friends: any[]) => {
        for (let friend in friends) {
          const { receiver } = friends[friend];
          const { sender } = friends[friend];

          const user = (receiver) ? receiver : sender;
          if (user.id === id_friend)
            this.http.delete(`${environment.apiUrl}users/me/friends/deleted/${friends[friend].id}`)
              .subscribe(data => {
                this.FRIENDS_USERS_PENDDING = this.FRIENDS_USERS_PENDDING.filter((user: UserDto) => user.id !== id_friend)
              })
        }
      })
  }

  delete_friend(id_friend: number) {
    this.http.get<any[]>(`${environment.apiUrl}users/me/friends/${id_friend}`)
      .subscribe((friend: any) => {
            this.http.delete(`${environment.apiUrl}users/me/friends/deleted/${friend.id}`)
              .subscribe(data => {
                this.FRIENDS_USER=  this.FRIENDS_USER.filter((user: UserDto) => user.id !== id_friend)
              })
        })
  }

  block_friend(friend : UserDto){
  this.userService.block_user(friend)
    .subscribe(
      (data : any)=>{
        this.alertService.openSnackBar(`${friend.nickName} IS NOW BLOCKED`, 'OK');
        this.FRIENDS_USER = this.FRIENDS_USER.filter((user: UserDto) => user.id !== friend.id)
      }
    )
  }

  get_room_online(){
    this.socketNotiServices.get_online()
    .subscribe(
      (payload : any)=>{
        this.FRIENDS_USER.forEach((user: UserDto, index : number) => {
          if (user.id == payload.id){
            this.FRIENDS_USER[index] = Object.assign(payload); 

          }
      });
      }
    )

  }
}
