import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserDto } from '../dtos/user.dto';
import { RoomDto } from '../dtos/room.dto';
import { UsersService } from '../services/users.service';
import { ChatIdComponent } from './chat/chat-id/chat-id.component';


interface chat_user {
  chat_id: number;
  user: UserDto;

}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit {

  public CHATS_USERS = [] as chat_user[];
  public ROOM_USER = [] as RoomDto[];
  public FRIENDS_USERS = [] as UserDto[];

  // @ViewChild(ChatIdComponent) chatuser ?: chat_user;

  count_message = [] as chat_user[];

  statusTree = false;

  me?: UserDto;

  constructor(private http: HttpClient,
    private authService: AuthService,
    public router: Router,
    private userServices: UsersService
  ) {



  }

  ngAfterViewInit(): void {

    this.http.get<RoomDto[]>(`http://localhost:3000/user_room/me/rooms`)
      .subscribe((entity) => {
        let data = Object.assign(entity);
        for (let room in data) {
          this.ROOM_USER.push(data[room])
        }
      });

    this.userServices.getUser('me')
      .subscribe((user: UserDto[]) => {
        this.me = user[0];
        this.http.get(`http://localhost:3000/chat/me`)
          .subscribe(entity => {
            let data = Object.assign(entity);
            for (let chat in data) {
              let { users } = data[chat];
              let { id } = data[chat];
              let chat_friend = users.filter((user: any) => user.userId != this.me?.id);
              this.userServices.getUserById(chat_friend[0].userId)
                .subscribe((user: UserDto) => {
                  this.CHATS_USERS.push({
                    chat_id: id,
                    user: user
                  });
                });
            }
          });

        this.http.get<any[]>(`http://localhost:3000/users/me/friends`)
          .subscribe((friends: any[]) => {
            for (let friend in friends) {
              const { receiver } = friends[friend];
              const { sender } = friends[friend];
              const user = (receiver) ? receiver : sender;
              this.FRIENDS_USERS.push(user);
            }
          });
      })
  }
}
