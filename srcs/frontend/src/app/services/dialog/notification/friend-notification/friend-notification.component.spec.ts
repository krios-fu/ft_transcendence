import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendNotificationComponent } from './friend-notification.component';

describe('FriendNotificationComponent', () => {
  let component: FriendNotificationComponent;
  let fixture: ComponentFixture<FriendNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
