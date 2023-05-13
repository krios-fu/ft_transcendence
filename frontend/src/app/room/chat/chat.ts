import { Injectable, Input, OnInit } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { HttpClient } from "@angular/common/http";

import { Observable, map } from "rxjs";
import { newArray } from "@angular/compiler/src/util";
import { AuthService } from "../../services/auth.service";

export class message {
  content: string;
  sender: number;
  id_chat?: number;

  constructor(content: string, sender: number, chat?: number) {
    this.content = content;
    this.sender = sender;
    this.id_chat = chat;
  }
}

@Injectable()
export class Chat implements OnInit {

  constructor(private socket: Socket) {}

  ngOnInit(): void {
  }

  joinRoom(id_chat: string) {
    this.socket.emit('join_room', id_chat);
  }

  sendMessage(txt: string, sender: number, id_chat?: number) {
    const msg = new message(txt, sender, id_chat)
    this.socket.emit('message', msg);
  }


  public getMessages(): Observable<message> {
    return new Observable<message>(observer => {
      this.socket.fromEvent('new_message').subscribe((message: any) => {
        observer.next(message);
      });
    });
  }


}
