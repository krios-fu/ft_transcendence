import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {HttpClient} from "@angular/common/http";
import {MatExpansionModule} from '@angular/material/expansion';
import { Chat } from '../chat/chat';
import { Payload } from '../dtos/user.dto';
import { Observable } from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ChatComponent} from "../chat/chat.component";
import {ChatModule} from "../chat/chat.module";





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private profile = {};

  private code = '';

  hidden = false;



  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor( private route : ActivatedRoute, private http : HttpClient) {
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );
   }

  ngOnInit(): void {

    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );

    this.route.queryParams
      .subscribe(params => {
        this.code+= '?code='+params['code'];
        console.log(this.code);
      });

    this.http.get('http://localhost:3000/auth/42/redirect'+this.code)
      .subscribe( dto  =>  {  this.profile = dto as Payload;
        console.log(this.profile) ;} );
  }

   getName()  {
    try {
      const pp = this.profile as Payload;
      return pp.userProfile.username;
    }
    catch {}
     return "marvin";
  }

  search(){
    const { message, room } = this.formMessage.value;
    console.log( message, room)
    if( message.trim() == '' )
      return false;
    this.formMessage.controls['message'].reset();
    return true;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }



}
