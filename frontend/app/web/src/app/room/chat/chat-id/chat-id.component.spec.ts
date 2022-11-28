import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatIdComponent } from './chat-id.component';

describe('ChatIdComponent', () => {
  let component: ChatIdComponent;
  let fixture: ComponentFixture<ChatIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
