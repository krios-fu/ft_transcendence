import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void { }

  user: string = "";
  getUser() {
    this.usersService.getUser(/* user id */)
  }
}
