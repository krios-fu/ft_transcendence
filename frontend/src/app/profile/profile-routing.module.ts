import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from "./profile.component";
import { SettingComponent } from './profile/setting/setting.component';
import { NavHeaderComponent } from './navegation/header/navheader.component';
import { AuthGuard } from '../guards/auth.guard';
import { ProfileUserComponent } from './profile/profile-user/profile-user.component';



const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    // pathMatch: 'full',

        // redirectTo: 'me',

    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'me',
        canActivate: [AuthGuard]

      },
      {
        path: 'me',
        component: NavHeaderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'me/setting',
        // pathMatch: 'full',

        component: SettingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':id',
        component: ProfileUserComponent,
        canActivate: [AuthGuard]
      },
      
    ]
  },



  // {
  //   path: 'chat/:id',
  //   loadChildren: () => import('../room/chat/chat.module').then(m => m.ChatModule), outlet: 'chat',
  //   canActivate: [AuthGuard]
  // },

  {
    path: 'room',
    loadChildren: () => import('../game/game.module').then(m => m.GameModule), outlet: 'game',
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(ProfileRoutes)],
  exports: [RouterModule,]
})
export class ProfileRoutingModule { }
