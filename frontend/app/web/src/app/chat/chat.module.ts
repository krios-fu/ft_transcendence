import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {Chat} from "./chat";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {MatBadgeModule} from "@angular/material/badge";
import { ChatIdComponent } from './chat-id/chat-id.component';



@NgModule({
  declarations: [
    ChatComponent,
    ChatIdComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatBadgeModule
  ],
  providers: [Chat],
  exports: [
    ChatComponent,
    
  ]
})
export class ChatModule {
}
