import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatModule} from "../chat/chat.module";
import {ChatComponent} from "../chat/chat.component";
import {HomeComponent} from "./home.component";
import {LoginComponent} from "../login/login.component";


const HomeRoutes: Routes = [
  {
    path: 'home', component: HomeComponent, children: [
      {   path: 'chat/:id', component : ChatComponent, outlet: 'chat' },
      {   path: 'login', component: LoginComponent, outlet: 'center'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule,]
})
export class HomeRoutingModule { }
