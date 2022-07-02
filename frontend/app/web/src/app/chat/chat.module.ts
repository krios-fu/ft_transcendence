import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {Chat} from "./chat";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [Chat],
  exports: [
    ChatComponent
  ]
})
export class ChatModule {
}
