import { Component, OnInit } from '@angular/core';
import {Chat} from "./chat";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor( private chat : Chat) {
  }


  ngOnInit(): void {

  }

  sendMessage() {
    this.chat.sendMessage("hello world!!!!!");
  }

  viewMessage() {
    return this.chat.getMessage();
  }
}
