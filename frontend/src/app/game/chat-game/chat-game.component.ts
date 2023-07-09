import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDto } from 'src/app/dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { message } from 'src/app/chat/chat';
import { Chat } from 'src/app/chat/chat';
import { Friendship } from 'src/app/dtos/block.dto';


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
    private socketGameNotification: SocketNotificationService,
    private userService: UsersService,
  ) {

    this.unfold = 'unfold_less';
    this.update_player();
  }

  ngOnInit(): void {

    this.route.params.subscribe(({ id }) => {
      this.formMessage.patchValue({ id });
      this.messages = [];
      this.id = id;
      this.chat.joinRoom( 'game' + id);
      this.getMessage();
      this.userService.getUser('me')
        .subscribe((user: UserDto) => {
          this.me = user;

          this.userService.get_role(this.me);
          this.userService.get_role_user_room(this.me, this.id as number);
          delete this.user;

        });
    });
  }

  update_player(){
    this.socketGameNotification.playerUpdate()
    .subscribe((payload : any) =>{
          if (this.me?.id == payload.user.id)
            this.me = Object.assign(payload.user);
    })
  }

  getMessage() {
    this.chat.getMessagesGame().subscribe(message => {
      this.userService.getUserById(message.sender)
      .subscribe((user: UserDto) => {
        message.avatar = user.photoUrl;

        this.userService.get_blocked_user_id(user)
        .subscribe((friend: Friendship) => {
          if( !(friend && friend.block?.blockSenderId === this.me?.id))
              this.messages.unshift(message);
        })
      })
    });
  }

  sendMessage(): boolean {
    const { message, room } = this.formMessage.value;
    if (!message || message.trim() == '')
      return false;
    this.chat.sendMessageGame(message, this.me?.id as number, 'game' + this.id);
    this.formMessage.controls['message'].reset();
    return true;
  }

  sendInvitationGame() {
    this.socketGameNotification.sendNotification({ user: this.me, dest: this.user?.username, title: 'INVITE GAME' });
  }

  getMeId() {
    return this.me?.id as number
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

}
