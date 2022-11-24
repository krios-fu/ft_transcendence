import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {Router} from "@angular/router";
import {HomeRoutingModule} from "./home-routing.module";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTreeModule} from "@angular/material/tree";
import {MatButtonModule} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import {NavHeaderComponent} from "./navegation/header/navheader.component";
import { RoomComponent } from '../room/room.component';
import { SettingComponent } from './profile/setting/setting.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FriendOnlineComponent } from './friend/friend-online/friend-online.component';
import { ChatModule } from '../room/chat/chat.module';



@NgModule({
  declarations: [
    HomeComponent,
    
    NavHeaderComponent,
    RoomComponent, 
    SettingComponent,
    FriendOnlineComponent,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    HomeRoutingModule,
    MatIconModule,
    MatBadgeModule,
    MatTreeModule,
    MatButtonModule,
    ScrollingModule,
    FormsModule,
    MatSlideToggleModule,
    // ChatModule
  ],
  exports:[
    HomeComponent,
  ]
})
export class HomeModule {
  constructor( router : Router ) {
  }
}
