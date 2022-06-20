import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RoomChatComponent } from './room-chat/room-chat.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chat', component: RoomChatComponent },
  { path: 'login', component: LoginComponent },
=======
import { ChildComponent } from './child/child.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RoomChatComponent } from './room-chat/room-chat.component';

const routes: Routes = [
  { 
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'child',
        component: ChildComponent,
      }
    ] 
  },
  { path: 'chat', component: RoomChatComponent },
  { path: '**', component: NotFoundComponent }
>>>>>>> 5bd0d345904cf0bd53f22413a09180cd193e1a99
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
