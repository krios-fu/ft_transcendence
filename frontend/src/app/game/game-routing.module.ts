import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';
import { RoomGameIdComponent } from './room-game-id/room-game-id.component';
import { AuthGuard } from '../guards/auth.guard';



const GameRoutes: Routes = [

  {
    path: '', 
    component: GameComponent
  },
  {
    path: ':id',
    component: RoomGameIdComponent
  },
  // {
  //   path: 'chat',
  //   loadChildren: () => import('../room/chat/chat.module').then(m => m.ChatModule), outlet: 'chat',
  //   canActivate: [AuthGuard]
  // }
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
