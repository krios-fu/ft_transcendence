import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {HttpClient} from "@angular/common/http";
import {ChatComponent} from "../../../chat/chat.component";
import {HomeComponent} from "../../home.component";


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
        children: [{name: '42'}
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
export class RoomComponent implements OnInit{

  @Output('chat') chat = new EventEmitter<string>();

  entity: Object = [];

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

  constructor( private http : HttpClient, ) {

  }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/chat/krios-fu')
      .subscribe(entity => {
        let data = Object.assign(entity); console.log(entity);
        for (let chat in data){
          const {membership} = data[chat];
          let {nickName} = membership[0].user;
          if (nickName === 'krios-fu'){
            nickName = membership[1].user.nickName;
            console.log(nickName, "<------")
          }
          TREE_CHAT[1].children?.push({
            name: nickName,
          })
        }
        this.dataSource.data = TREE_CHAT;
      })
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  sendProfile(login : string) {
    this.chat.emit(login)
    console.log(login)
  }
}
