import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {RouterModule} from "@angular/router";
import { OtpSessionComponent } from './otp-session/otp-session.component';
import { LoginRoutingModule } from './login-routing.module';
import { MatIconModule } from "@angular/material/icon";



@NgModule({
  declarations: [
    LoginComponent,
    OtpSessionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LoginRoutingModule,
    MatIconModule
  ]
})
export class LoginModule { }
