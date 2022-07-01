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
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=da29a1641b122120ec79b52290574b666e345122ea7dc22b4b90440a3f8c7395&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome&response_type=code';
  }

}
