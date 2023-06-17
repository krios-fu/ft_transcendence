import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit(): void {
    let code: string | undefined;
    let error: string | undefined;

    if (this.authService.isAuthenticated())
      this.authService.redirectHome();
    this.activatedRoute.queryParams
      .subscribe(params => {
        code = params['code'];
        error = params['error'];
        if (code === undefined && error === undefined) {
          return ;
        }
        if (code === undefined) {
          code = error as string;
        }
        this.loginUser(code);
      })
  }

  public login() {
    window.location.href=environment.redirectUri;
  }

  public loginUser(code: string) {
    this.authService.authUser(code)
  }
}
