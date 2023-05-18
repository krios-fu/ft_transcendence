import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-mini-footer',
  templateUrl: './mini-footer.component.html',
  styleUrls: ['./mini-footer.component.scss']
})
export class MiniFooterComponent implements OnInit, OnDestroy {

  friend_state = false;
  nPenddingFriends = 0;
  public subscriber: Subscription;



  constructor(private authService : AuthService,
    private alertService: AlertServices,
    private router: Router,
    public usersService: UsersService,

     ) {
      this.subscriber = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event) => {
        if (this.authService.isAuthenticated() === true) {
          // this.ngOnInit();
          this.getPenddingFriends();
        }
      });
    }

  ngOnInit(): void {
  }

  logout() { this.authService.logout(); }

  hello() {
    this.friend_state = !this.friend_state;
    this.alertService.openFriendPending();
  }

  getPenddingFriends() {
    this.usersService.getUser('me')
      .subscribe((user: UserDto) => {
        this.usersService.getFriends('me')
        .subscribe((data: any) => {
          let friends_pending = Object.assign(data);
          console.log("PENDING", user.username)
            this.nPenddingFriends = (friends_pending.filter((friend: any) => friend['sender'] && friend['sender'].username != user.username)).length;
          })
      })
  }

  ngOnDestroy(): void {
      
    this.subscriber?.unsubscribe();
  }



}
