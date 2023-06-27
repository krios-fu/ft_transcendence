import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomDto } from 'src/app/dtos/room.dto';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { RoomGameIdService } from '../../room-game-id/room-game-id.service';
import { Player } from '../../elements/Player';
import { Chat } from 'src/app/room/chat/chat';
import { Roles } from 'src/app/roles';


@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit, OnDestroy {

  me?: UserDto;
  room_id?: string;

  players = [] as UserDto[];
  is_admin = false;
  is_owner_room = false;
  // admins = []
  room?: RoomDto;

  players_banned = [] as UserDto[];


  public formMessage = new FormGroup({
    message: new FormControl('')
  })

  constructor(private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute,
    private socketGameNotification: SocketNotificationService,
    private userService: UsersService,
    private alertService: AlertServices,
    private chatService: ChatService,
    public chat: Chat,
    private readonly roomGameIdService: RoomGameIdService,
  ) {



    this.socketGameNotification.userLeave()
      .subscribe((payload: any) => {
        this.players.map((user: UserDto) => {
          if (user.id === payload.user.id)
            user.defaultOffline = false
        })

        if (payload.user.id === this.me?.id) {
          this._redirectToRoomLists();
        }

        if (payload.leave) {
          // this.alertService.openSnackBar(`${payload.kicker} kicked player ${payload.user.nickName}`, 'OK')

          this.players = this.players.filter((player: UserDto) => player.id !== payload.user.id)
        }


        this.players.sort((user_a: any, user_b: any) => {
          return user_b.defaultOffline - user_a.defaultOffline;
        })
        this.players.sort((user_a: any, user_b: any) => {
          return user_b.role.is_admin - user_a.role.is_admin;
        })
      })
  }


  set_status_players(payload: any) {

    // payload.forEach()

    payload.forEach((user_online: UserDto) => {
      let lol = this.players.find((user: UserDto) => user.id == user_online.id)
      let is_banned = this.players_banned.find((user: UserDto) => user.id == user_online.id)
      if (!lol && !is_banned) {
        this.players.push(user_online)
      }
      else if (is_banned && !lol && (this.me?.role.is_super_admin || this.me?.role.is_admin || this.is_owner_room)) {
        user_online.role.is_banned = true;
        this.players.push(user_online)
      }

    })

    payload.forEach((online: UserDto) => {

      this.players.forEach((user: UserDto) => {
        if (user.id == online.id)
          user.defaultOffline = true
      })

    })


    this.players.sort((user_a: any, user_b: any) => {
      return user_b.defaultOffline - user_a.defaultOffline;
    })
    this.players.sort((user_a: any, user_b: any) => {
      return user_b.role.is_admin - user_a.role.is_admin;
    })
  }

  set_role(user: UserDto) {
    this.userService.get_role(user)
    this.userService.get_role_user_room(user, this.room?.id as number);
  }

  ngOnInit(): void {

    this.route.params.subscribe(({ id }) => {
      this.formMessage.patchValue({ id });
      this.socketGameNotification.getUserConnection()
        .subscribe({
          next: (payload: any) => {
            this.set_status_players(payload);
          },
        })
        
        this.room_id = id;
        this.get_list_banned();
      // this.admins = []
      this.players = []
      let user_aux: UserDto;

      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          this.me = user;
          this.userService.get_role(this.me);
          this.userService.get_role_user_room(this.me, id);
          user_aux = user;
          this.http.get(`${environment.apiUrl}user_roles/users/${this.me.id}`)
            .subscribe((entity) => {
              let data = Object.assign(entity);
              data.forEach((role_user: any) => {
                if (role_user['roleId'] == Roles.admin)
                  this.is_admin = true;

              })
            });

          this.http.get<RoomDto>(`${environment.apiUrl}room/${this.room_id}`)
            .subscribe((payload: RoomDto) => {
              this.room = payload;
              if (payload.ownerId == this.me?.id)
                this.is_owner_room = true;

              this.http.get(`${environment.apiUrl}user_room/rooms/${this.room_id}/users`)
                .subscribe((entity) => {
                  let data = Object.assign(entity);
                  for (let user in data) {
                    let player = data[user]['user'] as UserDto;
                    this.set_role(player);

                    if (player['id'] === this.room?.ownerId) {
                      player.role.is_owner_room = true;
                    }

                    player.defaultOffline = false;

                    let lol = this.players.find((user: UserDto) => user.id == player.id)
                    let is_banned = this.players_banned.find((user: UserDto) => user.id == player.id)
                    if (!lol && !is_banned) {
                      this.players.push(player)
                    }
                    else if (is_banned && !lol && (this.me?.role.is_super_admin || this.me?.role.is_admin || this.is_owner_room)) {
                      player.role.is_banned = true;
                      this.players.push(player)
                    }
                  }

                  this.socketGameNotification.joinRoomId(this.room_id as string, user_aux);
                });
            });
        });
    });

  }


  get_list_banned() {
    this.http.get<UserDto[]>(`${environment.apiUrl}ban/rooms/${this.room_id}`).
      subscribe((payload: UserDto[]) => {
        let data = Object.assign(payload);
        data.forEach((banned: any) => {
          this.players_banned.push(banned)
        })
      })
  }


  set_admin(user: UserDto) {
    if (!user.role.is_admin) {
      this.userService.post_role_user_room(user, Roles.admin, this.room?.id as number);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW IS ADMIN`, 'OK')
      this.chat.sendMessageGame(`${user.nickName} NOW IS ADMIN`, this.me?.id as number, 'game' + this.room_id);
      // this.socketGameNotification.joinRoomId(this.room?.id.toString() as string, user);

    }
  }

  deleted_admin(user: UserDto) {
    if (user.role.is_admin) {
      this.userService.deleted_role_room(user, this.room?.id as number, Roles.admin);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW ISN'T ADMIN`, 'OK')

      this.chat.sendMessageGame(`${user.nickName} NOW ISN'T ADMIN`, this.me?.id as number, 'game' + this.room_id);
      // this.socketGameNotification.joinRoomId(this.room?.id.toString() as string, user);

    }

  }

  set_silenced(user: UserDto) {
    if (!user.role.is_silenced) {
      this.userService.post_role_user_room(user, Roles.silenced, this.room?.id as number);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW IS SILENCED`, 'OK')
      this.chat.sendMessageGame(`${user.nickName} NOW IS SILENCED`, this.me?.id as number, 'game' + this.room_id);
      // this.socketGameNotification.joinRoomId(this.room?.id.toString() as string, user);

    }
  }

  set_ban(user: UserDto) {
    this.userService.post_role_user_room(user, Roles.banned, this.room?.id as number);
    this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW IS BANNED`, 'OK');
    this.chat.sendMessageGame(`${user.nickName} NOW IS BANNED`, this.me?.id as number, 'game' + this.room_id);
    this.leave(user);
  }

  un_banned(user: UserDto) {
    this.userService.delete_role_banned(user, this.room?.id as number);
    this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW IS UNBANNED`, 'OK');
    this.chat.sendMessageGame(`${user.nickName} NOW IS BANNED`, this.me?.id as number, 'game' + this.room_id);
  }

  deleted_silenced(user: UserDto) {
    if (user.role.is_silenced) {
      this.userService.deleted_role_room(user, this.room?.id as number, Roles.silenced);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW ISN'T SILENCED`, 'OK')
      this.chat.sendMessageGame(`${user.nickName} NOW ISN'T SILENCED`, this.me?.id as number, 'game' + this.room_id);
      // this.socketGameNotification.joinRoomId(this.room?.id.toString() as string, user);

    }

  }


  ngOnDestroy(): void {
    console.log("NG ONLINE DESTROYDESTROY");
    // this.socketGameNotification.roomLeave(this.room_id, this.me, false);
  }

  sendInvitationGame(user: UserDto) {
    this.socketGameNotification.sendNotification({ user: this.me, dest: user?.username, title: 'INVITE GAME' });
    this.alertService.openSnackBar('Game invitation sent', 'OK')

    // this.alertService.openRequestGame(user as UserDto, 'SEND REQUEST GAME');
  }

  goTochat(player: UserDto) {
    this.chatService.createChat(player.id)
      .subscribe((data: any) => {
        this.router.navigate(['/chat/', data.id])
      })
  }

  private _redirectToRoomLists(): void {
    this.router.navigate(['/game']);
  }

  leave(player: UserDto) {
    this.roomGameIdService.unregisterFromRoom(player.id, this.room_id)
    this.chat.sendMessageGame(`kicked player ${player.nickName}`, this.me?.id as number, 'game' + this.room_id);
    this.socketGameNotification.roomLeave(this.room_id, player, true, this.me?.username);
  }

}
