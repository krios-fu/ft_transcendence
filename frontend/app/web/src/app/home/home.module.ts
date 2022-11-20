import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ChatModule} from "../chat/chat.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {Router} from "@angular/router";
import {HomeRoutingModule} from "./home-routing.module";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTreeModule} from "@angular/material/tree";
import {MatButtonModule} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import {NavHeaderComponent} from "./navegation/header/navheader.component";
import { RoomComponent } from './navegation/room/room.component';
import {ChatComponent} from "../chat/chat.component";
import { SettingComponent } from './profile/setting/setting.component';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    NavHeaderComponent,
    RoomComponent,
    SettingComponent,

  ],
  imports: [
    CommonModule,
    ChatModule,
    ReactiveFormsModule,
    MatExpansionModule,
    HomeRoutingModule,
    MatIconModule,
    MatBadgeModule,
    MatTreeModule,
    MatButtonModule,
    ScrollingModule

  ]
})
export class HomeModule {
  constructor( router : Router ) {
  }
}
