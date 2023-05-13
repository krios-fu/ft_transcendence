import { NgModule } from '@angular/core';
import { GameComponent } from './game.component';
import { OnlineComponent } from './online/friend-online/online.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { GameQueueComponent } from './game-queue/game-queue.component';
import { SocketService } from './services/socket.service';
import { QueueService } from './services/queue.service';
import { GameRoutingModule } from './game-routing.module';
import { RoomGameIdComponent } from './room-game-id/room-game-id.component';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../http-interceptors/auth.interceptor';
import { SocketNotificationService } from '../services/socket-notification.service';
import { GamehomeComponent } from './gamehome/gamehome.component';
import { ChatGameComponent } from './chat-game/chat-game.component';
import {ReactiveFormsModule} from "@angular/forms";
import { Chat } from '../room/chat/chat';


@NgModule({
  declarations: [
    GameComponent,
    OnlineComponent,
    GameQueueComponent,
    RoomGameIdComponent,
    GamehomeComponent,
    ChatGameComponent
  ],
  imports: [
    ScrollingModule,
    MatSlideToggleModule,
    CommonModule,
    GameRoutingModule,
    MatGridListModule,
    MatFormFieldModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule
    
    // MatLabel
  ],
  providers: [
    SocketService,
    QueueService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
  },
  SocketNotificationService,
  Chat

  ],
})
export class GameModule { }
