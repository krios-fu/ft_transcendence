import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {map} from "rxjs";

@Injectable()
export class Chat {

  constructor( private socket : Socket ) {
  }

  sendMessage( msg : string )  {

    this.socket.emit("message", msg);

  }

  getMessage() {
    return  this.socket.fromEvent('message');
  }
}
