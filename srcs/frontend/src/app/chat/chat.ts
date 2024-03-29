import { Injectable, Input, OnInit } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

export class message {
  content: string;
  sender: number;
  id_chat?: number | string;
  avatar ?: string;

  constructor(content: string, sender: number, chat?: number | string, avatar ?: string) {
    this.content = content;
    this.sender = sender;
    this.id_chat = chat;
    this.avatar = avatar;
  }
}

@Injectable()
export class Chat implements OnInit {

  constructor(private socket: Socket) {}

  ngOnInit(): void {}

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

  public getMessagesGame(): Observable<message> {
    return new Observable<message>(observer => {
      this.socket.fromEvent('new_message-game').subscribe((message: any) => {
        observer.next(message);
      });
    });
  }

  sendMessageGame(txt: string, sender: number, id_chat?: number | string) {
    const msg = new message(txt, sender, id_chat)
    this.socket.emit('message-game', msg);
  }
}
