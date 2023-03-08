import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomDto } from 'src/app/dtos/room.dto';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';

enum role {
  Admin = 1
}

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit {

  players = [] as UserDto[];
  @Input() id_room?: string = '';
  is_admin = false;
  admins = []

  constructor(private http: HttpClient,
    public router: Router) {
  }

  ngOnInit(): void {
    let user: UserDto;
    this.http.get(`http://localhost:3000/users/me`)
      .subscribe((entity) => {
        user = Object.assign(entity)[0];
        this.http.get(`http://localhost:3000/user_roles/users/${user.id}`)
          .subscribe((entity) => {
            let data = Object.assign(entity);
            if (data.length && data[0]['roleId'] == role.Admin)
              this.is_admin = true;
          });
      });

    this.http.get(`http://localhost:3000/user_roles/roles/${role.Admin}`)
      .subscribe((entity) => {
        this.admins = Object.assign(entity);
        this.http.get(`http://localhost:3000/user_room/rooms/1/users`)
          .subscribe((entity) => {
            let data = Object.assign(entity);
            for (let user in data) {
              let player = data[user]['user'] as UserDto;
              player.is_admin = false;
              this.admins.forEach((element: any) => {
                if (element.userId === player['id'])
                  player.is_admin = true;
              });
              this.players.push(player)
            }
          });
      });

  }


  goTochat($event: any) {
    console.log($event);
  }

}
