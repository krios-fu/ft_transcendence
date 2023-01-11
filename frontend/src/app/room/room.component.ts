import { AfterViewChecked, AfterViewInit, Component, EventEmitter, OnInit, Input, ViewChild } from '@angular/core';
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UserDto } from '../dtos/user.dto';



@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit {

 public CHATS_USERS = [] as UserDto[];

  statusTree = false;

  constructor(private http: HttpClient,
    private authService: AuthService,
    public router: Router,
  ) {

  }

  ngAfterViewInit(): void {
    const user_sesion = this.authService.getAuthUser();

    this.http.get(`http://localhost:3000/users/me/chats`)
      .subscribe(entity => {
        let data = Object.assign(entity);
        let user_save: UserDto;
        for (let chat in data) {
          const { users } = data[chat];
          user_save = users[0] as UserDto;
          let { username } = user_save;
          if (username === user_sesion) {
            user_save = users[1] as UserDto;
          }
          if (!(this.CHATS_USERS.find((user) => {
            return user.nickName === user_save.nickName;
          })))
            this.CHATS_USERS.push(user_save);
        }
      });
    console.log('NEW VERSION', this.CHATS_USERS);
  }
}
