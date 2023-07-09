import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent} from './profile.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { ProfileRoutingModule } from "./profile-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { NavHeaderComponent } from "./navegation/header/navheader.component";
import { SettingComponent } from './profile/setting/setting.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FriendOnlineComponent } from './friend/friend-online/friend-online.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../http-interceptors/auth.interceptor';
import { ProfileUserComponent, SharedService } from './profile/profile-user/profile-user.component';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips'
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { StatsComponent } from './stats/stats.component';
import { MatchHistoryComponent } from './stats/match-history/match-history.component';
import { RankingComponent } from './stats/ranking/ranking.component';
import { AchievementsComponent } from './stats/achievements/achievements.component';
import {MatMenuModule} from "@angular/material/menu";
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [
        NavHeaderComponent,
        SettingComponent,
        FriendOnlineComponent,
        ProfileUserComponent,
        ProfileComponent,
        StatsComponent,
        MatchHistoryComponent,
        RankingComponent,
        AchievementsComponent,

    ],
    exports: [
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },
        SharedService
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
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        MatMenuModule,
        MatTooltipModule

    ],
})
export class ProfileModule {
    constructor() {}
}
