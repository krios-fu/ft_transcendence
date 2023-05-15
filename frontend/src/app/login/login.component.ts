import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( private http : HttpClient, private authService: AuthService) { }
  ngOnInit(): void {
    if (this.authService.isAuthenticated())
      this.authService.redirectHome();
  }

  login() {
    window.location.href=environment.redirectUri;
  }

}
