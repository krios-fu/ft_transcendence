import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {Router} from "@angular/router";
import {HomeRoutingModule} from "./home-routing.module";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {NavHeaderComponent} from "./navegation/header/navheader.component";
import { RoomComponent } from '../room/room.component';
import { SettingComponent } from './profile/setting/setting.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FriendOnlineComponent } from './friend/friend-online/friend-online.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../http-interceptors/auth.interceptor';
import { ProfileUserComponent } from './profile/profile-user/profile-user.component';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {  MatChipsModule } from '@angular/material/chips'




@NgModule({
    declarations: [
        HomeComponent,
        NavHeaderComponent,
        RoomComponent,
        SettingComponent,
        FriendOnlineComponent,
        ProfileUserComponent,
        // GameComponent
        // LoginComponent
    ],
    exports: [
    // HomeComponent,
    ], providers: [{
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatExpansionModule,
        HomeRoutingModule,
        MatIconModule,
        MatBadgeModule,
        MatChipsModule,
        MatButtonModule,
        ScrollingModule,
        FormsModule,
        MatSlideToggleModule,
        MatInputModule,
        MatTabsModule,
    ]
})
export class HomeModule {
  constructor( router : Router ) {
  }
}
