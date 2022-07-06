import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { IAuthPayload } from 'src/app/interfaces/iauth-payload.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from '../../services/users.service';

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
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    let code: string | undefined;

    if (this.authService.getAuthToken() != null) {
      return ;
    }
    this.activatedRoute.queryParams
        .subscribe(params => {code = params['code'];});
    if (code === undefined) {
        this.authService.logout();
        return ;
    }
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
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.authService.logout();
                }
                return throwError(() => err);
            }
        });
    }

  /* test auth */
  user: string = "";
  getUser(username: string): string {
    this.usersService.getUser(username)
        .subscribe((userDto: UserDto) => {
              this.user = userDto.username;
        });
    return this.user;
  }

  logout() { this.authService.logout(); }
}
