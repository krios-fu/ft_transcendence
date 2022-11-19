import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import {LoginModule} from "./login/login.module";
import {ChatComponent} from "./chat/chat.component";
import {HomeModule} from "./home/home.module";
import {HomeComponent} from "./home/home.component";
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component : LoginComponent},
 // { path: 'chat', component: ChatComponent },
 { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: '', redirectTo: '/home', pathMatch: 'full', },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, LoginModule, HomeModule]
})
export class AppRoutingModule { }
