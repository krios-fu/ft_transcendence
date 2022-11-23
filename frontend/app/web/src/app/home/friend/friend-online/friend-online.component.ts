import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-online',
  templateUrl: './friend-online.component.html',
  styleUrls: ['./friend-online.component.scss']
})
export class FriendOnlineComponent implements OnInit {

  constructor() { 
    console.log("CONSTRUCTOR APP-FRIEND-ONLINE")
  }

  ngOnInit(): void {
  }

}
