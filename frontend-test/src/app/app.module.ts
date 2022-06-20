import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomChatComponent } from './room-chat/room-chat.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
=======
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ChildComponent } from './child/child.component';
import { NotFoundComponent } from './not-found/not-found.component';
>>>>>>> 5bd0d345904cf0bd53f22413a09180cd193e1a99

const config: SocketIoConfig = {
  url: 'http://localhost:3000/room-chat',
}

@NgModule({
  declarations: [
    AppComponent,
    RoomChatComponent,
<<<<<<< HEAD
    LoginComponent,
    HomeComponent
=======
    HomeComponent,
    ChildComponent,
    NotFoundComponent
>>>>>>> 5bd0d345904cf0bd53f22413a09180cd193e1a99
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
