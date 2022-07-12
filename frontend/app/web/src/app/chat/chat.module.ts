import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {Chat} from "./chat";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";



@NgModule({
  declarations: [
    ChatComponent,
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatExpansionModule
    ],
  providers: [Chat],
  exports: [
    ChatComponent
  ]
})
export class ChatModule {
}
