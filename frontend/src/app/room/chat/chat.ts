import {Injectable, Input, OnInit} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";

import {map} from "rxjs";
import {newArray} from "@angular/compiler/src/util";
import { AuthService } from "../../services/auth.service";

export class message {
  content: string;
  sender : string;
  id_chat : string;
  reciver : string;

  constructor( chat : string, msg : string , sender : string, reciver : string) {
    this.content = msg;
    this.sender = sender;
    this.id_chat = chat;
    this.reciver = reciver;
  }
}

@Injectable()
export class Chat implements OnInit{

  public msg : message [] = [];
  public id = '**';
  count_new_msg = 0;
  @Input()
  profile = {}



  constructor( private socket : Socket, private http : HttpClient, private authService: AuthService  ) {


    socket.fromEvent('new_message').subscribe((message: any) => {
      let new_message = message as message;
        this.count_new_msg += 1;
        this.msg.unshift(new_message);
    })
  }

  ngOnInit(): void {
  }

  joinRoom(id_chat : string){
    this.socket.emit('join_room', id_chat);
  }

  sendMessage( txt : string, reciver : string )  {
    const msg = new message(this.id, txt, `${this.authService.getAuthUser()}`, reciver);
    this.socket.emit('message', msg);
  }

  getSocketId(){
    return this.authService.getAuthUser();
  }

  resetChat(){
    this.msg = [];
  }

  getMessageApi(login : string){
    this.http.get(`http://localhost:3000/users/${this.authService.getAuthUser()}/chat/${login}`)
    .subscribe((entity : any) => {
      let data = Object.assign(entity); 
      this.id = data[0].id;
      this.socket.emit('join_room', this.id);
      console.log(this.id);
       const {messages} = data[0];
        for(let msg in messages){
          const msgs = new message(login, messages[msg].content, messages[msg].author.username, login)
          this.msg.unshift(msgs);
        }
    })
  }

  getMessage() {
    return this.msg;
  }
}
