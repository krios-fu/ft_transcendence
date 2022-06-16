import { Component, OnInit } from '@angular/core';
import { RoomChatService } from './room-chat.service';

@Component({
  selector: 'app-room-chat',
  templateUrl: './room-chat.component.html',
  styleUrls: ['./room-chat.component.css']
})
export class RoomChatComponent implements OnInit {
  constructor(
    private roomChatService: RoomChatService,
  ) { }

  ngOnInit(): void { }

}
