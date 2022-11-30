import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';

@Component({
  selector: 'app-friend-online',
  templateUrl: './friend-online.component.html',
  styleUrls: ['./friend-online.component.scss']
})
export class FriendOnlineComponent implements OnInit {

  friends = [] as UserDto [];

  constructor() { 
    console.log("CONSTRUCTOR APP-FRIEND-ONLINE")
  }

  ngOnInit(): void {
/* 
    username:string,
		firstName:string,
		lastName:string,
		profileUrl:string,
		email:string,
		photoUrl:string */
    const a = new UserDto("laumoral", "Laura Daniela", "Morales Gutiérrez", "https://cdn.intra.42.fr/users/c04467f143bf1c9f0dd51ac50b742b36/laumoral.jpg","laumoral@student.42madrid.com", "https://cdn.intra.42.fr/users/c04467f143bf1c9f0dd51ac50b742b36/laumoral.jpg");
    this.friends.push(a);

    const b = new UserDto("onapoli-","Omar","Napoli larrabure","https://api.intra.42.fr/v2/users/onapoli-", "onapoli-@student.42madrid.com","https://cdn.intra.42.fr/users/eae7df33c0c049a30bf2189a772000fd/onapoli-.jpg" )
    this.friends.push(b);
  }

}
