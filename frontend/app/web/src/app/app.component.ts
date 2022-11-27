import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  hiden = false;



  constructor(private userService: UsersService, 
    private authService: AuthService) {
      this.checkLogin();
    console.log("HOMECOMPONEN CONSTRUCTOR");
  }


  checkLogin() {
    this.hiden = !(this.authService.getAuthUser()) ? false : true;
  }

  logout(){
    this.authService.logout();
  }  
  // minNavegation() {
  //   this.hiden = !this.hiden;
  // }
}

