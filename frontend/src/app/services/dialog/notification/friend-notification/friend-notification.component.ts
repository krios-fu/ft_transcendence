import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-notification',
  templateUrl: './friend-notification.component.html',
  styleUrls: ['./friend-notification.component.scss']
})
export class FriendNotificationComponent implements OnInit {
  public FRIENDS_USERS_PENDDING = [] as UserDto[];


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertServices,){}

  ngOnInit(): void {
    const user_sesion = this.authService.getAuthUser();

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
  }


  add_friend(id_friend: number) {
    this.http.patch(`${environment.apiUrl}users/me/friends/accept`, {
      id: id_friend
    })
      .subscribe(() => {
        this.FRIENDS_USERS_PENDDING = this.FRIENDS_USERS_PENDDING.filter((user: UserDto) => user.id !== id_friend)
        this.alertService.openSnackBar("Friend add", "Close");
      })
  }

  delete_friend(id_friend: number) {

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

  // post_friendship() {

  //   else if (this.icon_friend === 'person_remove') {
  //     this.http.delete(`http://localhost:3000/users/me/friends/deleted/${this.id_friendship}`)
  //       .subscribe(data => {
  //         this.icon_friend = 'person_add'
  //       })
  //   }
  //   else if (this.icon_friend === 'check')
  //     this.http.patch(`http://localhost:3000/users/me/friends/accept`, {
  //       id: this.user?.id
  //     })
  //       .subscribe(data => {
  //         this.icon_friend = 'person_remove'
  //       })
  // }

}
