import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Chat} from "./chat";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [Chat],
})
export class ChatModule {

  constructor( private chat : Chat) {


    this.chat.sendMessage("pepe");
    this.chat.getMessage();
  }
}
