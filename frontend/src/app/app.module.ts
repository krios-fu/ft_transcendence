import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './profile/header/header.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './search/search.component';
import { MatChipsModule } from '@angular/material/chips'
import { MatTabsModule } from '@angular/material/tabs';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogNotification } from './services/dialog/dialog.notification';
import { FriendNotificationComponent } from './services/dialog/notification/friend-notification/friend-notification.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { GameNotificationComponent } from './services/dialog/notification/game-notification/game-notification.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MiniFooterComponent } from './profile/mini-footer/mini-footer.component';
import { LoginModule } from './login/login.module';
import { HomeComponent } from './home/home.component';
import { MatchNotificationComponent } from './services/dialog/notification/match-notification/match-notification.component';
import { GameInstructionsComponent } from './services/dialog/info/game-instructions/game-instructions.component';
import { RoomPasswordInputComponent } from './services/dialog/input/room_password/room-password-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SocketNotificationService } from './services/socket-notification.service';
import { SharedService } from './profile/profile/profile-user/profile-user.component';
import { SocketService } from './game/services/socket.service';
import { WtfComponent } from './login/wtf/wtf.component';
import { ChangeRoomPasswordInputComponent } from './services/dialog/input/change_room_password/change-room-password-input.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.wsUrl + 'private', options: {
    reconnectionAttempts: 5
} }

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SearchComponent,
        PagenotfoundComponent,
        DialogNotification,
        FriendNotificationComponent,
        GameNotificationComponent,
        MiniFooterComponent,
        HomeComponent,

        MatchNotificationComponent,
        GameInstructionsComponent,
        RoomPasswordInputComponent,
        WtfComponent,
        ChangeRoomPasswordInputComponent
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
        },
        CookieService,
        SocketNotificationService,
        SharedService,
        SocketService
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
        MatProgressBarModule,
        MatTabsModule,
        LoginModule,
        MatFormFieldModule,
        MatInputModule
    ],
    entryComponents: [
        DialogNotification,
        FriendNotificationComponent,
        GameNotificationComponent,
        MatchNotificationComponent,
        RoomPasswordInputComponent,
        ChangeRoomPasswordInputComponent
      ]
})
export class AppModule {
    constructor() { }
}
