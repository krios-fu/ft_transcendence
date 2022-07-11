import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ChatModule} from "../chat/chat.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ChatModule,
    ReactiveFormsModule

    
  ]
})
export class HomeModule { }
