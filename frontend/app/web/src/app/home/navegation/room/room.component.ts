import {AfterViewChecked, AfterViewInit, Component, EventEmitter, OnInit, Input, ViewChild} from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {HttpClient} from "@angular/common/http";
import {ChatComponent} from "../../../chat/chat.component";
import {HomeComponent} from "../../home.component";
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UserDto } from 'src/app/dtos/user.dto';
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";



interface FoodNode {
  name: string;
  children?: FoodNode[];
}

let TREE_CHAT: FoodNode[] = [
  {
    name: 'Rooms',
    children: [
      {
        name: 'public',
        children: [{name: '42'}, {name: 'metropolis'}, {name: 'wakanda'}, {name: 'atlantis'}
        ],
      },
      {
        name: 'private',
        children: [{name: 'metropolis'}, {name: 'wakanda'}, {name: 'atlantis'}
        ],
      },
    ],
  },
  {
    name: 'Dm',
    children: [],
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}



@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit{

  statusTree = false;


  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor( private http : HttpClient, 
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    ) {


    }

  ngAfterViewInit(): void  {
    let lol = this.authService.getAuthUser();

//     this.usersService.getUser()
//     .subscribe({
//         next: (userDto : UserDto) => {
//           console.log(userDto);
//             // this.user = userDto.username;
//             // this.firstName = userDto.firstName;
//             // this.lastName = userDto.lastName;
//             // this.navHeader.profile = userDto ;
//         }
// });
    
    console.log(`http://localhost:3000/users/${lol}/chat`);
    this.http.get(`http://localhost:3000/users/${lol}/chat`)
    .subscribe( entity => {
      let data = Object.assign(entity);
      let user_sesion = lol;
      // TREE_CHAT[1].children?.pop();
      for (let chat in data){
        const {membership} = data[chat];
        let {nickName} = membership[0].user;
        if (nickName === user_sesion ){
          nickName = membership[1].user.nickName;
        }
        this.statusTree = true;
        if (!(TREE_CHAT[1].children?.find( (child) => {
            return child.name === nickName 
        })))
          TREE_CHAT[1].children?.push({
            name: nickName,
          })
    }
    console.log("holaaaaa");
    this.dataSource.data = TREE_CHAT;
  });
 
  }

  


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


}
