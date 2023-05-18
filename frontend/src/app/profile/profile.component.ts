import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { UserDto } from '../dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';
import { AlertServices } from '../services/alert.service';
import { ProfileUserComponent, SharedService } from './profile/profile-user/profile-user.component';



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
  username ?: string;



  outlet_chat = false;



  constructor(private route: ActivatedRoute,
    public usersService: UsersService,
    private alertService: AlertServices,
    private shareService: SharedService
  ) {

  }

  ngOnInit(): void {

   

  }




  ngAfterViewInit() {

  }


  send_chat_profile(e: any) {
    return e;
  }


  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }



}