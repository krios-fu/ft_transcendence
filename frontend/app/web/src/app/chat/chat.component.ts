import {AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {FormControl, FormGroup} from '@angular/forms'; //
import {Chat} from "./chat";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  inputs: ['login'],
})
export class ChatComponent implements OnInit,  AfterViewInit, AfterContentChecked{




  state = {
    'chat' : true,
    'chat-min' : false,
  };
  unfold : string;
  hidden = true;

  login? = ''

  user? :  any;

  public formMessage= new FormGroup({
    message : new FormControl('')
  })


  constructor(public chat : Chat, 
              private route: ActivatedRoute, 
              private router_: Router,
              private http : HttpClient)  {
    this.unfold = 'unfold_less';
    // this.login = this.route.snapshot.paramMap.get('id')?.toString();
  }


  ngOnInit(): void {
    this.route.params.subscribe(({id}) => {
      this.formMessage.patchValue({ id } );


      this.login = id;

    this.chat.resetChat();

    // this.chat.joinRoom(id);
    // friend chat
    this.http.get('http://localhost:3000/users/'+ this.login)
      .subscribe( (user) => {
      this.user = Object.assign(user);
    });
    this.chat.getMessageApi(id);
  });
  }

  ngAfterContentChecked(): void {
  // this.input.nativeElement.scrollTop = this.input.nativeElement.scrollHeight + 10 ;
    
  }

ngAfterViewInit(): void {

}

  sendMessage() : boolean {
    const { message, room } = this.formMessage.value;
    console.log( message, room)
    if( message.trim() == '' )
      return false;
    this.chat.sendMessage( message, this.user['username'] );
    this.formMessage.controls['message'].reset();
    return true;
  }

  chatMin() : void {
    this.state["chat"] = !this.state["chat"];
    this.state["chat-min"] = !this.state["chat-min"];
    this.unfold =  (this.state["chat-min"]) ? 'unfold_more' : 'unfold_less';
    this.chat.count_new_msg = 0;
  }

  getSocketId(){
    return this.chat.getSocketId() as string ;
  }
  viewMessage() {
    return this.chat.getMessage();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;

    // this.state["chat"] =  true;
  }


}
