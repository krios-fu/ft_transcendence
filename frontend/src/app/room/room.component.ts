import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserDto } from '../dtos/user.dto';
import { RoomDto } from '../dtos/room.dto';



@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit {

  public CHATS_USERS = [] as UserDto[];
  public ROOM_USER = [] as RoomDto[];
  public FRIENDS_USERS = [] as UserDto[];

  statusTree = false;

  constructor(private http: HttpClient,
    private authService: AuthService,
    public router: Router,
  ) {

  }

  ngAfterViewInit(): void {
    const user_sesion = this.authService.getAuthUser();


    this.http.get<RoomDto[]>(`http://localhost:3000/user_room/me/rooms`)
      .subscribe((entity) => {
        console.log("ROOM USERS", entity)
        let data = Object.assign(entity);
        for (let room in data) {
          console.log("ROOM USERS", data[room])
          this.ROOM_USER.push(data[room])
        }
      });

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

    this.http.get<any[]>(`http://localhost:3000/users/me/friends`)
      .subscribe((friends: any[]) => {
        for (let friend in friends) {
          const { receiver } = friends[friend];
          const { sender } = friends[friend];
          const user = (receiver) ? receiver : sender;
          this.FRIENDS_USERS.push(user);
        }
        console.log("USER FRIENS", this.FRIENDS_USERS)
      })


  }




}
