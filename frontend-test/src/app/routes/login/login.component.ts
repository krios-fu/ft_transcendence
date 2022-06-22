import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthInfo } from '../../interfaces/iauth-info';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(
      public authService: AuthService,
      private router: Router,
    ) { }

    ngOnInit(): void { }

    private successfulLogin(authInfo: IAuthInfo) {
        localStorage.setItem('auth_token', authInfo.auth_token);
        localStorage.setItem('user_id', authInfo.user_id);
    //    localStorage.setItem('expires_in', authInfo.expires_in);
        this.router.navigate(['home']);
    }

    loginUser(): void {
        const observeLogin = {
            next:  (authInfo: IAuthInfo) => this.successfulLogin(authInfo),
            error: (error: Error) => {
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

    mock_token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZGFucm9kcmkiLCJpYXQiOjE2NTU5MDkzODMsImV4cCI6MTY1NTkxNTM4M30.gS5-FRKZYVYU_4FXc8n-VV9QhuB1_m7ra9hcUKxuHSM';
    mock_user: string = 'danrodri';
    mockLogin() {
        localStorage.setItem('auth_token', this.mock_token);
        localStorage.setItem('user_id', this.mock_user);
        this.router.navigate(['home']);
    }
}
