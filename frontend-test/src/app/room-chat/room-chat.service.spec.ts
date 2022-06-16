import { TestBed } from '@angular/core/testing';

import { RoomChatService } from './room-chat.service';

describe('RoomChatService', () => {
  let service: RoomChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
