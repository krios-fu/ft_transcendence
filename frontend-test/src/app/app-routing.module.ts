import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/login/login.component';
import { NotFoundComponent } from './routes/not-found/not-found.component';
import { RoomChatComponent } from './routes/room-chat/room-chat.component';

const defaultRoute = 'home';

const routes: Routes = [
  { path: 'home', component: HomeComponent, },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'chat', component: RoomChatComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
