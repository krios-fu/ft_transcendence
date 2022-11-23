import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatModule} from "../chat/chat.module";
import {ChatComponent} from "../chat/chat.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "../login/login.component";
import { SettingComponent } from './profile/setting/setting.component';
import { NavHeaderComponent } from './navegation/header/navheader.component';


const HomeRoutes: Routes = [
  {
    path: 'home', component: HomeComponent, children: [
      {   path: 'profile', component: NavHeaderComponent, },
      {   path: 'login', component: LoginComponent, outlet: 'center'},
      {   path: 'setting', component: SettingComponent},
    

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule,]
})
export class HomeRoutingModule { }
