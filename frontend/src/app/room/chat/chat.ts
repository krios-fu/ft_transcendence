import {Injectable, Input, OnInit} from "@angular/core";
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";

import {map} from "rxjs";
import {newArray} from "@angular/compiler/src/util";
import { AuthService } from "../../services/auth.service";

export class message {
  content: string;
  sender : number;
  id_chat ?: number;

  constructor( content : string , sender : number, chat ?: number) {
    this.content = content;
    this.sender = sender;
    this.id_chat = chat;
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
      console.log("MESSAGE --> socket",message)
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

  sendMessage( txt : string, sender : number, id_chat ?:number )  {
    const msg = new message(txt, sender, id_chat)
    this.socket.emit('message', msg);
  }

  // getSocketId(){
  //   return this.authService.getAuthUser();
  // }

  resetChat(){
    this.msg = [];
  }

//   [
//     {
//         "createdAt": "2023-03-17T21:06:20.029Z",
//         "updatedAt": "2023-03-17T21:06:20.029Z",
//         "id": 1,
//         "content": "hola",
//         "chatUserId": "9",
//         "chatUser": {
//             "createdAt": "2023-03-15T19:38:07.074Z",
//             "updatedAt": "2023-03-15T19:38:07.074Z",
//             "id": "9",
//             "chatId": 5,
//             "userId": 1,
//             "chat": {
//                 "begin_at": "2023-03-15T19:38:06.970Z",
//                 "id": 5
//             }
//         }
//     },
//     {
//         "createdAt": "2023-03-17T21:07:49.513Z",
//         "updatedAt": "2023-03-17T21:07:49.513Z",
//         "id": 2,
//         "content": "pepe",
//         "chatUserId": "9",
//         "chatUser": {
//             "createdAt": "2023-03-15T19:38:07.074Z",
//             "updatedAt": "2023-03-15T19:38:07.074Z",
//             "id": "9",
//             "chatId": 5,
//             "userId": 1,
//             "chat": {
//                 "begin_at": "2023-03-15T19:38:06.970Z",
//                 "id": 5
//             }
//         }
//     }
// ]

  getMessageApi(id_chat : string){
    this.http.get(`http://localhost:3000/message/chat/${id_chat}`)
    .subscribe((entity : any) => {
      let data = Object.assign(entity); 
      // console.log('Chatt mesasge', data);
      // this.id = data[0].id;
      this.socket.emit('join_room', this.id);
      // console.log(this.id);
      //  const {messages} = data[0];
        for(let msg in data){
          const msgs = new message(data[msg].content, data[msg]['chatUser'].userId )
          //  console.log('messaje []', msgs);
          this.msg.unshift(msgs);
        }
    })
  }

  getMessage() {
    return this.msg;
  }
}
