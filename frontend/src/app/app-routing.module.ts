import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileModule } from "./profile/profile.module";
import { AuthGuard } from './guards/auth.guard';
import { OtpSessionComponent } from './login/otp-session/otp-session.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomeComponent } from './home/home.component';
// import { LoginModule } from './login/login.module';

const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./room/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)

  },
  { path: '**', component: PagenotfoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
