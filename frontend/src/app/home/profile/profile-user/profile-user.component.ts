import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  user: UserDto | undefined;

  state = {
    'send': true,
    'pending': false,
    'accept': false,
  };

  icon_friend = 'person_add'

  urlApi = 'http://localhost:3000/';

  constructor(private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private chatService: ChatService,
  ) {
    this.user = undefined;
  }

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      // this.formMessage.patchValue({ id });



      this.http.get<UserDto[]>(`${this.urlApi}users?filter[nickName]=${id}`)
        .subscribe((user: UserDto[]) => {
          this.user = user[0];
          this.chatService.createChat(this.user.id);

          // change de icone visible add o remove 
          this.http.get<any>(this.urlApi + 'users/me/friends/' + this.user?.id)
            .subscribe((friend: any) => {
              const { receiver } = friend;
              const { sender } = friend;
              const user = (receiver) ? receiver : sender;
              if (user.username == this.user?.username)
                this.icon_friend = 'person_remove';

            })
        });
    })
  }

  getNickName() {
    return this.user?.nickName;
  }


  getPhotoUrl() {
    return this.user?.photoUrl;
  }

  post_friendship() {

    if (this.icon_friend === 'person_add') {
      this.http.post(`${this.urlApi}users/me/friends`, {
        receiverId: this.user?.id,
      }).subscribe(
        data => {
          console.log(data);
        })
    }
    else if (this.icon_friend === 'person_remove') {
      // endpoiint deleted friend
    }
  }

}
