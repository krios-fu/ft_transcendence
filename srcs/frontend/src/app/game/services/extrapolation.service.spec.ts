import { TestBed } from '@angular/core/testing';
import { IBallData } from '../elements/Ball';
import {
    IMatchData,
    Match
} from '../elements/Match';
import { IPlayerData } from '../elements/Player';
import { ExtrapolationService } from './extrapolation.service';
import { IPredictionInit } from './prediction.service';

const   sampleBall: IBallData = {
    xPos: 400,
    yPos: 300,
    xVel: 300,
    yVel: 300
};

const   samplePlayer: IPlayerData = {
    paddleY: 300,
    hero: undefined,
    score: 0
};

const   sampleMatch: IMatchData = {
    ball: sampleBall,
    playerA: samplePlayer,
    playerB: {
        paddleY: samplePlayer.paddleY,
        hero: samplePlayer.hero ? {...samplePlayer.hero} : undefined,
        score: samplePlayer.score
    },
    when: 0
};

const   samplePredictionInit: IPredictionInit = {
    gameWidth: 800,
    gameHeight: 600,
    ballRadius: 5,
    aPaddleX: 800 * 0.9,
    bPaddleX: 800 * 0.1,
    paddleHeight: 50,
    paddleWidth: 10
};

describe('ExtrapolationService', () => {
    let service: ExtrapolationService;
    let buffer: IMatchData[];

    beforeEach(() => {
        TestBed.configureTestingModule({providers: [ExtrapolationService]});
        service = TestBed.inject(ExtrapolationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fill buffer with correct extrapolations', () => {
        const   bufferSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   totalSnapshots: number = 3;
        const   interval: number = 1000 / 60;
    
        buffer = [];
        bufferSnapshot.ball.xPos = 405;
        bufferSnapshot.ball.yPos = 305;
        bufferSnapshot.when = interval;
        buffer.push(bufferSnapshot);
        service.init(samplePredictionInit);
        service.fillBuffer(buffer, totalSnapshots);
        expect(buffer.length).toBe(3);
        expect(buffer[0].ball.xPos).toBe(405);
        expect(buffer[0].when).toBe(interval);
        expect(buffer[1].ball.xPos).toBe(410);
        expect(buffer[1].when).toBe(interval * 2);
        expect(buffer[2].ball.xPos).toBe(415);
        expect(buffer[2].when).toBe(interval * 3);
    });

});
