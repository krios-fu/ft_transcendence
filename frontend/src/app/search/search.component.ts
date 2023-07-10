import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from '../dtos/user.dto';
import { g_buildImgUrl } from '../game/utils/images';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() users = [] as UserDto [];
  constructor() { 
  }

  ngOnInit(): void {}

  clearUser(){
    this.users = [];
  }

  buildImgUrl(imgPath: string): string {
    return (g_buildImgUrl(imgPath));
  }

}
