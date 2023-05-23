import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSessionComponent } from './otp-session.component';

describe('OtpSessionComponent', () => {
  let component: OtpSessionComponent;
  let fixture: ComponentFixture<OtpSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
