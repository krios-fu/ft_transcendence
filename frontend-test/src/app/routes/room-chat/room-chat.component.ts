import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoomChatService } from '../../services/room-chat.service';

@Component({
  selector: 'app-room-chat',
  templateUrl: './room-chat.component.html',
  styleUrls: ['./room-chat.component.css']
})
export class RoomChatComponent implements OnInit {
  createRoomForm = this.formBuilder.group({
    room_name: '',
  });

  constructor(
    public roomChatService: RoomChatService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    console.log(':-)');
  }
}
