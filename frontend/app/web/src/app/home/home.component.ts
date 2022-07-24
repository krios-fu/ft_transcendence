import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {HttpClient} from "@angular/common/http";
import {MatExpansionModule} from '@angular/material/expansion';
import { Chat } from '../chat/chat';
import { Payload } from '../dtos/user.dto';
import { Observable } from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ChatComponent} from "../chat/chat.component";
import {ChatModule} from "../chat/chat.module";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Rooms',
    children: [
      {
        name: 'private',
        children: [{name: '#metropolis'}, {name: '#wakanda'}, {name: '#atlantis'}
        ],
      },
      {
        name: 'public',
        children: [{name: '#42'}
        ],
      },
    ],
  },
  {
    name: 'Dm',
    children: [{name: 'onapoli-'}, {name: 'danrodri'} ],

    // children: [
    //   // {
    //   //   name: 'Green',
    //   //   children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
    //   // },
    //   {
    //     name: 'Orange',
    //     children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
    //   },
    // ],
  },
];



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private profile = {};

  private code = '';

  hidden = false;

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();



  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor( private route : ActivatedRoute, private http : HttpClient) {
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );
    this.dataSource.data = TREE_DATA;
   }

  ngOnInit(): void {

    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );

    this.route.queryParams
      .subscribe(params => {
        this.code+= '?code='+params['code'];
        console.log(this.code);
      });

    this.http.get('http://localhost:3000/auth/42/redirect'+this.code)
      .subscribe( dto  =>  {  this.profile = dto as Payload;
        console.log(this.profile) ;} );
  }

   getName()  {
    try {
      const pp = this.profile as Payload;
      return pp.userProfile.username;
    }
    catch {}
     return "marvin";
  }

  search(){
    const { message, room } = this.formMessage.value;
    console.log( message, room)
    if( message.trim() == '' )
      return false;
    this.formMessage.controls['message'].reset();
    return true;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }



}
