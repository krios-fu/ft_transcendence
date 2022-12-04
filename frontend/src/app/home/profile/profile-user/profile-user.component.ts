import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  user: UserDto | undefined;

  constructor(private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.user = undefined;
  }

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      // this.formMessage.patchValue({ id });

    
    this.http.get<UserDto[]>(`http://localhost:3000/users?filter[username]=${id}`)
      .subscribe((user: UserDto[]) => {
        this.user = user[0];
      })

  })
}

getUsername() {
  return this.user?.username;
}


getPhotoUrl() {
  return this.user?.photoUrl;
}

}
