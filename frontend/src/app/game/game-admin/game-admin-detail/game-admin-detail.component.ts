import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';

@Component({
  selector: 'app-game-admin-detail',
  templateUrl: './game-admin-detail.component.html',
  styleUrls: ['./game-admin-detail.component.scss']
})
export class GameAdminDetailComponent implements OnInit {

  selectedUser?: UserDto;

  constructor() { }

  ngOnInit(): void {
  }

}
