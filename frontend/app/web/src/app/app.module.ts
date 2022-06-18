import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginModule} from "./login/login.module";

import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io'
import {HttpClientModule} from "@angular/common/http";
import {Chat} from "./chat/chat";
import {ChatModule} from "./chat/chat.module";

const config: SocketIoConfig = { url:'http://192.168.0.221:3001/private', options: {} }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    ChatModule,
    SocketIoModule.forRoot(config),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
