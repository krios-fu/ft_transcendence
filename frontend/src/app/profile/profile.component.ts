import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { UserDto } from '../dtos/user.dto';
import { NavHeaderComponent } from "./navegation/header/navheader.component";
import { UsersService } from 'src/app/services/users.service';
import { AlertServices } from '../services/alert.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  lol = false;
  user: string = "";
  firstName: string = "";
  lastName: string = "";
  hidden = false;
  friend_state = false;
  friends = {} as UserDto[];



  outlet_chat = false;

  @ViewChild(NavHeaderComponent) navHeader!: any;


  constructor(private route: ActivatedRoute,
    public usersService: UsersService,
    private alertService: AlertServices,
  ) {

  }

  ngOnInit(): void {

  }




  ngAfterViewInit() {
    console.log(this.route);
  }


  send_chat_profile(e: any) {
    return e;
  }


  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }



}