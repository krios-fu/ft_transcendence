import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  user : UserDto | null;
  constructor(private http : HttpClient,
    private usersService: UsersService,
    private authService: AuthService, ) { 
      const username = this.authService.getAuthUser() as string;
    this.user = null;
    this.usersService.getUser(username)
      .subscribe({
        next: (user : UserDto) => {
          this.user = user;
        }
      })

    }

  ngOnInit(): void {


    
  }



  getPhoto() : string {
 
    if(this.user)
      return this.user.photoUrl;
    return "https://ih1.redbubble.net/image.1849186021.6993/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";

  }

  logout() { this.authService.logout(); }


  // getPhoto() {
  //   try {
  //     const pp = this.profile as UserDto;
  //     return pp.photoUrl;
  //   }
  //   catch {}
  //   return "https://ih1.redbubble.net/image.1849186021.6993/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";
  // }
}
