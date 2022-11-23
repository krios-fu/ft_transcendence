import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../chat';
import { FormControl, FormGroup } from '@angular/forms'; //

@Component({
  selector: 'app-chat-id',
  templateUrl: './chat-id.component.html',
  styleUrls: ['./chat-id.component.scss'],
  inputs: ['login'],
})
export class ChatIdComponent implements OnInit {

  state = {
    'chat': true,
    'chat-min': false,
  };
  unfold: string;
  hidden = true;

  login?= ''

  user?: any;

  public formMessage = new FormGroup({
    message: new FormControl('')
  })


  constructor(public chat: Chat,
    private route: ActivatedRoute,
    private router_: Router,
    private http: HttpClient) {
    this.unfold = 'unfold_less';
    console.log("CHAT COMPONENT")
    // this.login = this.route.snapshot.paramMap.get('id')?.toString();
  }

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      this.formMessage.patchValue({ id });


      this.login = id;

      this.chat.resetChat();

      // this.chat.joinRoom(id);
      // friend chat
      this.http.get('http://localhost:3000/users/' + this.login)
        .subscribe((user) => {
          this.user = Object.assign(user);
        });
      this.chat.getMessageApi(id);
    });
  }
  sendMessage(): boolean {
    const { message, room } = this.formMessage.value;
    console.log(message, room)
    if (message.trim() == '')
      return false;
    this.chat.sendMessage(message, this.user['username']);
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
