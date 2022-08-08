import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ChatModule} from "../chat/chat.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {Router, RouterModule} from "@angular/router";
import {HomeRoutingModule} from "./home-routing.module";
import {ChatComponent} from "../chat/chat.component";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTreeModule} from "@angular/material/tree";
import {MatButtonModule} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
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

  ]
})
export class HomeModule {
  constructor( router : Router ) {
  }
}
