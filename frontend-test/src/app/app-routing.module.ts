import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RoomChatComponent } from './room-chat/room-chat.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'chat', component: RoomChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
