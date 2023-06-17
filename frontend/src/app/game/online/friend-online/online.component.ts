import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';


enum role {
  Admin = 1
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
  admins = []

  public formMessage = new FormGroup({
    message: new FormControl('')
  })

  constructor(private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute,
    private socketGameNotification: SocketNotificationService,
    private userService: UsersService,
    private alertService: AlertServices,
    private chatService: ChatService) {

    this.socketGameNotification.getUserConnection()
      .subscribe((payload: any) => {
        payload.forEach((online: UserDto) => {

          this.admins.forEach((element: any) => {
            if (element.userId === online.id)
              online.is_admin = true;
          });

          this.players.map((user: UserDto) => {
            if (user.id === online.id)
              user.defaultOffline = true
          })

          this.players.sort((user_a: any, user_b: any) => {
            return user_b.defaultOffline - user_a.defaultOffline;
          })
          this.players.sort((user_a: any, user_b: any) => {
            return user_b.is_admin - user_a.is_admin;
          })
        })
      })

    this.socketGameNotification.userLeave()
      .subscribe((payload: any) => {
        this.players.map((user: UserDto) => {
          if (user.id === payload.user.id)
            user.defaultOffline = false
        })
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
      this.room_id = id;
      this.admins = []
      this.players = []

      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          this.me = user;
          // this.socketGameNotification.joinRoomNotification(this.me.username);
          this.socketGameNotification.joinRoomId(this.room_id as string, this.me);
          this.http.get(`${environment.apiUrl}user_roles/users/${this.me.id}`)
            .subscribe((entity) => {
              let data = Object.assign(entity);
              if (data.length && data[0]['roleId'] == role.Admin)
                this.is_admin = true;
            });
        });


      this.http.get(`http://localhost:3000/user_roles/roles/${role.Admin}`) // roles
        .subscribe((entity) => {
          this.admins = Object.assign(entity);
          this.http.get(`http://localhost:3000/user_room/rooms/${this.room_id}/users`)
            .subscribe((entity) => {
              let data = Object.assign(entity);
              for (let user in data) {
                let player = data[user]['user'] as UserDto;
                player.is_admin = false;
                this.admins.forEach((element: any) => {
                  if (element.userId === player['id'])
                    player.is_admin = true;
                });
                this.players.push(player)
              }
            });
        });
    });

  }

  ngOnDestroy(): void {
    console.log("NG ONLINE DESTROYDESTROY");
    this.socketGameNotification.roomLeave(this.room_id, this.me);
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

}
