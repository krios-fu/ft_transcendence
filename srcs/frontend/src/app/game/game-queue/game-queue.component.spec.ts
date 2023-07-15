import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameQueueComponent } from './game-queue.component';

describe('GameQueueComponent', () => {
    let component: GameQueueComponent;
    let fixture: ComponentFixture<GameQueueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ GameQueueComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameQueueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
