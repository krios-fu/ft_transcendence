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
  room?: RoomDto;

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
  ) { }


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
      this.players = []
      let user_aux: UserDto;

      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          user_aux = user;
          this.userService.get_role_user_room(user_aux, id);
          this.userService.get_role(user_aux);

          this.http.get<RoomDto>(`${environment.apiUrl}room/${this.room_id}`)
            .subscribe((payload: RoomDto) => {
              this.room = payload;
              if (payload.ownerId == user_aux.id) {
                this.is_owner_room = true;
                user_aux.role.is_owner_room = true;
              }
              this.me = user_aux;

              this.socketGameNotification.joinRoomId(this.room_id as string, this.me);

              this.http.get(`${environment.apiUrl}user_room/rooms/${this.room_id}/users`)
                .subscribe((entity) => {
                  let data = Object.assign(entity);
                  for (let user in data) {
                    let player = data[user]['user'] as UserDto;
                    if (player.id !== this.me?.id) {
                      this.set_role(player);
                      player.defaultOffline = false;
                      if (!this.players.some((_player: UserDto) => _player.id === player.id)) {
                        this.players.push(player);
                      }
                    }
                  }
                  this.get_list_banned();
                });
            });
        });

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
    });
  }



  update_player() {
    this.socketGameNotification.playerUpdate()
      .subscribe((payload: any) => {
        const refIndex = this.players.findIndex((user: UserDto) => user.id === payload.user.id);
        if (refIndex !== -1) {
          Object.assign(this.players[refIndex], payload.user);
        }
      })
  }

  set_status_players(payload: any) {
    payload.forEach((user_online: UserDto, index: number) => {
      this.userService.get_blocked_user_id(user_online)
      .subscribe((_friend: Friendship) => {
        
        if (!(_friend && _friend.block?.blockSenderId === user_online.id)) {
          
          if (!this.players.some((_player: UserDto) => _player.id === user_online.id)) {
              this.set_role(user_online);
              this.players.push(user_online);
            }
            else {
              const refIndex = this.players.findIndex((user: UserDto) => user.id === user_online.id);
              if (refIndex !== -1) {
                Object.assign(this.players[refIndex], user_online);
                this.set_role(this.players[refIndex]);

              }
            }
            this.players.forEach((user: UserDto) => {
              if (!user.role.is_owner_room)
                this.set_role(user);
              else {
                this.set_role(user);
                user.role.is_owner_room = true;
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

  get_list_banned() {
    this.http.get<UserDto[]>(`${environment.apiUrl}ban/rooms/${this.room_id}`).
      subscribe((payload: UserDto[]) => {
        let data = Object.assign(payload);
        data.forEach((banned: UserDto) => {
          banned.role = {
            is_super_admin: false,
            is_admin: false,
            is_owner_room: false,
            is_banned: true,
            is_silenced: false,
            is_moderator: false,
            is_player: false
          }
          this.players.push(banned)
        })
      })
  }

  set_role(user: UserDto) {
    this.userService.get_role(user)
    this.userService.get_role_user_room(user, this.room?.id as number);
  }

  set_admin(user: UserDto) {
    if (!user.role.is_admin) {
      this.userService.post_role_user_room(user, Roles.admin, this.room?.id as number);
      this.chat.sendMessageGame(`${user.nickName} NOW IS ADMIN`, this.me?.id as number, 'game' + this.room_id);
      user.role.is_admin = true;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    }
  }

  deleted_admin(user: UserDto) {
    if (user.role.is_admin) {
      this.userService.deleted_role_room(user, this.room?.id as number, Roles.admin);
      this.chat.sendMessageGame(`${user.nickName} NOW ISN'T ADMIN`, this.me?.id as number, 'game' + this.room_id);
      user.role.is_admin = false;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    }
  }

  set_silenced(user: UserDto) {
    if (!user.role.is_silenced) {
      this.userService.post_role_user_room(user, Roles.silenced, this.room?.id as number);
      this.chat.sendMessageGame(`${user.nickName} NOW IS SILENCED`, this.me?.id as number, 'game' + this.room_id);
      user.role.is_silenced = true;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    }
  }

  deleted_silenced(user: UserDto) {
    if (user.role.is_silenced) {
      this.userService.deleted_role_room(user, this.room?.id as number, Roles.silenced);
      this.chat.sendMessageGame(`${user.nickName} ISN'T NOW SILENCED`, this.me?.id as number, 'game' + this.room_id);
      user.role.is_silenced = false;
      this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    }
  }

  set_ban(user: UserDto) {
    this.userService.post_role_user_room(user, Roles.banned, this.room?.id as number);
    user.role.is_banned = true;
    this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    this.chat.sendMessageGame(`${user.nickName} IS NOW BANNED`, this.me?.id as number, 'game' + this.room_id);

  }

  un_banned(user: UserDto) {
    this.userService.delete_role_banned(user, this.room?.id as number);
    user.role.is_banned = false;

    this.socketGameNotification.playerUpdateEmit(this.room_id as string, user);
    this.chat.sendMessageGame(`${user.nickName} IS N'T NOW  BANNED`, this.me?.id as number, 'game' + this.room_id);

  }


  ngOnDestroy(): void {
    this.socketGameNotification.roomLeave(this.room_id, this.me, false, this.me?.username);
  }

  sendInvitationGame(user: UserDto) {
    this.socketGameNotification.sendNotification({ user: this.me, dest: user?.username, title: 'INVITE GAME' });
    this.alertService.openSnackBar('Game invitation sent', 'OK')
  }


  private _redirectToRoomLists(): void {
    this.router.navigate(['/game']);
  }

  leave(player: UserDto) {
    this.roomGameIdService.unregisterFromRoom(player.id, this.room_id)
    this.chat.sendMessageGame(`kicked player ${player.nickName}`, this.me?.id as number, 'game' + this.room_id);
    this.socketGameNotification.roomLeave(this.room_id, player, true, this.me?.username);
  }


  karen_level_one(player: UserDto, user_view: UserDto) {

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

  karen(player: UserDto, user_view: UserDto) {

    if (user_view.role.is_super_admin && !player.role.is_super_admin)
      return true;
    if (user_view.role.is_moderator && (!player.role.is_super_admin && !player.role.is_moderator))
      return true;
    if (this.is_owner_room && (!player.role.is_super_admin && !player.role.is_moderator))
      return true;
    return false;
  }
}