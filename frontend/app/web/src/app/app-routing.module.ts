import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import {LoginModule} from "./login/login.module";

const routes: Routes = [
  { path: 'login', component : LoginComponent },
  { path: 'chat', loadChildren : () => import('./chat/chat.module').then((m)=> m.ChatModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, LoginModule]
})
export class AppRoutingModule { }
