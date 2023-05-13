import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Chat } from '../../chat';
import { FormControl, FormGroup } from '@angular/forms'; //
import { UserDto } from 'src/app/dtos/user.dto';
import { IUser, UsersService } from 'src/app/services/users.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { AlertServices } from 'src/app/services/alert.service';
import { Location } from '@angular/common';
import { message } from 'src/app/room/chat/chat';
import { catchError, throwError } from 'rxjs';
import { Chat } from 'src/app/room/chat/chat';


@Component({
  selector: 'app-chat-game',
  templateUrl: './chat-game.component.html',
  styleUrls: ['./chat-game.component.scss']
})
export class ChatGameComponent implements OnInit {



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
    private chatService: ChatService,
    private http: HttpClient,
    private socketGameNotification: SocketNotificationService,
    private userService: UsersService,
    private alertService: AlertServices,
    private router: Router


  ) {

    this.unfold = 'unfold_less';
  }

  ngOnInit(): void {

    this.route.params.subscribe(({ id }) => {
      this.formMessage.patchValue({ id });
      this.messages = [];
      this.id = id;
      this.chat.joinRoom( 'game' + id);
      this.getMessage();
      this.userService.getUser('me')
        .subscribe((user: UserDto[]) => {
          this.me = user[0];
          this.socketGameNotification.joinRoomNotification(this.me.username);
          delete this.user;

        });
    });
  }


  getMessage() {

    this.chat.getMessagesGame().subscribe(message => {
      this.userService.getUserById(message.sender)
      .subscribe((user: UserDto) => {
        message.avatar = user.photoUrl;
        this.messages.unshift(message);
      })
    });
  }



  sendMessage(): boolean {
    const { message, room } = this.formMessage.value;
    console.log(message, room)
    if (!message || message.trim() == '')
      return false;
    this.chat.sendMessageGame(message, this.me?.id as number, 'game' + this.id);
    this.formMessage.controls['message'].reset();
    return true;
  }

  sendInvitationGame() {
    this.socketGameNotification.sendNotification({ user: this.me, dest: this.user?.username, title: 'INVITE GAME' });
    this.alertService.openRequestGame(this.user as UserDto, 'SEND REQUEST GAME');
  }



  getMeId() {
    return this.me?.id as number
  }



  toggleBadgeVisibility() {
    this.hidden = !this.hidden;

  }



}
