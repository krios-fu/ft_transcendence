import { NgModule } from '@angular/core';
import { GameComponent } from './game.component';
import { OnlineComponent } from './online/friend-online/online.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { GameQueueComponent } from './game-queue/game-queue.component';
import { SocketService } from './services/socket.service';
import { QueueService } from './services/queue.service';

@NgModule({
  declarations: [
    GameComponent,
    OnlineComponent,
    GameQueueComponent
  ],
  imports: [
    ScrollingModule,
    MatSlideToggleModule,
    CommonModule,
  ],
  providers: [
    SocketService,
    QueueService
  ],
})
export class GameModule { }
