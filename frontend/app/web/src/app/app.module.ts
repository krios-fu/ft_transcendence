import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginModule} from "./login/login.module";
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Router} from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './home/header/header.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';


const config: SocketIoConfig = { url:'http://localhost:3001/private', options: {} }

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // HomeComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    // ChatModule,
    FormsModule,
    ReactiveFormsModule,

    // HomeModule,
    MatIconModule,
    MatTreeModule,
    MatBadgeModule,
    MatTreeModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  CookieService
],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router : Router) {
  }
}
