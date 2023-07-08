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
import { Friendship } from 'src/app/dtos/block.dto';
import { FormControl, FormGroup } from '@angular/forms';

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

  blocked = false;

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

  ngOnInit() {
    this.userService.getUser('me')
      .subscribe((user: UserDto) => {

        // this.userService.get_role(user);

        this.me = user;
        this.userService.get_role(this.me);
        this.color_icon = (this.me.defaultOffline) ? '#49ff01' : '#ff0000';
        this.online_icon = (this.me.defaultOffline) ? 'online_prediction' : 'online_prediction';
        this.shareService.eventEmitter.emit(this.me.username);
        this.friend();

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
      }).subscribe(data => {
        this.icon_friend = 'pending'
      })
    }
    else if (this.icon_friend === 'person_remove') {
      this.deleted_friend();
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


  deleted_friend() {
    this.http.get<any>(`${environment.apiUrl}users/me/friends/${this.user?.id}`)
      .subscribe((friend: any) => {
        this.http.delete(`${environment.apiUrl}users/me/friends/deleted/${friend.id}`)
          .subscribe(data => {
            this.icon_friend = 'person_add'
            this.friend()
          });
      });

  }

  get_chat_id() { return this.id_chat; }

  view_chat() {
    const friend = this.FRIENDS_USERS.find((friend) => friend.id == this.me?.id)

    this.view = friend ? true : false;
    if (this.view)
      this.icon_friend = 'person_remove';
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
          this.is_blocked(this.user, this.me as UserDto);

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

          this.get_friend(this.user?.id)
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

  add_as_moderator() {
    if (!this.user?.role.is_moderator && this.me?.role.is_super_admin) {
      this.userService.post_role(this.user as UserDto, Roles.moderator);
      this.alertService.openSnackBar(`${this.user?.nickName.toUpperCase()} IS NOW MODERATOR`, 'OK');
    }
  }

  delete_as_moderator() {
    if (this.user?.role.is_moderator && (this.me?.role.is_super_admin || this.me?.role.is_moderator)) {
      this.userService.delete_role_user(this.user, Roles.moderator);
      this.alertService.openSnackBar(`${this.user?.nickName.toUpperCase()} IS DELETED AS MODERATOR`, 'OK');

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


  is_blocked(friend: UserDto, me: UserDto) {

    this.userService.get_blocked_user_id(friend)
      .subscribe((friend: Friendship) => {

        if (friend && friend.block?.blockSenderId !== friend.id && friend.block?.blockSenderId !== me.id) {
          this.alertService.openSnackBar(`YOU CANNOT ACCESS THIS PROFILE`, 'OK');
          this.authService.redirectHome()
        }
        if( friend && friend.block?.blockSenderId === me.id)
          this.blocked = true;

      })

  }

  block_user(friend: UserDto) {
    this.userService.block_user(friend)
      .subscribe(
        (data: any) => {
          this.alertService.openSnackBar(`${friend.nickName.toUpperCase()} IS NOW BLOCKED`, 'OK');
          this.blocked = true;
        }
      )
  }

  unblock_user() {
    this.http.get<any>(`${environment.apiUrl}users/me/friends/${this.user?.id}/blocked`)
      .subscribe((friend: any) => {
        this.http.delete(`${environment.apiUrl}users/me/friends/deleted/${friend.id}`)
          .subscribe(data => {
          this.alertService.openSnackBar(`${this.user?.nickName.toUpperCase()} IS NOW UNBLOCKED`, 'OK');

            this.blocked = false;
          });
      });
  }



}
