import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomChatComponent } from './room-chat/room-chat.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ChildComponent } from './child/child.component';
import { NotFoundComponent } from './not-found/not-found.component';

const config: SocketIoConfig = {
  url: 'http://localhost:3000/room-chat',
}

@NgModule({
  declarations: [
    AppComponent,
    RoomChatComponent,
    HomeComponent,
    ChildComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
