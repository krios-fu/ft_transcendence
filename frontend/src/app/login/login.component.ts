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
  loginUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=69aeb66a278743631dbafcd44c86243a16b425b19a096d176dc681ae7fadc3dd&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome&response_type=code';
  ngOnInit(): void {
    if (this.authService.isAuthenticated())
      this.authService.redirectHome();
  }

  login()
  {
    window.location.href=this.loginUrl;
  }

}
