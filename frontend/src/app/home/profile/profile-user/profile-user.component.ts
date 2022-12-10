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

  icon_friend =  'person_add'

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
          
          // this.http.get(`${this.urlApi}users/me/friends/${this.user?.id}`)
          // .subscribe( (data : any )=> {
          //   console.log('FRIEND', data);
          //   // if( data.status === 404 )
          //   //   this.
            
          // })
          
        })
    })
  }

  getNickName() {
    return this.user?.nickName;
  }


  getPhotoUrl() {
    return this.user?.photoUrl;
  }

  post_friendship(){

    this.http.post(`${this.urlApi}users/me/friends`, {
      receiverId: this.user?.id,

    }).subscribe(
      data => {
        console.log(data);
      }
    )
  }

}
