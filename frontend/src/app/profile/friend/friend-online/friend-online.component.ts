import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-friend-online',
  templateUrl: './friend-online.component.html',
  styleUrls: ['./friend-online.component.scss']
})
export class FriendOnlineComponent implements OnInit {

  friends = [] as UserDto[];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}users/me/friends`)
      .subscribe((friends: any[]) => {
        for (let friend in friends) {
          const { receiver } = friends[friend];
          const { sender } = friends[friend];
          const user = (receiver) ? receiver : sender;
          if (user.defaultOffline)
            this.friends.push(user);
        }
      })

    this.http.get<any[]>(`${environment.apiUrl}users/me/friends/as_pending`)
      .subscribe((friends: any[]) => {
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
