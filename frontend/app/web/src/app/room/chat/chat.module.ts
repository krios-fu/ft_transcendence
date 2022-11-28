import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {Chat} from "./chat";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import { ChatIdComponent } from './chat-id/chat-id.component';
import { ChatRoutingModule } from './chat-routing.module';


@NgModule({
  declarations: [
    ChatComponent,
    ChatIdComponent,
    // RoomComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    // RouterModule,
    
    MatBadgeModule,
    ChatRoutingModule,
  ],
  providers: [Chat],
  exports: [
    // ChatComponent,
    // ChatIdComponent
    
  ]
})
export class ChatModule {
}
