import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAdminDetailComponent } from './game-admin-detail.component';

describe('GameAdminDetailComponent', () => {
  let component: GameAdminDetailComponent;
  let fixture: ComponentFixture<GameAdminDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameAdminDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAdminDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
