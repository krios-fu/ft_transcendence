import { NgModule } from '@angular/core';
import { GameComponent } from './game.component';
import { OnlineComponent } from './online/friend-online/online.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    GameComponent,
    OnlineComponent
  ],
  imports: [
    ScrollingModule,
    MatSlideToggleModule,
    CommonModule,
  ],
  providers: [],
})
export class GameModule { }
