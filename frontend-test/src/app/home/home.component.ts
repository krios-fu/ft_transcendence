import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { UsersService } from '../services/users.service';
>>>>>>> 5bd0d345904cf0bd53f22413a09180cd193e1a99

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
<<<<<<< HEAD

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  getUsers() {
    return this.http.get('https://localhost:3000/users')
  }

}
=======
  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void { }

  user: string = "";
  getUser() {
    this.usersService.getUser(/* user id */)
  }
}
>>>>>>> 5bd0d345904cf0bd53f22413a09180cd193e1a99
