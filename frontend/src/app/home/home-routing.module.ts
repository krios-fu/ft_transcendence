import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { SettingComponent } from './profile/setting/setting.component';
import { NavHeaderComponent } from './navegation/header/navheader.component';
import { AuthGuard } from './../guards/auth.guard';
import { GameComponent } from '../game/game.component';



const HomeRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: NavHeaderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('../room/chat/chat.module').then(m => m.ChatModule), outlet: 'chat',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then(m => m.LoginModule),
    outlet: 'game', canActivate: [AuthGuard]
  },

  {
    path: 'room',
    component: GameComponent, outlet: 'game',
    canActivate: [AuthGuard]
  },

  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule,]
})
export class HomeRoutingModule { }
