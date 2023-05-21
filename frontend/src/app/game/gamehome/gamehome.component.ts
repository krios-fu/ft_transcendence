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
      
  ) {
      this.http.get(`http://localhost:3000/room`)
      .subscribe((entity) => {
          console.log('ROOM', entity)
      })
  }

  
  ngOnInit(): void {
      // throw new Error("Method not implemented.");
  }

}
