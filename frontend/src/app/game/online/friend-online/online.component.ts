import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit {

  friends = [] as UserDto [];

  constructor() { 
    console.log("CONSTRUCTOR ONLINE ROOM")
  }

  ngOnInit(): void {
/* 
    username:string,
		firstName:string,
		lastName:string,
		profileUrl:string,
		email:string,
		photoUrl:string */
  

    // const b = new UserDto("onapoli-","Omar","Napoli larrabure","https://api.intra.42.fr/v2/users/onapoli-", "onapoli-@student.42madrid.com","https://cdn.intra.42.fr/users/eae7df33c0c049a30bf2189a772000fd/onapoli-.jpg" )
    // this.friends.push(b);
    // const c = new UserDto("onapoli-","Omar","Napoli larrabure","https://api.intra.42.fr/v2/users/onapoli-", "onapoli-@student.42madrid.com","https://cdn.intra.42.fr/users/eae7df33c0c049a30bf2189a772000fd/onapoli-.jpg" )
    // this.friends.push(c);
    // const d = new UserDto("onapoli-","Omar","Napoli larrabure","https://api.intra.42.fr/v2/users/onapoli-", "onapoli-@student.42madrid.com","https://cdn.intra.42.fr/users/eae7df33c0c049a30bf2189a772000fd/onapoli-.jpg" )
    // this.friends.push(d);
    // const e = new UserDto("onapoli-","Omar","Napoli larrabure","https://api.intra.42.fr/v2/users/onapoli-", "onapoli-@student.42madrid.com","https://cdn.intra.42.fr/users/eae7df33c0c049a30bf2189a772000fd/onapoli-.jpg" )
    // this.friends.push(e);
    // const f = new UserDto("onapoli-","Omar","Napoli larrabure","https://api.intra.42.fr/v2/users/onapoli-", "onapoli-@student.42madrid.com","https://cdn.intra.42.fr/users/eae7df33c0c049a30bf2189a772000fd/onapoli-.jpg" )
    // this.friends.push(f);

  }

}
