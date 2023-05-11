import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Payload, UserDto } from "../../../dtos/user.dto";
import { SocketNotificationService } from 'src/app/services/socket-notification.service';

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.scss']
})
export class NavHeaderComponent implements OnInit {

  status_room = false;
  plus_minus = "chevron_right";

  user: UserDto | undefined;

  color_icon = '';
  online_icon = '';

  constructor(private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private gameNotification: SocketNotificationService

  ) {
    this.user = undefined;
  }


  /*
  ** green: '#49ff01'
  ** Red: '#ff0000'
  */
  ngOnInit() {

    this.usersService.getUser('me')
      .subscribe((user: UserDto[]) => {
        this.user = user[0];
       this.gameNotification.joinRoomNotification(this.user.username);

        this.color_icon = (this.user.defaultOffline) ? '#49ff01' : '#ff0000';
        this.online_icon = (this.user.defaultOffline) ? 'online_prediction' : 'online_prediction';
      })

 

  }


  getNickname() {
    return this.user?.nickName;
  }


  getPhotoUrl() {
    return this.user?.photoUrl;
  }


  plus() {
    this.status_room = !this.status_room;
    this.plus_minus = (this.status_room) ? "expand_more" : "chevron_right";
  }



}