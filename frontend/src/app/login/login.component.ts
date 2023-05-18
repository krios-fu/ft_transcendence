import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";

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
    this._http.get('/api/auth/redirtest')
      .subscribe();
  }

}
