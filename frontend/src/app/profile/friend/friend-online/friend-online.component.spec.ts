import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendOnlineComponent } from './friend-online.component';

describe('FriendOnlineComponent', () => {
  let component: FriendOnlineComponent;
  let fixture: ComponentFixture<FriendOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
