import { Component, OnInit,  EventEmitter, ViewChild, AfterViewInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Payload, UserDto } from '../dtos/user.dto';
import { filter, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { AlertServices } from '../services/alert.service';

import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../profile/profile/profile-user/profile-user.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searching = [] as UserDto[];

  @Output() searchUser = new EventEmitter();
  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor(private route: ActivatedRoute,
    public usersService: UsersService,
    private authService: AuthService,
    private shareService : SharedService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.usersService.getUser('me')
      .subscribe((userDto: UserDto) => { /* ?? */ })
  }

  logout() { this.authService.logout(); }

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

  clearSearch(){
    this.searching = [];
  }
}
