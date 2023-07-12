import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtfComponent } from './wtf.component';

describe('WtfComponent', () => {
  let component: WtfComponent;
  let fixture: ComponentFixture<WtfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WtfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WtfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
