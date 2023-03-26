import { NgModule } from '@angular/core';
import { GameComponent } from './game.component';
import { OnlineComponent } from './online/friend-online/online.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { GameQueueComponent } from './game-queue/game-queue.component';
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
// import { MatLabel } from '@angular/material/form-field';

@NgModule({
  declarations: [
    GameComponent,
    OnlineComponent,
    GameQueueComponent,
    RoomGameIdComponent
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
    
    // MatLabel
  ],
  providers: [
    QueueService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
  }
  ],
})
export class GameModule { }
