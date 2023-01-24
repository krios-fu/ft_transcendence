import { TestBed } from '@angular/core/testing';
import { IBallData } from '../elements/Ball';
import {
    IMatchData,
    Match
} from '../elements/Match';
import { IPlayerData } from '../elements/Player';

import { InterpolationService } from './interpolation.service';

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
        const   serverSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   currentSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   totalSnapshots: number = 3;
        const   role: string = "Spectator";
    
        buffer = [];
        serverSnapshot.ball.xPos = 415;
        serverSnapshot.ball.yPos = 315;
        serverSnapshot.when = 1000 / 20;
        service.fillBuffer(buffer, {
            serverSnapshot: serverSnapshot,
            currentSnapshot: currentSnapshot,
            totalSnapshots: totalSnapshots,
            role: role
        });
        expect(buffer.length).toBe(3);
        expect(buffer[0].ball.xPos).toBe(405);
        expect(buffer[1].ball.xPos).toBe(410);
        expect(buffer[2].ball.xPos).toBe(415);
    });

    it('should update 1 buffer snapshot and add other 2', () => {
        const   bufferSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   serverSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   currentSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   totalSnapshots: number = 3;
        const   role: string = "Spectator";
        const   interval: number = 1000 / 60;
    
        buffer = [];
        bufferSnapshot.ball.xPos = 405;
        bufferSnapshot.ball.yPos = 305;
        bufferSnapshot.when = currentSnapshot.when + interval;
        buffer.push(bufferSnapshot);
        serverSnapshot.ball.xPos = 415;
        serverSnapshot.ball.yPos = 315;
        serverSnapshot.playerA.paddleY = 500;
        serverSnapshot.when = interval * 3;
        service.fillBuffer(buffer, {
            serverSnapshot: serverSnapshot,
            currentSnapshot: currentSnapshot,
            totalSnapshots: totalSnapshots,
            role: role
        });
        expect(buffer.length).toBe(3);
        expect(buffer[0].ball.xPos).toBe(405);
        expect(buffer[0].playerA.paddleY).toBeGreaterThan(
            sampleMatch.playerA.paddleY
        );
        expect(buffer[0].when).toBe(currentSnapshot.when + interval);
        expect(buffer[1].ball.xPos).toBe(410);
        expect(buffer[1].playerA.paddleY).toBeGreaterThan(
            buffer[0].playerA.paddleY
        );
        expect(buffer[1].when).toBe(buffer[0].when + interval);
        expect(buffer[2].ball.xPos).toBe(415);
        expect(buffer[2].playerA.paddleY).toBe(serverSnapshot.playerA.paddleY);
        expect(buffer[2].when).toBe(buffer[1].when + interval);
    });

    it('should substitute 1 buffer snapshot and add other 2', () => {
        const   serverSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   currentSnapshot: IMatchData = Match.copyMatchData(sampleMatch);
        const   totalSnapshots: number = 3;
        const   role: string = "Spectator";
        const   interval: number = 1000 / 60;
        let     bufferSnapshot: IMatchData;
    
        currentSnapshot.ball.xVel = 0;
        currentSnapshot.ball.yVel = 0;
        buffer = [];
        bufferSnapshot = Match.copyMatchData(currentSnapshot);
        bufferSnapshot.when = currentSnapshot.when + interval;
        buffer.push(bufferSnapshot);
        serverSnapshot.ball.xPos = 415;
        serverSnapshot.ball.yPos = 315;
        serverSnapshot.when = interval * 3;
        service.fillBuffer(buffer, {
            serverSnapshot: serverSnapshot,
            currentSnapshot: currentSnapshot,
            totalSnapshots: totalSnapshots,
            role: role
        });
        expect(buffer.length).toBe(3);
        expect(buffer[0].ball.xPos).toBe(405);
        expect(buffer[0].when).toBe(currentSnapshot.when + interval);
        expect(buffer[1].ball.xPos).toBe(410);
        expect(buffer[1].when).toBe(buffer[0].when + interval);
        expect(buffer[2].ball.xPos).toBe(415);
        expect(buffer[2].when).toBe(buffer[1].when + interval);
    });

});
