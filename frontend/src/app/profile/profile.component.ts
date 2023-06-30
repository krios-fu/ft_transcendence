import { Component, OnInit } from '@angular/core';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  constructor( public usersService: UsersService ) {}

  ngOnInit(): void {}

}