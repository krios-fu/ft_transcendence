import {Injectable, Input, OnInit} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {map} from "rxjs";
import {newArray} from "@angular/compiler/src/util";

export class message {
  msg : string;
  sender : string;
  constructor(msg : string , sender : string) {
    this.msg = msg;
    this.sender = sender;
  }
}

@Injectable()
export class Chat {

  public msg : message [] = [];
  public id : string;
  @Input()
  profile = {}

  constructor( private socket : Socket ) {

    this.id = this.socket.ioSocket.id;
    this.socket.on('message', (msg : message ) => {
      console.log("msg ---->", msg)
      if( msg.sender != this.getSocketId() )
        this.msg.push(msg);
    });

  }


  sendMessage( txt : string )  {
    this.id = this.socket.ioSocket.id;
    const msg = new message(txt, this.socket.ioSocket.id );
    this.socket.emit('message', msg);
    this.msg.push(msg);
  }

  getSocketId(){
    return this.id;
  }

  getMessage() {
    return this.msg;
  }
}
