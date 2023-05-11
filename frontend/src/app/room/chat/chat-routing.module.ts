import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatIdComponent } from './chat-id/chat-id.component';
import { ChatComponent } from './chat.component';

const routes: Routes = [
	{ path: '', component : ChatComponent,
    children: [
  { path: ':id', component : ChatIdComponent}


    ]
},
]

@NgModule({
  declarations: [],
  imports: [
	RouterModule.forChild(routes),
    CommonModule
  ],
  exports:[RouterModule]
})
export class ChatRoutingModule { }
