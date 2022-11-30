import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Payload, UserDto } from "../../../dtos/user.dto";

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.scss']
})
export class NavHeaderComponent implements OnInit {

  status_room = false;
  plus_minus = "chevron_right";

  user: UserDto | null;
  constructor(private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,) {
    const username = this.authService.getAuthUser() as string;
    this.user = null;
    this.usersService.getUser(username)
      .subscribe({
        next: (user: UserDto) => {
          this.user = user;
        }
      });
      console.log("CONSTRUCTOR NAVHEADER")
  }

  // @Input() profile = {};


  ngOnInit() {
    console.log("ON INIT")

  }

  getName() {
    if (this.user)
      return this.user.username;
    return "MARVIN"
  }

  getPhoto() {
    if (this.user)
      return this.user.photoUrl;
    return "https://ih1.redbubble.net/image.1849186021.6993/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";
  }


  plus() {
    this.status_room = !this.status_room;
    this.plus_minus = (this.status_room) ? "expand_more" : "chevron_right";
  }



}
