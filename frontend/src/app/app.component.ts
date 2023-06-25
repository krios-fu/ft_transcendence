import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { Subscription, filter, throwError } from 'rxjs';
import { NavigationEnd, Router } from "@angular/router";
import { SocketService } from './game/services/socket.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  hiden = false;
  public subscriber: Subscription;


  constructor(
    private router: Router,
      public usersService: UsersService,
      private authService: AuthService,
      private socketService: SocketService
  ) {
    this.checkLogin();

    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/login' || event.url === '/login/2fa')
        this.hiden = false;
      else
        this.hiden = true;
    });

  }


  ngOnInit(): void {
    this.socketService.bannedGlobalEvent();
  }

  ngOnDestroy(): void {
    this.socketService.unsubscribeFromEvent('banned_global');
  }

  checkLogin() {
    this.hiden = !(this.authService.getAuthUser()) ? false : true;
  }

  logout() {
    this.authService.logout();
  }
}

