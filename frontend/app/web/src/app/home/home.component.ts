import {Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {HttpClient} from "@angular/common/http";
import {MatExpansionModule} from '@angular/material/expansion';
import { Chat } from '../chat/chat';
import { Payload } from '../dtos/user.dto';
import { Observable } from 'rxjs';
import {ChatComponent} from "../chat/chat.component";
import {ChatModule} from "../chat/chat.module";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {NavHeaderComponent} from "./navegation/header/navheader.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  private code = '';
  @ViewChild(NavHeaderComponent) navHeader : any;

  constructor( private route : ActivatedRoute,  private http : HttpClient) {}

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.route.queryParams
      .subscribe(params => {
        this.code+= '?code='+params['code'];
        console.log(this.code);
      });

    this.http.get('http://localhost:3000/auth/42/redirect'+this.code)
      .subscribe( dto  =>  {  this.navHeader.profile = dto as Payload;
        console.log(this.navHeader.profile); });
  }



}
