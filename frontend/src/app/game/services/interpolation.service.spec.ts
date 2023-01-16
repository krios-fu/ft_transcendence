import { TestBed } from '@angular/core/testing';
import { IBallData } from '../elements/Ball';
import {
    IMatchData,
    Match
} from '../elements/Match';
import { IPaddleData } from '../elements/Paddle';
import { IPlayerData } from '../elements/Player';

import { InterpolationService } from './interpolation.service';

const   sampleBall: IBallData = {
    xPos: 400,
    yPos: 300,
    xVel: 300,
    yVel: 300
};

const   samplePaddle: IPaddleData = {
    xPos: 300,
    yPos: 300
};

const   samplePlayer: IPlayerData = {
    paddle: samplePaddle,
    hero: undefined,
    score: 0
};

const   sampleMatch: IMatchData = {
    ball: sampleBall,
    playerA: samplePlayer,
    playerB: {
        paddle: {...samplePlayer.paddle},
        hero: samplePlayer.hero ? {...samplePlayer.hero} : undefined,
        score: samplePlayer.score
    },
    when: 0
};

describe('InterpolationService', () => {
    let service: InterpolationService;
    let buffer: IMatchData[];

    beforeEach(() => {
        TestBed.configureTestingModule({providers: [InterpolationService]});
        service = TestBed.inject(InterpolationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fill buffer with correct ball xPos interpolations', () => {
        const   match: IMatchData = Match.copyMatchData(sampleMatch);
        const   serverSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   currentSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   totalSnapshots: number = 3;
    
        buffer = [];
        buffer.length = 3;
        buffer.fill({...match});
        serverSnapshot.ball.xPos = 405;
        serverSnapshot.ball.yPos = 305;
        serverSnapshot.when = 1000 / 60;
        service.fillBuffer(buffer, serverSnapshot, currentSnapshot,
                            totalSnapshots);
        expect(buffer.length).toBe(3);
        expect(buffer[0].ball.xPos).toBe(405);
        expect(buffer[1].ball.xPos).toBe(410);
        expect(buffer[2].ball.xPos).toBe(415);
    });

});
