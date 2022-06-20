import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  getUsers() {
    return this.http.get('https://localhost:3000/users')
  }

}