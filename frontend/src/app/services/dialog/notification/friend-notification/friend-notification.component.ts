import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/dtos/user.dto';
import { AlertServices } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-notification',
  templateUrl: './friend-notification.component.html',
  styleUrls: ['./friend-notification.component.scss']
})
export class FriendNotificationComponent implements OnInit {
  public FRIENDS_USERS_PENDDING = [] as UserDto[];
  urlApi = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertServices,
    private chatService: ChatService,
    private router: Router ) {
    }

  ngOnInit(): void {
    const user_sesion = this.authService.getAuthUser();

    this.http.get<any[]>(environment.apiUrl + '/users/me/friends/as_pending')
    .subscribe((friends: any[]) => {
      for (let friend in friends) {
        const { receiver } = friends[friend];
        const { sender } = friends[friend];
        
        const user = (receiver) ? receiver : sender;
        if (sender && (sender.username !== user_sesion) )
            this.FRIENDS_USERS_PENDDING.push(user);
      }
    })
  }


  add_friend(id_friend : number){
    this.http.patch(`${this.urlApi}users/me/friends/accept`, {
      id: id_friend
    })
    .subscribe(()=> {
     this.FRIENDS_USERS_PENDDING = this.FRIENDS_USERS_PENDDING.filter((user : UserDto)=> user.id !== id_friend)
     this.alertService.openSnackBar("Friend add", "Close");
    })
  }

  open_chat(id_friend : number, username_friend : string ){
    this.chatService.createChat(id_friend)
    .subscribe(() => {
      this.router.navigate([ '/', { outlets: {  chat: ['chat', username_friend] } }]);
    })
  }
}
