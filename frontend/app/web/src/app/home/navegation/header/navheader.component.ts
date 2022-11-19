import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {Payload, UserDto} from "../../../dtos/user.dto";

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.scss']
})
export class NavHeaderComponent implements OnInit {

  constructor(private authService: AuthService,) { }

  @Input() profile = {};
  hidden = false;

  ngOnInit(): void {
  }

  getName()  {
    try {
      const pp = this.profile as UserDto;
      return pp.username;
    }
    catch {}
    return "marvin";
  }

  getPhoto() {
    try {
      const pp = this.profile as UserDto;
      return pp.photoUrl;
    }
    catch {}
    return "https://ih1.redbubble.net/image.1849186021.6993/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";
  }

 
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }


logout() { this.authService.logout(); }

}
