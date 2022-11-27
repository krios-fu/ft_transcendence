import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from '../dtos/user.dto';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() user = {} as UserDto;
  constructor() { 
  }

  ngOnInit(): void {
  }

}
