import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGameIdComponent } from './room-game-id.component';

describe('RoomGameIdComponent', () => {
  let component: RoomGameIdComponent;
  let fixture: ComponentFixture<RoomGameIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomGameIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomGameIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
