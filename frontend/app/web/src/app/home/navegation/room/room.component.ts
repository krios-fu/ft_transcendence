import { Component, OnInit } from '@angular/core';
import {FlatTreeControl, NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {HttpClient} from "@angular/common/http";


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

let TREE_DATA: FoodNode[] = [
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
    children: [{name: 'onapoli-'}, {name: 'danrodri'} ],
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
export class RoomComponent implements OnInit {

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

  constructor( private http : HttpClient) {

  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit(): void {

    this.http.get('http://localhost:3000/chat')
      .subscribe( entity   => { let data = Object.assign(entity) ; console.log(entity); TREE_DATA[1].children[0].name = data[0].membership[0].user.nickName;
        this.dataSource.data = TREE_DATA; } )
  }

}
