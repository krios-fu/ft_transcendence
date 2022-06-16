import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomChatComponent } from './room-chat/room-chat.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';

const config: SocketIoConfig = {
  url: 'http://localhost:3000/room-chat',
/*  options: {
    transports: ['websocket']
  }*/
}

@NgModule({
  declarations: [
    AppComponent,
    RoomChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
