import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomDto } from 'src/app/dtos/room.dto';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { RoomGameIdService } from '../../room-game-id/room-game-id.service';
import { Chat } from 'src/app/chat/chat';
import { Roles } from 'src/app/roles';
import { Friendship } from 'src/app/dtos/block.dto';


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
    public chat: Chat,
    private readonly roomGameIdService: RoomGameIdService,
  ) {

    this.update_player();
    this.socketGameNotification.userLeave()
      .subscribe((payload: any) => {
        this.players.map((user: UserDto) => {
          if (user.id === payload.user.id)
            user.defaultOffline = false

        })

        if (payload.user.id === this.me?.id && this.me?.username !== payload.kicker) {
          this._redirectToRoomLists();
        }

        // if (payload.user.role && !payload.user.role.is_banned)
          
          // this.players = this.players.filter((player: UserDto) => player.id !== payload.user.id)

        this.players.sort((user_a: any, user_b: any) => {
          return user_b.defaultOffline - user_a.defaultOffline;
        });
        this.players.sort((user_a: any, user_b: any) => {
          return user_b.role.is_admin - user_a.role.is_admin;
        });
        this.players.sort((user_a: any, user_b: any) => {
          return user_b.role.is_owner_room - user_a.role.is_owner_room;
        });
        this.players.sort((user_a: any, user_b: any) => {
          return user_b.role.is_super_admin - user_a.role.is_super_admin;
        });
      })
  }


  update_player() {
    this.socketGameNotification.playerUpdate()
      .subscribe((payload: any) => {
        this.players.forEach((user: UserDto, index: number) => {
          if (user.id == payload.user.id)
            this.players[index] = Object.assign(payload.user);
          if (payload.user.id == this.me?.id)
            this.me = Object.assign(payload.user);
        });
      })
  }

  set_status_players(payload: any) {


    payload.forEach((user_online: UserDto) => {
      console.log(user_online);
      this.userService.get_blocked_user_id(user_online)
        .subscribe((_friend: Friendship) => {

          if (!(_friend && _friend.block?.blockSenderId === user_online.id)) {

            let lol = this.players.find((user: UserDto) => user.id == user_online.id)
            let is_banned = this.players_banned.find((user: UserDto) => user.id == user_online.id)
            if (!lol && !is_banned) {
              user_online.defaultOffline = true;
              this.players.push(user_online)
            }
            else if (is_banned && !lol && (this.me?.role.is_super_admin || this.me?.role.is_admin || this.is_owner_room)) {
              user_online.role.is_banned = true;
              this.players.push(user_online)
            }
            else
              this.players.forEach((user: UserDto, index: number) => {
                if (user.id === user_online.id) {
                  user_online.defaultOffline = true;
                  this.players[index] = Object.assign(user_online);
                }
              })
          }
        })
    })



    this.players.sort((user_a: any, user_b: any) => {
      return user_b.defaultOffline - user_a.defaultOffline;
    });
    this.players.sort((user_a: any, user_b: any) => {
      return user_b.role.is_admin - user_a.role.is_admin;
    });
    this.players.sort((user_a: any, user_b: any) => {
      return user_b.role.is_owner_room - user_a.role.is_owner_room;
    });
    this.players.sort((user_a: any, user_b: any) => {
      return user_b.role.is_super_admin - user_a.role.is_super_admin;
    });
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
      this.players_banned = []
      this.players = []
      this.get_list_banned();
      let user_aux: UserDto;

      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          this.me = user;
          this.userService.get_role_user_room(this.me, id);
          this.userService.get_role(this.me);
          // this.userService.post_role

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
                    if (this.room?.ownerId === user_aux.id) {
                      user_aux.role.is_owner_room = true;
                    }

                    this.userService.get_blocked_user_id(player)
                      .subscribe((_friend: Friendship) => {

                        if (!(_friend && _friend.block?.blockSenderId === player.id)) {
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
                      });
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
      user.role.is_admin = true;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);

    }
  }

  deleted_admin(user: UserDto) {
    if (user.role.is_admin) {
      this.userService.deleted_role_room(user, this.room?.id as number, Roles.admin);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW ISN'T ADMIN`, 'OK')

      this.chat.sendMessageGame(`${user.nickName} NOW ISN'T ADMIN`, this.me?.id as number, 'game' + this.room_id);
      // this.socketGameNotification.joinRoomId(this.room?.id.toString() as string, user);
      user.role.is_admin = false;

      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);

    }

  }

  set_silenced(user: UserDto) {
    if (!user.role.is_silenced) {
      this.userService.post_role_user_room(user, Roles.silenced, this.room?.id as number);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} NOW IS SILENCED`, 'OK')
      this.chat.sendMessageGame(`${user.nickName} NOW IS SILENCED`, this.me?.id as number, 'game' + this.room_id);
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);

      user.role.is_silenced = true;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);



    }
  }

  deleted_silenced(user: UserDto) {
    if (user.role.is_silenced) {
      this.userService.deleted_role_room(user, this.room?.id as number, Roles.silenced);
      this.alertService.openSnackBar(`${user.nickName.toUpperCase()} ISN'T NOW SILENCED`, 'OK')
      this.chat.sendMessageGame(`${user.nickName} ISN'T NOW SILENCED`, this.me?.id as number, 'game' + this.room_id);
      user.role.is_silenced = false;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);


    }

  }

  set_ban(user: UserDto) {
    this.userService.post_role_user_room(user, Roles.banned, this.room?.id as number);
    // this.alertService.openSnackBar(`${user.nickName.toUpperCase()} IS NOW BANNED`, 'OK');
    user.role.is_banned = true;
    this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    this.chat.sendMessageGame(`${user.nickName} IS NOW BANNED`, this.me?.id as number, 'game' + this.room_id);

    // this.leave(user);
  }

  un_banned(user: UserDto) {
    this.userService.delete_role_banned(user, this.room?.id as number);
    this.alertService.openSnackBar(`${user.nickName.toUpperCase()} IS NOW UNBANNED`, 'OK');
    user.role.is_banned = false;

    this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    this.chat.sendMessageGame(`${user.nickName} IS N'T NOW  BANNED`, this.me?.id as number, 'game' + this.room_id);

  }




  ngOnDestroy(): void {
    // this.userService.deleted_role_room(this.me as UserDto, this.room?.id as number, Roles.player)
    this.socketGameNotification.roomLeave(this.room_id, this.me, false, this.me?.username);

  }

  sendInvitationGame(user: UserDto) {
    this.socketGameNotification.sendNotification({ user: this.me, dest: user?.username, title: 'INVITE GAME' });
    this.alertService.openSnackBar('Game invitation sent', 'OK')

    // this.alertService.openRequestGame(user as UserDto, 'SEND REQUEST GAME');
  }


  private _redirectToRoomLists(): void {
    this.router.navigate(['/game']);
  }

  leave(player: UserDto) {
    this.roomGameIdService.unregisterFromRoom(player.id, this.room_id)
    this.chat.sendMessageGame(`kicked player ${player.nickName}`, this.me?.id as number, 'game' + this.room_id);
    this.socketGameNotification.roomLeave(this.room_id, player, true, this.me?.username);
  }


  karen_level_one(player: UserDto, user_view : UserDto){

    if (user_view.role.is_super_admin && !player.role.is_super_admin)
        return true;
    if (user_view.role.is_moderator && (!player.role.is_super_admin && !player.role.is_moderator))
        return true;
    if (this.is_owner_room && (!player.role.is_super_admin && !player.role.is_moderator))
        return true;
    if (user_view.role.is_admin && (!player.role.is_super_admin && !player.role.is_moderator && !player.role.is_admin && !this.is_owner_room))
        return true;

    return false;
  }

  karen(player: UserDto, user_view : UserDto){

    if (user_view.role.is_super_admin && !player.role.is_super_admin)
        return true;
    if (user_view.role.is_moderator && (!player.role.is_super_admin && !player.role.is_moderator))
        return true;
    if (this.is_owner_room && (!player.role.is_super_admin && !player.role.is_moderator))
        return true;
    return false;
  }
}
