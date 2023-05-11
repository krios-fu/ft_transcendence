import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AlertServices } from 'src/app/services/alert.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';


@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  user: UserDto | undefined;

  icon_friend = 'person_add'
  icon_activate = true;

  id_friendship = -1

  urlApi = 'http://localhost:3000/';

  public FRIENDS_USERS = [] as UserDto[];

  me : UserDto | undefined;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private alertService: AlertServices,
    private socketGameNotification : SocketNotificationService,
    private userService : UsersService
  ) {
    this.user = undefined;



  }


  ngOnInit() {
    this.friend();
    this.userService.getUser('me')
    .subscribe((user : UserDto[]) => {
      this.me = user[0];
      this.socketGameNotification.joinRoomNotification(this.me.username);
    } )
  }





  getNickName() {
    return this.user?.nickName;
  }


  getPhotoUrl() {
    return this.user?.photoUrl;
  }


  send_invitatiion_game(){
    this.socketGameNotification.sendNotification({ user: this.me, dest : this.user?.username, title: 'INVITE GAME'});
    this.alertService.openRequestGame(this.user as UserDto, 'SEND REQUEST GAME');
  }

  post_friendship() {
    if (this.icon_friend === 'person_add') {
      this.http.post(`${this.urlApi}users/me/friends`, {
        receiverId: this.user?.id,
      }).subscribe(
        data => {
          this.icon_friend = 'pending'
        })
    }
    else if (this.icon_friend === 'person_remove') {
      this.http.delete(`http://localhost:3000/users/me/friends/deleted/${this.id_friendship}`)
        .subscribe(data => {
          this.icon_friend = 'person_add'
        })
    }
    else if (this.icon_friend === 'check')
      this.http.patch(`http://localhost:3000/users/me/friends/accept`, {
        id: this.user?.id
      })
        .subscribe(data => {
          this.icon_friend = 'person_remove'
        })
  }

  friend() {
    this.route.params.subscribe(({ id }) => {
      // this.formMessage.patchValue({ id });
      this.http.get<UserDto[]>(`${this.urlApi}users?filter[nickName]=${id}`)
        .subscribe((user: UserDto[]) => {
          if (user.length === 0)
          {
            this.alertService.openSnackBar('User not foud', 'OK')
            this.authService.redirectHome()
          }
          this.user = user[0];
          this.icon_activate = true;

          // console.log("USERRR CREATED CHAT", this.user)
          if (this.user.username != this.authService.getAuthUser()){
            this.icon_activate = true;
          }
          // else
          console.log("POST CHAT FRIEND");
            this.chatService.createChat(this.user.id).subscribe(data => console.log('CHAT POST SERVICES', data));


          this.FRIENDS_USERS = [];
          // change de icone visible add o remove 

          this.http.get<any>(this.urlApi + `users/me/friends/as_pendding?filter[nickName]=${id}`)
            .subscribe((friend: any) => {
              if (friend.length > 0) {
                const { receiver } = friend[0];
                if (receiver && this.user?.username == receiver.username)
                  this.icon_friend = 'pending';
                else
                  this.icon_friend = 'check';
              }
            });
          this.http.get<any>(this.urlApi + 'users/me/friends/' + this.user?.id)
            .subscribe((friend: any) => {
              if (friend) {
                this.id_friendship = friend.id
                this.icon_friend = 'person_remove';
              }
              this.http.get<any[]>(`http://localhost:3000/users/${this.user?.id}/friends`)
                .subscribe((friends: any[]) => {
                  for (let friend in friends) {
                    const { receiver } = friends[friend];
                    const { sender } = friends[friend];
                    const user = (receiver) ? receiver : sender;
                    if (user)
                      this.FRIENDS_USERS.push(user);
                  }
                })
            })
        });
    });
  }

}