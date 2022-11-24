import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { HttpClient } from "@angular/common/http";
import { MatExpansionModule } from '@angular/material/expansion';
import { Chat } from '../room/chat/chat';
import { Payload, UserDto } from '../dtos/user.dto';
import { Observable } from 'rxjs';
import { ChatComponent } from '../room/chat/chat.component';
import { ChatModule } from "../room/chat/chat.module";

import { NavHeaderComponent } from "./navegation/header/navheader.component";
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { throwError } from 'rxjs';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';
import { SettingComponent } from './profile/setting/setting.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  lol = false;
  user: string = "";
  firstName: string = "";
  lastName: string = "";
  hidden = false;

  outlet_chat = false;

  @ViewChild(NavHeaderComponent) navHeader: any;
  @ViewChild(ChatComponent) chat: any;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    public usersService: UsersService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { 
  }

  ngOnInit(): void {
    let code: string | undefined;
    let error: string | undefined;

    this.activatedRoute.queryParams
      .subscribe(params => {
        code = params['code'];
        error = params['error']
      });
    if (code != undefined || error != undefined) {
      if (code === undefined) {
        code = error as string;
      }
      this.loginUser(code);
      return;
    }
    if (this.authService.isAuthenticated() === false) {
      this.authService.redirectLogin();
    }

  }

  loginUser(code: string) {
    this.authService.authUser(code)
      .subscribe({
        next: (res: HttpResponse<IAuthPayload>) => {
          if (res.body === null) {
            throw new HttpErrorResponse({
              statusText: 'successful login never returned credentials',
              status: HttpStatusCode.InternalServerError,
            })
          }
          this.authService.setAuthInfo({
            "accessToken": res.body.accessToken,
            "username": res.body.username,
          });
          this.authService.redirectHome();

          const username: string = this.authService.getAuthUser() as string;
          this.usersService.getUser(username)
            .subscribe({
              next: (userDto: UserDto) => {
                this.user = userDto.username;
                this.firstName = userDto.firstName;
                this.lastName = userDto.lastName;
                // this.navHeader.profile = userDto;
              }
            });
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.authService.logout();
          }
          return throwError(() => err);
        }
      });
  }


  ngAfterViewInit() {
    console.log(this.route);
  }




  send_chat_profile(e: any) {
    return e;
  }

  logout() { this.authService.logout(); }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }


}
