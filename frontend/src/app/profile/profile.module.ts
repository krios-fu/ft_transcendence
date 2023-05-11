import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent} from './profile.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { Router } from "@angular/router";
import { ProfileRoutingModule } from "./profile-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { NavHeaderComponent } from "./navegation/header/navheader.component";
import { RoomComponent } from '../room/room.component';
import { SettingComponent } from './profile/setting/setting.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FriendOnlineComponent } from './friend/friend-online/friend-online.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../http-interceptors/auth.interceptor';
import { ProfileUserComponent } from './profile/profile-user/profile-user.component';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips'
import { MatListModule } from '@angular/material/list';
import { SocketNotificationService } from '../services/socket-notification.service';
// import { MatDividerModule } from '@angular/material/divider';



@NgModule({
    declarations: [
        NavHeaderComponent,
        // RoomComponent,
        SettingComponent,
        FriendOnlineComponent,
        ProfileUserComponent,
        ProfileComponent,
        RoomComponent

        // DialogNotification
    ],
    exports: [
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },
        SocketNotificationService
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatExpansionModule,
        ProfileRoutingModule,
        MatIconModule,
        MatBadgeModule,
        MatChipsModule,
        MatButtonModule,
        ScrollingModule,
        FormsModule,
        MatSlideToggleModule,
        MatInputModule,
        MatTabsModule,
        MatListModule,
        // MatDividerModule,
        // MatDialogModule,

    ],
    // entryComponents: [
    //     DialogNotification
    //   ]
})
export class ProfileModule {
    constructor(router: Router) {
    }
}