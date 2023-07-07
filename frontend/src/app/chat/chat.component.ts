import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { Friendship } from '../dtos/block.dto';



interface chat_user {
  chat_id: number;
  user: UserDto;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {

  public CHATS_USERS = [] as chat_user[];
  me?: UserDto;

  constructor(
    private userServices: UsersService,
    private http: HttpClient,
  ) {}



  ngOnInit(): void {

    this.userServices.getUser('me')
      .subscribe((user: UserDto) => {
        this.me = user;
        this.get_user_blocked(this.me);
        this.http.get(`${environment.apiUrl}chat/me`)
        .subscribe(entity => {
          let data = Object.assign(entity);
            for (let chat in data) {
              let { users } = data[chat];
              let { id } = data[chat];
              let chat_friend = users.filter((user: any) => { return user.userId != this.me?.id });
              if (chat_friend.length != 0)
                this.userServices.getUserById(chat_friend[0].userId)
                  .subscribe((user: UserDto) => {
                    this.CHATS_USERS.push({
                      chat_id: id,
                      user: user
                    });
                  },
                   error => {
                  });
            }
          });
      }, error => {})
  }
  
  
  get_user_blocked(me : UserDto): void {
    this.userServices.get_blocked_users()
    .subscribe((blocked : Friendship [])=> {
        console.log('user blocked', blocked);
    })
  }
  
}