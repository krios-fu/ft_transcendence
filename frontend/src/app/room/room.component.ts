import { AfterViewChecked, AfterViewInit, Component, EventEmitter, OnInit, Input, ViewChild } from '@angular/core';
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';



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
        children: [{ name: '42' }, { name: 'metropolis' }, { name: 'wakanda' }, { name: 'atlantis' }
        ],
      },
      {
        name: 'private',
        children: [{ name: 'metropolis' }, { name: 'wakanda' }, { name: 'atlantis' }
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
export class RoomComponent implements AfterViewInit {

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

  constructor(private http: HttpClient,
    private authService: AuthService,
    public router: Router,
    private usersService: UsersService,
    routeActivate: ActivatedRoute,
  ) {


  }

  ngAfterViewInit(): void {
    const user_sesion = this.authService.getAuthUser();

    this.http.get(`http://localhost:3000/users/me/chats`)
      .subscribe(entity => {
        let data = Object.assign(entity);
        for (let chat in data) {
          const { membership } = data[chat];
          let { nickName, username } = membership[0].user;
          if (username === user_sesion) {
            console.log(membership[1])
            nickName = membership[1].user.nickName;
          }
          this.statusTree = true;
          if (!(TREE_CHAT[1].children?.find((child) => {
            return child.name === nickName
          })))
            TREE_CHAT[1].children?.push({
              name: nickName,
            })
        }
        this.dataSource.data = TREE_CHAT;
      });
  }



  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
