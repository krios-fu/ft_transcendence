import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatIdComponent } from './chat-id/chat-id.component';

const routes: Routes = [
	{ path: 'chat', component : ChatComponent, children : [
    {path: 'chat/:id', component : ChatIdComponent}
  ] },
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
