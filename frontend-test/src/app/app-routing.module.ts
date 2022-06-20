import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
