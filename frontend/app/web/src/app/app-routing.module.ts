import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import {LoginModule} from "./login/login.module";
import {ChatComponent} from "./chat/chat.component";

const routes: Routes = [
  { path: 'login', component : LoginComponent },
  { path: 'chat', component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, LoginModule]
})
export class AppRoutingModule { }
