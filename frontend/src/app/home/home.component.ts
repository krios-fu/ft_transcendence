import { Component, OnInit,  EventEmitter, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserDto } from '../dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searching = [] as UserDto[];

  @Output() searchUser = new EventEmitter();
  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor(
    public usersService: UsersService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {}

  logout() { this.authService.logout(); }

  search(){
    const { message, room } = this.formMessage.value;
    if( message.trim() == '' )
      return false;
      this.http.get<UserDto[]>(`${environment.apiUrl}users/?filter[nickName]=${message}`)
      .subscribe(
       ( user : UserDto[]) => {
          this.searching = user;
        }
      )
    this.formMessage.controls['message'].reset();
    return true;
  }

  getSearch(user: UserDto[]) { this.searching = user; }

  clearSearch(){ this.searching = []; }
}
