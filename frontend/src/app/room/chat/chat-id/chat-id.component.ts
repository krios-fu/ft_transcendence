import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../chat';
import { FormControl, FormGroup } from '@angular/forms'; //
import { UserDto } from 'src/app/dtos/user.dto';
import { IUser, UsersService } from 'src/app/services/users.service';
import { ChatService } from 'src/app/services/chat.service';

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

  public formMessage = new FormGroup({
    message: new FormControl('')
  })


  constructor(public chat: Chat,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private http: HttpClient) {

    this.unfold = 'unfold_less';
    console.log("CHAT COMPONENT", this.route.params)
    // this.login = this.route.snapshot.paramMap.get('id')?.toString();
  }

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
    this.formMessage.patchValue({ id });


      this.login = id;

      this.chat.resetChat();
      delete this.user;

      this.http.get(`http://localhost:3000/users/me/chat/${this.login}`)
        .subscribe((entity) => {
          console.log(`CHAT ID: ${this.login}`, entity);
          let friend = Object.assign(entity)
          if( friend[0].membership[0].user.nickName == this.login)
            this.user = friend[0].membership[0].user
          else 
            this.user = friend[0].membership[1].user

          // this.user = Object.assign(user[0].);
        } );
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

    // this.state["chat"] =  true;
  }
}
