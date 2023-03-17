import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import {LoginModule} from "./login/login.module";
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './home/header/header.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './search/search.component';
import { MatChipList, MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips'
import { MDCChipSet } from '@material/chips';
import { GameModule } from "./game/game.module";
import { OtpSessionComponent } from './login/otp-session/otp-session.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogNotification } from './services/dialog/dialog.notification';
import { FriendNotificationComponent } from './services/dialog/notification/friend-notification/friend-notification.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { GameNotificationComponent } from './services/dialog/notification/game-notification/game-notification.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const config: SocketIoConfig = { url: 'http://localhost:3001/private', options: {} }

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SearchComponent,
        OtpSessionComponent,
        PagenotfoundComponent,
        DialogNotification,
        FriendNotificationComponent,
        GameNotificationComponent

    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },
        CookieService,

    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatIconModule,
        MatTreeModule,
        MatBadgeModule,
        MatButtonModule,
        SocketIoModule.forRoot(config),
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatDialogModule,
        ScrollingModule,
        MatDividerModule,
        MatProgressBarModule

    ],
    entryComponents: [
        DialogNotification,
        FriendNotificationComponent,
        GameNotificationComponent

      ]
})
export class AppModule {
    constructor() {
    }
}
