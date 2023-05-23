import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Payload, UserDto } from '../dtos/user.dto';
import { filter, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { AlertServices } from '../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public usersService: UsersService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.usersService.getUser('me')
      .subscribe((userDto: UserDto) => { /* ?? */ })
  }

  logout() { this.authService.logout(); }
}
