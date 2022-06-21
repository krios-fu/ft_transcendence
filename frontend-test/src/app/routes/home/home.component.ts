import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

export class UserDto {
    username: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    email: string;
    photoUrl: string;

    constructor(
        username:string,
        firstName:string,
        lastName:string,
        profileUrl:string,
        email:string,
        photoUrl:string
    ) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileUrl = profileUrl;
        this.email = email;
        this.photoUrl = photoUrl;
    }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    public usersService: UsersService
  ) { }

  ngOnInit(): void { }

  user: string = "";
  getUser(username: string): string {
    const optionsUser = {
        next: (userDto: UserDto) => { this.user = userDto.username },
        error: (err: Error) => { console.error(err + " sdasdalsjl") }
    };

    this.usersService.getUser(username)
      .subscribe(optionsUser);
    return this.user;
  }
}
