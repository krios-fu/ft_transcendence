import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
  icon_friend_activate = true;

  urlApi = 'http://localhost:3000/';

  public FRIENDS_USERS = [] as UserDto[];


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

          this.FRIENDS_USERS = [];
          this.icon_friend_activate = true;

          // change de icone visible add o remove 
          this.http.get<any>(this.urlApi + 'users/me/friends/' + this.user?.id)
            .subscribe((friend: any) => {
              if (friend) {
                const { receiver } = friend;
                const { sender } = friend;
                const user = (receiver) ? receiver : sender;
                if (user.username == this.user?.username)
                  this.icon_friend = 'person_remove';
              }
              else
                this.icon_friend_activate = false;

              this.http.get<any[]>(`http://localhost:3000/users/${this.user?.id}/friends`)
                .subscribe((friends: any[]) => {
                  for (let friend in friends) {
                    const { receiver } = friends[friend];
                    const { sender } = friends[friend];
                    const user = (receiver) ? receiver : sender;
                    if (user)
                      this.FRIENDS_USERS.push(user);
                  }
                  console.log("USER FRIENS", this.FRIENDS_USERS)
                })

            })
        });
    });
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
