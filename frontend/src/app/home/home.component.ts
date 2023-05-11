import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { IAuthPayload } from '../interfaces/iauth-payload.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(
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
    if (code !== undefined || error !== undefined) {
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
    if (this.authService.isAuthenticated() === true) {
      return;
    }
    this.authService.authUser(code)
      .subscribe({
        next: (res: HttpResponse<IAuthPayload>) => {
          console.log('HTTP RESPON', res)
          if (res.body === null) {

            this.authService.redirectLogin()
            throw new HttpErrorResponse({
              statusText: 'successful login never returned credentials',
              status: HttpStatusCode.InternalServerError,
            })
          }
          this.authService.setAuthInfo({
            "accessToken": res.body.accessToken,
            "username": res.body.username,
          });
          this.usersService.getUser('me')
            .subscribe({
              next: (userDto: any) => {
                console.log("OTP SESSION", userDto)
                console.log(userDto.doubleAuth)
                if (userDto[0].doubleAuth === true) {
                  this.authService.redirecOtpSesion()
                }
              },
            });
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
          }
          return throwError(() => err);
        }
      });
  }

}
