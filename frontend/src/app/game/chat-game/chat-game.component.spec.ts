import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGameComponent } from './chat-game.component';

describe('ChatGameComponent', () => {
  let component: ChatGameComponent;
  let fixture: ComponentFixture<ChatGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
