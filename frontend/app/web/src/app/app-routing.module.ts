import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";
import { AuthGuard } from './guards/auth.guard';
import { ChatModule } from './room/chat/chat.module';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/profile', pathMatch: 'full',  },
  {
    path: 'home', component: HomeComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent, },
  // { path: 'login', component: LoginComponent , outlet: 'game' },
  // {path: 'login', loadChildren: ()=>import('./login/login.module').then(m => m.LoginModule)}

  // {path: 'chat', loadChildren: () => import('./room/chat/chat.module').then(m => m.ChatModule),},
];

// { path: '**', redirectTo: 'home/profile', pathMatch: 'full', },


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, HomeModule]
})
export class AppRoutingModule { }
