import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";
import { AuthGuard } from './guards/auth.guard';
import { ChatModule } from './room/chat/chat.module';

const routes: Routes = [
  { path: '', redirectTo: '/home/profile', pathMatch: 'full'},
  { path: 'home', loadChildren: ()=> import('./home/home.module').then(m => m.HomeModule),},
  // {path: 'home/profile', component: HomeComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent , outlet:'game' },

  // {path: 'chat', loadChildren: () => import('./room/chat/chat.module').then(m => m.ChatModule),},
];

  // { path: '**', redirectTo: 'home/profile', pathMatch: 'full', },


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, LoginModule, HomeModule, ChatModule]
})
export class AppRoutingModule { }
