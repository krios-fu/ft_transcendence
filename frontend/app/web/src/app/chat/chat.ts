import {Injectable} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {map} from "rxjs";

@Injectable()
export class Chat {

  constructor( private socket : Socket ) {
  }

  sendMessage( msg : string ){
    this.socket.emit(msg);
  }

  getMessage() {
    return  this.socket.fromEvent('message').pipe( map( (data : any ) => data.msg )) ;
  }
}
