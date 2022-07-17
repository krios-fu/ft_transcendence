import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ChatModule} from "../chat/chat.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {Router, RouterModule} from "@angular/router";
import {HomeRoutingModule} from "./home-routing.module";
import {ChatComponent} from "../chat/chat.component";



@NgModule({
  declarations: [
    HomeComponent,
  ],
    imports: [
        CommonModule,
        ChatModule,
        ReactiveFormsModule,
        MatExpansionModule,
        HomeRoutingModule,

    ]
})
export class HomeModule {
  constructor( router : Router ) {
  }
}
