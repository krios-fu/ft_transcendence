import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatModule} from "../chat/chat.module";
import {ChatComponent} from "../chat/chat.component";
import {HomeComponent} from "./home.component";


const HomeRoutes: Routes = [
  {
    path: 'home', component: HomeComponent, children: [
      {   path: 'chat', component: ChatComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule,]
})
export class HomeRoutingModule { }
