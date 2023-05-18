import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private _http: HttpClient) { }
  ngOnInit(): void {
    if (this.authService.isAuthenticated())
      this.authService.redirectHome();
  }

  login() {
    window.location.href=environment.redirectUri;
  }

  testRedir() {
    this._http.get<any>('/api/auth/redirtest')
      .subscribe({ next: (response: HttpResponse<any>) => {
        if (response.status === 302) {
          const redirectUrl = response.headers.get('Location');
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
      }
    }
      });
    }
  }
