import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthToken } from '../interfaces/iauth-token';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    authToken: string = "";
    constructor(
      public authService: AuthService,
      private router: Router,
    ) { }

    ngOnInit(): void {
    }

    private successfulLogin(token: string) {
        this.authToken = token;

        localStorage.setItem('auth_token', this.authToken);
        this.router.navigate(['home']);
    }

    loginUser(): void {
        const observeLogin = {
            next:  (authToken: IAuthToken) => this.successfulLogin(authToken.auth_token),
            error: (error: HttpErrorResponse) => {
                console.error(error);
                alert('Authentication failed');
            }
        }
        const login$ = this.authService.authorizeUser();

        login$.subscribe(observeLogin);
    }

    testToken(): void {
        if (localStorage.getItem('auth_token') === null) {
            console.log('token no seteado.');
        } else {
            console.log('token seteado: ' + localStorage.getItem('auth_token'));
        }
    }
}
