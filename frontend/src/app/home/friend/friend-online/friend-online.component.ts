import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';

@Component({
  selector: 'app-friend-online',
  templateUrl: './friend-online.component.html',
  styleUrls: ['./friend-online.component.scss']
})
export class FriendOnlineComponent implements OnInit {

  friends = [] as UserDto[];

  urlApi = 'http://localhost:3000/'
  constructor(private http: HttpClient) {
    console.log("CONSTRUCTOR APP-FRIEND-ONLINE")
  }

  ngOnInit(): void {
    this.http.get<any[]>(this.urlApi + 'users/me/friends')
      .subscribe((friends: any[]) => {
        for (let friend in friends) {
          const { receiver } = friends[friend];
          const { sender } = friends[friend];
          const user = (receiver) ? receiver : sender;
          if (user.defaultOffline)
            this.friends.push(user);
        }
      })

      this.http.get<any[]>(this.urlApi + 'users/me/friends/as_pending')
      .subscribe((friends: any[]) => {
        console.log("frinedd pending", friends)
        for (let friend in friends) {
          const { receiver } = friends[friend];
          const { sender } = friends[friend];
          const user = (receiver) ? receiver : sender;
          if (user.defaultOffline)
            this.friends.push(user);
        }
      })
  }
}
