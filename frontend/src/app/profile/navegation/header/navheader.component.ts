import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Payload, UserDto } from "../../../dtos/user.dto";
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { SharedService } from '../../profile/profile-user/profile-user.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.scss']
})
export class NavHeaderComponent implements OnInit {

  status_room = false;
  plus_minus = "chevron_right";

  user: UserDto | undefined;
  searching = [] as UserDto[];


  color_icon = '';
  online_icon = '';

  @Output() searchUser = new EventEmitter();
  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor(private http: HttpClient,
    private usersService: UsersService,
    private shareService : SharedService,
    private route : ActivatedRoute,

  ) {
    this.user = undefined;
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );
  }


  /*
  ** green: '#49ff01'
  ** Red: '#ff0000'
  */
  ngOnInit() {
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );

    this.usersService.getUser('me')
      .subscribe((user: UserDto) => {
        this.user = user;
      //  this.gameNotification.joinRoomNotification(this.user.username);
       this.shareService.eventEmitter.emit(this.user.username);

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

  search(){
    const { message, room } = this.formMessage.value;
    if( message.trim() == '' )
      return false;
      this.http.get<UserDto[]>(`http://localhost:3000/users/?filter[nickName]=${message}`)
      .subscribe(
       ( user : UserDto[]) => {
          // this.searchUser.emit(user)
          this.searching = user;
        }
      )
    this.formMessage.controls['message'].reset();
    return true;
  }

  getSearch(user: UserDto[]) {
    this.searching = user;
  }


}
