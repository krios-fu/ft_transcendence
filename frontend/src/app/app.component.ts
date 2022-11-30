import { Component, ViewChild } from '@angular/core';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  hiden = false;
  search = {} as UserDto;


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

  getSearch(user : UserDto){
    console.log("APPCOMPONENT event serach", user);
    this.search = user;
  }
  // minNavegation() {
  //   this.hiden = !this.hiden;
  // }
}

