import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {FormControl, FormGroup} from '@angular/forms'; //
import {Chat} from "./chat";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{

  public formMessage= new FormGroup({
    message : new FormControl('')
  })


  constructor( private chat : Chat, private route: ActivatedRoute )  {
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


  getSocketId(){
    return this.chat.getSocketId();
  }

  viewMessage() {
    return this.chat.getMessage();
  }


}
