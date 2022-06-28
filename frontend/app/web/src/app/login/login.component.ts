import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( private http : HttpClient) { }

  ngOnInit(): void {
  }

  login()
  {
   window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=9dde9b93857f50dd397006f1c204dfc54dade32e71a0521a1157cb507bec76d9&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F42%2Fredirect&response_type=code';

  }

}
