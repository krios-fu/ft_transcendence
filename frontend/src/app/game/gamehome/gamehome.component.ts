import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gamehome',
  templateUrl: './gamehome.component.html',
  styleUrls: ['./gamehome.component.scss']
})
export class GamehomeComponent implements OnInit {


  ROOM_PUBLIC = []
  private_room = true;
  constructor (private http: HttpClient
      
  ) { }

  
  ngOnInit(): void { }

}
