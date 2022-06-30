import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IAuthInfo } from 'src/app/interfaces/iauth-info';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from '../../services/users.service';
import { RoomChatComponent } from '../room-chat/room-chat.component';

export class UserDto {
    username: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    email: string;
    photoUrl: string;

    constructor(
        username:string,
        firstName:string,
        lastName:string,
        profileUrl:string,
        email:string,
        photoUrl:string
    ) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileUrl = profileUrl;
        this.email = email;
        this.photoUrl = photoUrl;
    }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    public  usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit(): void { 

    /* check if token exists as cookie in user-agent */
    /* if not: login logic:
          check if query param is code (if not then login redir)
          http request to backend endpoint 
    */
    let code: string | undefined;
    const authObserver = {
      next: (resp: HttpResponse<IAuthInfo>) => {
        if (resp.body === null) { /* Esto es trabajo de validation pipe */
          console.error('Invalid or non existent authentication token');
          this.router.navigate(['/login']);
          return ;
        }
        this.authService.setAuth(resp.body.accessToken);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Invalid or non existent authentication token');
        this.router.navigate(['/login']);
      }
    }

    if (this.authService.getAuthToken() != null) {
      return ;
    }
    this.activatedRoute.queryParams
      .subscribe(params => {code = params['code'];});
    if (code === undefined) {
      this.router.navigate(['/login']);
      return ;
    }
    this.authService.authUser(code)
      .subscribe(authObserver);
  }

  /* test auth */
  user: string = "";
  getUser(username: string): string {
    const optionsUser = {
        next: (userDto: UserDto) => { this.user = userDto.username },
        error: (err: Error) => { console.error(err + " sdasdalsjl") }
    };

    this.usersService.getUser(username)
      .subscribe(optionsUser);
    return this.user;
  }
}
