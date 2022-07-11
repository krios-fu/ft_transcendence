import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
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
    user:      string = "";
    firstName: string = "";
    lastName:  string = "";


    constructor
    (
        public  usersService: UsersService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) { }

    /* auth flow: 
        comprobamos que la petición a home contiene un
        parámetro en el query de la forma {code, error}.
        Si es el caso, dirigimos la petición hacia /auth/42,
        de lo contrario, intentamos mostrar la página de home
    */

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
            return ;
        }
        if (this.authService.isAuthenticated() === false) {
            this.authService.redirectLogin();
        }

        /* user petition std test */
        const username: string = this.authService.getAuthUser() as string;
        this.usersService.getUser(username)
            .subscribe({
                next: (userDto: UserDto) => {
                    this.user = userDto.username;
                    this.firstName = userDto.firstName;
                    this.lastName = userDto.lastName;
                }
        });
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
                },
                error: (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.authService.logout();
                    }
                    return throwError(() => err);
                }
            });
        }

  logout() { this.authService.logout(); }
}
