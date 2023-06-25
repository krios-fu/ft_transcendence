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


enum role {
  Admin = 3
}

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
  admins = []
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
          return user_b.is_admin - user_a.is_admin;
        })
      })
  }


  set_status_players(payload: any) {

    payload.forEach((user_online: UserDto) => {
      let lol = this.players.find((user: UserDto) => user.id == user_online.id)
      if (!lol)
        this.players.push(user_online)
    })

    payload.forEach((online: UserDto) => {

      this.admins.forEach((element: any) => {
        if (element.userId == online.id)
          online.is_admin = true;
      });

      this.players.map((user: UserDto) => {
        if (user.id == online.id)
          user.defaultOffline = true
      })
      // console.log("NOTIFICATION JOIN", this.players)


      this.players.sort((user_a: any, user_b: any) => {
        return user_b.defaultOffline - user_a.defaultOffline;
      })
      this.players.sort((user_a: any, user_b: any) => {
        return user_b.is_admin - user_a.is_admin;
      })
    })
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
      this.admins = []
      this.players = []
      let user_aux: UserDto;

      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          this.me = user;
          user_aux = user;
          // this.socketGameNotification.joinRoomNotification(this.me.username);
          this.http.get(`${environment.apiUrl}user_roles/users/${this.me.id}`)
            .subscribe((entity) => {
              let data = Object.assign(entity);
              data.forEach((role_user: any) => {
                if (role_user['roleId'] == role.Admin)
                  this.is_admin = true;
              })
            });

          this.http.get<RoomDto>(`${environment.apiUrl}room/${this.room_id}`)
            .subscribe((payload: RoomDto) => {
              this.room = payload;
              if (payload.ownerId == this.me?.id)
                this.is_owner_room = true;


              this.http.get(`${environment.apiUrl}user_roles/roles/${role.Admin}`) // roles
                .subscribe((entity) => {
                  this.admins = Object.assign(entity);
                  this.http.get(`${environment.apiUrl}user_room/rooms/${this.room_id}/users`)
                    .subscribe((entity) => {
                      let data = Object.assign(entity);
                      for (let user in data) {
                        let player = data[user]['user'] as UserDto;
                        player.is_admin = false;
                        this.admins.forEach((element: any) => {
                          if (element.userId === player['id'])
                            player.is_admin = true;
                        });
                        if (player['id'] === this.room?.ownerId) {
                          player.is_owner_room = true;
                        }

                        let lol = this.players.find((user: UserDto) => user.id == player.id)
                        if (!lol)
                          this.players.push(player)
                      }
                      this.socketGameNotification.joinRoomId(this.room_id as string, user_aux);
                    });
                });
            });
        });
    });

  }
  

  ngOnDestroy(): void {
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
    this.chat.sendMessageGame(`kicked player ${player.nickName}`, this.me?.id as number, 'game' + this.room_id);
    this.roomGameIdService.unregisterFromRoom(player.id, this.room_id)
    this.socketGameNotification.roomLeave(this.room_id, player, true, this.me?.username);
  }

}
