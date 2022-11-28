import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { SettingComponent } from './profile/setting/setting.component';
import { NavHeaderComponent } from './navegation/header/navheader.component';
import { AuthGuard } from './../guards/auth.guard';



const HomeRoutes: Routes = [
  { path: 'home', component: HomeComponent,  },
  { path: 'profile', component: NavHeaderComponent, canActivate: [AuthGuard] },
  {
    path: 'chat', loadChildren:
      () => import('../room/chat/chat.module').then(m => m.ChatModule), outlet: 'chat'
  },
  {
    path: 'login', loadChildren: () => import('../login/login.module')
      .then(m => m.LoginModule), outlet: 'game'
  },

  { path: 'setting', component: SettingComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule,]
})
export class HomeRoutingModule { }
