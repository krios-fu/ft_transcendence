import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginModule} from "./login/login.module";

import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io'
import {HttpClientModule} from "@angular/common/http";
import {ChatModule} from "./chat/chat.module";
import { HomeComponent } from './home/home.component';
import {HomeModule} from "./home/home.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config: SocketIoConfig = { url:'http://localhost:3001/private', options: {} }

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    ChatModule,
    HomeModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
