import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {Chat} from "./chat";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [Chat],
  exports: [
    ChatComponent
  ]
})
export class ChatModule {
}
