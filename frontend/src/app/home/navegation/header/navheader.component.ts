import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Payload, UserDto } from "../../../dtos/user.dto";

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.scss']
})
export class NavHeaderComponent implements OnInit{

  status_room = false;
  plus_minus = "chevron_right";

 user : any;

  constructor(private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,) {
  
      console.log("CONSTRUCTOR NAVHEADER")
    // this.user = null;

  }

  // @Input() profile = {};


  ngOnInit() {
    console.log("ON INIT")


    // const username = this.authService.getAuthUser() as string;
    // this.user = null;
    this.user = this.usersService.getUser();

        console.log('------->', this.user)
    
      // .subscribe(
      //    (user) => {
      //     this.user = user;
      //   }
      // );

  }


  getName() {

    return this.user?.username;
}
    // return "MARVIN"
  // }

getPhoto() {
    return this.user?.photoUrl;
  }


  plus() {
    this.status_room = !this.status_room;
    this.plus_minus = (this.status_room) ? "expand_more" : "chevron_right";
  }



}
