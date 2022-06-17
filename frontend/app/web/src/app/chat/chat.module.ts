import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {Chat} from "./chat";



@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    CommonModule
  ],
  providers: [Chat],
})
export class ChatModule {
}
