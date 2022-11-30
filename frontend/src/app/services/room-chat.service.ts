import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RoomChatService {
  constructor(
    private socket: Socket,
  ) { 
    this.recvMessage();
  }
  messages: string[] = [];
  message: string = "";

  recvMessage(): void {
    console.log("we here");
    this.socket.on("room-chat", (msg: string) => {
      this.messages.push(msg);
      console.log("missatge: " + msg);
    })
  }

  sendMessage(message: string): void {
    this.socket.emit("room-chat", message, (data: string) => {
      console.log("sendeando missatge: " + data);
    });
  }
}