import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginModule} from "./login/login.module";

import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io'
import {ChatModule} from "./chat/chat.module";
import {Chat} from "./chat/chat";

const config: SocketIoConfig = { url:'https://localhost:3001', options: {} }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    ChatModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
