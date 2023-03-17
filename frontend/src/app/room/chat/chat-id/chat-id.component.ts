import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../chat';
import { FormControl, FormGroup } from '@angular/forms'; //
import { UserDto } from 'src/app/dtos/user.dto';
import { IUser, UsersService } from 'src/app/services/users.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { AlertServices } from 'src/app/services/alert.service';

@Component({
  selector: 'app-chat-id',
  templateUrl: './chat-id.component.html',
  styleUrls: ['./chat-id.component.scss'],
})
export class ChatIdComponent implements OnInit {

  state = {
    'chat': true,
    'chat-min': false,
  };
  unfold: string;
  hidden = true;

  login?= ''

  user?: UserDto;
  me?: UserDto;


  public formMessage = new FormGroup({
    message: new FormControl('')
  })


  constructor(public chat: Chat,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private http: HttpClient,
    private socketGameNotification : SocketNotificationService,
    private userService : UsersService,
    private alertService: AlertServices,


    ) {

    this.unfold = 'unfold_less';
    // this.login = this.route.snapshot.paramMap.get('id')?.toString();
  }

  ngOnInit(): void {
    this.userService.getUser('me')
    .subscribe((user : UserDto[]) => {
      this.me = user[0];
      this.socketGameNotification.joinRoomNotification(this.me.username);
    } )

    this.route.params.subscribe(({ id }) => {
      this.formMessage.patchValue({ id });


      this.login = id;

      this.chat.resetChat();
      delete this.user;

      this.http.get(`http://localhost:3000/users/me/chat/${this.login}`)
        .subscribe((entity) => {
          console.log(`CHAT ID: ${this.login}`, entity);
          let chats = Object.assign(entity)
          this.user = (chats[0].users[0].nickName == this.login)
            ? chats[0].users[0] : chats[0].users[1];
        });
      this.chat.getMessageApi(id);
    });
  }


  sendMessage(): boolean {
    const { message, room } = this.formMessage.value;
    console.log(message, room)
    if (message.trim() == '')
      return false;
    this.chat.sendMessage(message, this.user?.username as string);
    this.formMessage.controls['message'].reset();
    return true;
  }

  sendInvitationGame(){
    this.socketGameNotification.sendNotification({ user: this.me, dest : this.user?.username, title: 'INVITE GAME'});
    this.alertService.openRequestGame(this.user as UserDto, 'SEND REQUEST GAME');
  }

  chatMin(): void {
    this.state["chat"] = !this.state["chat"];
    this.state["chat-min"] = !this.state["chat-min"];
    this.unfold = (this.state["chat-min"]) ? 'unfold_more' : 'unfold_less';
    this.chat.count_new_msg = 0;
  }

  getSocketId() {
    return this.chat.getSocketId() as string;
  }
  viewMessage() {
    return this.chat.getMessage();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;

  }
}
