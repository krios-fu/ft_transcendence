import {AfterViewChecked, AfterViewInit, Component, ElementRef,  OnInit, ViewChild} from '@angular/core';

import {FormControl, FormGroup} from '@angular/forms'; //
import {Chat} from "./chat";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{

  state = {
    'chat' : true,
    'chat-min' : false,
  };
  unfold : string;
  close : boolean;

  public formMessage= new FormGroup({
    message : new FormControl('')
  })



  constructor( private chat : Chat, private route: ActivatedRoute)  {
    this.unfold = 'unfold_less';
    this.close = false;
  }


  ngOnInit(): void {
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );

  }


  sendMessage() : boolean {
    const { message, room } = this.formMessage.value;
    console.log( message, room)
    if( message.trim() == '' )
      return false;
    this.chat.sendMessage( message );
    this.formMessage.controls['message'].reset();
    return true;
  }


  chatMin() : void {
    this.state["chat"] = !this.state["chat"];
    this.state["chat-min"] = !this.state["chat-min"];
    this.unfold =  (this.state["chat-min"]) ? 'unfold_more' : 'unfold_less';
  }

  chatClose() :  void {
      this.close = !this.close;
  }

  getSocketId(){
    return this.chat.getSocketId();
  }
  viewMessage() {
    return this.chat.getMessage();
  }
}
