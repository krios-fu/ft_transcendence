import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {RouterModule} from "@angular/router";
import { TwofaComponent } from './2fa/2fa.component';
import { LoginRoutingModule } from './login-routing.module';
import { MatIconModule } from "@angular/material/icon";


@NgModule({
  declarations: [
    LoginComponent,
    TwofaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LoginRoutingModule,
    MatIconModule
  ]
})
export class LoginModule { }
