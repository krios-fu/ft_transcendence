import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AlertServices } from 'src/app/services/alert.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { environment } from 'src/environments/environment';
import { Roles } from 'src/app/roles';

@Injectable()
export class SharedService {
  public eventEmitter: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  user?: UserDto; // user/user:id
  me?: UserDto; // me

  icon_friend = 'person_add'
  icon_activate = true;
  color_icon = '';
  online_icon = '';
  id_friendship = -1
  id_chat = -1;
  view = false;

  public FRIENDS_USERS = [] as UserDto[];


  constructor(private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private alertService: AlertServices,
    private socketGameNotification: SocketNotificationService,
    private userService: UsersService,
    private shareService: SharedService
  ) {
  }

  // @Output() username = new EventEmitter();

  ngOnInit() {
    this.friend();
    this.userService.getUser('me')
      .subscribe((user: UserDto) => {

        this.userService.get_role(user);

        this.me = user;
        this.color_icon = (this.me.defaultOffline) ? '#49ff01' : '#ff0000';
        this.online_icon = (this.me.defaultOffline) ? 'online_prediction' : 'online_prediction';
        this.shareService.eventEmitter.emit(this.me.username);
      })

    this.route.params.subscribe(({ id }) => {
      this.shareService.eventEmitter.emit(id);

    })
  }



  getNickName() { return this.user?.nickName; }

  getPhotoUrl() { return this.user?.photoUrl; }


  send_invitatiion_game() {
    this.socketGameNotification.sendNotification({ user: this.me, dest: this.user?.username, title: 'INVITE GAME' });
    this.alertService.openSnackBar('Game invitation sent', 'OK');
  }

  post_friendship() {
    if (this.icon_friend === 'person_add') {
      this.http.post(`${environment.apiUrl}users/me/friends`, {
        receiverId: this.user?.id,
      }).subscribe( data => {
          this.icon_friend = 'pending'
        })
    }
    else if (this.icon_friend === 'person_remove') {
      this.http.delete(`${environment.apiUrl}users/me/friends/deleted/${this.id_friendship}`)
        .subscribe(data => {
          this.icon_friend = 'person_add'
          this.friend()
        })
    }
    else if (this.icon_friend === 'check')
      this.http.patch(`${environment.apiUrl}users/me/friends/accept`, {
        id: this.user?.id
      })
        .subscribe(data => {
          this.icon_friend = 'person_remove'
          this.friend()
        })
  }

  get_chat_id() { return this.id_chat; }

  view_chat() {
    const friend = this.FRIENDS_USERS.find((friend) => friend.id == this.me?.id)

    this.view = friend ? true : false;
  }

  friend() {
    this.route.params.subscribe(({ id }) => {
      // this.formMessage.patchValue({ id });
      this.http.get<UserDto>(`${environment.apiUrl}users/${id}`)
        .subscribe((user: UserDto) => {
          this.user = user;
          this.icon_activate = false;
          this.id_chat = -1;
          this.view = false;
          this.icon_friend = 'person_add'
          this.FRIENDS_USERS = [];

          this.userService.get_role(this.user);

          if (this.user.username != this.authService.getAuthUser()) {
            this.icon_activate = true;
          }
          if (this.icon_activate)
            this.chatService.createChat(this.user.id)
              .subscribe((data: any) => { this.id_chat = data.chatId });

          // change de icone visible add o remove 

          this.http.get<any>(`${environment.apiUrl}users/me/friends/as_pending`)
            .subscribe((friend: any) => {
              let pending = friend.find((user: any) => user.senderId == this.me?.id && user.receiverId == this.user?.id)
              let check = friend.find((user: any) => user.senderId == this.user?.id && user.receiverId == this.me?.id)
              if (pending)
                this.icon_friend = 'pending';
              if (check)
                this.icon_friend = 'check';
            });
          this.http.get<any>(`${environment.apiUrl}users/me/friends/${this.user?.id}`)
            .subscribe((friend: any) => {
              if (friend) {
                this.id_friendship = friend.id
                this.icon_friend = 'person_remove';
              }
              this.get_friend(this.user?.id)
            })
        }, error => {
          this.alertService.openSnackBar('USER NOT FOUND', 'OK')
          this.authService.redirectHome()
        });
    });
  }

  close() {
    if (!this.user?.role.is_banned && this.me?.role.is_super_admin) {
      this.userService.post_role(this.user as UserDto, Roles.banned);
      this.alertService.openSnackBar(`${this.user?.nickName.toUpperCase()} HAS BEEN BANNED`, 'OK')
    }

  }

  unclose() {
    if (this.user?.role.is_banned && this.me?.role.is_super_admin) {
      this.userService.delete_role_user(this.user as UserDto, Roles.banned);
      this.alertService.openSnackBar(`${this.user?.nickName.toUpperCase()} HAS BEEN UNBANNED`, 'OK');
    }
  }


  get_friend(id?: number) {
    this.FRIENDS_USERS = [];
    this.http.get<any[]>(`${environment.apiUrl}users/${id}/friends`)
      .subscribe((friends: any[]) => {
        for (let friend in friends) {
          const { receiver } = friends[friend];
          const { sender } = friends[friend];
          const user = (receiver) ? receiver : sender;
          if (user)
            this.FRIENDS_USERS.push(user);
        }
        this.view_chat();
      })
  }

}
