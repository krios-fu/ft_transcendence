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
];

@NgModule({
  imports: [RouterModule.forChild(ProfileRoutes)],
  exports: [RouterModule,]
})
export class ProfileRoutingModule { }
