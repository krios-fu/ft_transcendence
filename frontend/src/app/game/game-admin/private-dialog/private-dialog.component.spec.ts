import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateDialogComponent } from './private-dialog.component';

describe('PrivateDialogComponent', () => {
  let component: PrivateDialogComponent;
  let fixture: ComponentFixture<PrivateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
