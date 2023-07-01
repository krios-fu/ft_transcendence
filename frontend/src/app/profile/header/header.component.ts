import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private routerSubscription: Subscription;
  hiden = false;

  constructor(
    private router: Router
  ) {
  
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.hiden = (event.url === '/') ? true : false;
        }
      });
    }
    

  ngOnInit(): void {}

  ngOnDestroy(){
    this.routerSubscription.unsubscribe();
  }


}
