import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { LoginComponent } from "../login/login.component";
import { SettingComponent } from './profile/setting/setting.component';
import { NavHeaderComponent } from './navegation/header/navheader.component';
import { ChatModule } from '../room/chat/chat.module';
import { ChatComponent } from '../room/chat/chat.component';


const HomeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: NavHeaderComponent, },
  {path: 'chat', loadChildren: 
  () => import('../room/chat/chat.module').then(m => m.ChatModule), outlet: 'chat'},

  { path: 'setting', component: SettingComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule,]
})
export class HomeRoutingModule { }
