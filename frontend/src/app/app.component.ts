import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { Subscription, filter, throwError } from 'rxjs';
import { NavigationEnd, Router } from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

  hiden = false;
  search = [] as UserDto[];
  public subscriber: Subscription;


  constructor(
    private router: Router,
      public usersService: UsersService,
      private authService: AuthService,
  ) {
    this.checkLogin();

    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/login' || event.url === '/otp_session')
        this.hiden = false;
      else
        this.hiden = true;
    });

  }


  ngOnInit(): void {
  
  }




  checkLogin() {
    this.hiden = !(this.authService.getAuthUser()) ? false : true;
  }

  logout() {
    this.authService.logout();
  }

  getSearch(user: UserDto[]) {
    console.log("APPCOMPONENT event serach", user);
    this.search = user;
  }

  ngAfterViewInit() {
  }
  // minNavegation() {
  //   this.hiden = !this.hiden;
  // }
}

