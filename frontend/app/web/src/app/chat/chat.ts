import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {map} from "rxjs";
import {newArray} from "@angular/compiler/src/util";

@Injectable()
export class Chat {

  public message : string [] = [] ;

  constructor( private socket : Socket ) {

      this.socket.on('message', (msg : any ) => {
        console.log("---> " , msg);
        this.message.push(msg);
      });

  }

  sendMessage( msg : string )  {

    this.socket.emit('message', msg);

  }

  getMessage() {
    return this.message;
  }
}
