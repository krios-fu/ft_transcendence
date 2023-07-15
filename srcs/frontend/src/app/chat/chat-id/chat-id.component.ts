import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../chat';
import { FormControl, FormGroup } from '@angular/forms'; //
import { UserDto } from 'src/app/dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { AlertServices } from 'src/app/services/alert.service';
import { message } from '../chat';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Friendship } from 'src/app/dtos/block.dto';

@Component({
  selector: 'app-chat-id',
  templateUrl: './chat-id.component.html',
  styleUrls: ['./chat-id.component.scss'],
})
export class ChatIdComponent implements OnInit, OnDestroy {

  unfold: string;
  hidden = true;
  login?= ''
  user?: UserDto;
  me?: UserDto;
  id?: number;
  public messages: message[] = [];
  public formMessage = new FormGroup({
    message: new FormControl('')
  })

  constructor(public chat: Chat,
    private route: ActivatedRoute,
    private http: HttpClient,
    private socketGameNotification: SocketNotificationService,
    private userService: UsersService,
    private alertService: AlertServices,
    private authService: AuthService,

  ) { this.unfold = 'unfold_less'; }

  ngOnInit(): void {

    this.route.params.subscribe(({ id }) => {
      this.formMessage.patchValue({ id });
      this.messages = [];
      this.id = id;
      this.chat.joinRoom(id);
      this.getMessageApi(id);
      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          this.me = user;
          delete this.user;
          this.http.get(`${environment.apiUrl}chat/${id}`)
            .pipe(
              catchError(error => {
                this.alertService.openSnackBar('CHAT NO FOUND', 'OK')
                // Puedes realizar acciones adicionales en caso de error, como mostrar un mensaje de error al usuario
                return throwError('Ocurrió un error en la solicitud HTTP. Por favor, inténtalo de nuevo más tarde.');
              })
            )
            .subscribe((entity) => {
              let chats = Object.assign(entity);
              let id_friend = (chats[0].users[0].userId == this.me?.id) ? chats[0].users[1].userId : chats[0].users[0].userId;

              this.userService.getUserById(id_friend)
                .subscribe((user: UserDto) => {
                  this.user = user;
                  this.userService.get_blocked_user_id(this.user)
                  .subscribe((friend: Friendship)=>{
                    if (friend && friend.block?.blockSenderId !== friend.id && friend.block?.blockSenderId !== this.me?.id) {
                      this.alertService.openSnackBar(`YOU CANNOT ACCESS THIS CHAT`, 'OK');
                      this.authService.redirectHome()
                    }

                  })

                }, error => {
                });
            }, error => {});
        });
    });
  }


  getMessageApi(id_chat: string) {
    this.http.get(`${environment.apiUrl}message/chat/${id_chat}`)
      .subscribe((entity: any) => {
        let data = Object.assign(entity);
        for (let msg in data) {
          const msgs = new message(data[msg].content, data[msg]['chatUser'].userId)
          this.messages.unshift(msgs);
        }
      })
    this.chat.getMessages().subscribe(message => {
      this.messages.unshift(message);
    });
  }



  sendMessage(): boolean {
    const { message, room } = this.formMessage.value;
    if (!message || message.trim() == '')
      return false;
    this.chat.sendMessage(message, this.me?.id as number, this.id);
    this.formMessage.controls['message'].reset();
    return true;
  }

  sendInvitationGame() {
    this.socketGameNotification.sendNotification({ user: this.me, dest: this.user?.username, title: 'INVITE GAME' });
    this.alertService.openSnackBar('Game invitation sent', 'OK')
  }

  getMeId() { return this.me?.id as number }

  toggleBadgeVisibility() { this.hidden = !this.hidden; }

  ngOnDestroy(): void { }
}
