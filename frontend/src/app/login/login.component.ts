import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( private http : HttpClient, private authService: AuthService) { }
  loginUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=4fa51aeb8eafcafd00c2b72a70720daf534190b81adf41fb9874c83bb9563042&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome&response_type=code';
  
  ngOnInit(): void {
    if (this.authService.isAuthenticated())
      this.authService.redirectHome();
  }

  login()
  {
    window.location.href=this.loginUrl;
  }

}
