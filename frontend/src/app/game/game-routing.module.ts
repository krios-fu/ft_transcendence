import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';
import { RoomGameIdComponent } from './room-game-id/room-game-id.component';
import { GamehomeComponent } from './gamehome/gamehome.component';


const GameRoutes: Routes = [

  {
    path: '', 
    component: GameComponent,
    children: [
      {
        path: '',
        component: GamehomeComponent
      },
      {
        path: ':id',
        component: RoomGameIdComponent
      },
    ]

  },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(GameRoutes),
  CommonModule
],
  exports: [RouterModule,]

  // ]
})
export class GameRoutingModule { }
