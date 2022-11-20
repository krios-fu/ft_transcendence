import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../user/user.entity';
import { GameRankingService } from './game.rankingService';

describe('GameRankingService', () => {
    let service: GameRankingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ GameRankingService ],
        }).compile();

        service = module.get<GameRankingService>(GameRankingService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /*
    **  getCategory() tests
    */

    describe('getCategory(0)', () => {
        it('should return Iron', () => {
            const   input: number = 0;

            expect(
                service.getCategory(input)
            ).toEqual(Category.Iron);
        });
    });

    describe('getCategory(-100)', () => {
        it('should return Iron', () => {
            const   input: number = -100;

            expect(
                service.getCategory(input)
            ).toEqual(Category.Iron);
        });
    });

    describe('getCategory(1100)', () => {
        it('should return Bronze', () => {
            const   input: number = 1100;

            expect(
                service.getCategory(input)
            ).toEqual(Category.Bronze);
        });
    });

    describe('getCategory(1300)', () => {
        it('should return Bronze', () => {
            const   input: number = 1300;

            expect(
                service.getCategory(input)
            ).toEqual(Category.Bronze);
        });
    });

    describe('getCategory(10000000)', () => {
        it('should return Platinum', () => {
            const   input: number = 10000000;

            expect(
                service.getCategory(input)
            ).toEqual(Category.Platinum);
        });
    });

    /*
    **  updateRanking() tests
    */

    describe('updateRanking(1000, 1000, 0)', () => {
        it('should return [ 1016, 984 ]', () => {
            const   input: [ number, number, number ] = [ 1000, 1000, 0 ];
            const   output: [ number, number ] = [ 1016, 984 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(1123, 0, 0)', () => {
        it('should return [ 1123, -0 ]', () => {
            const   input: [ number, number, number ] = [ 1123, 0, 0 ];
            const   output: [ number, number ] = [ 1123, -0 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(2000, 2500, 0)', () => {
        it('should return [ 2030, 2470 ]', () => {
            const   input: [ number, number, number ] = [ 2000, 2500, 0 ];
            const   output: [ number, number ] = [ 2030, 2470 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(2500, 2000, 1)', () => {
        it('should return [ 2470, 2030 ]', () => {
            const   input: [ number, number, number ] = [ 2500, 2000, 1 ];
            const   output: [ number, number ] = [ 2470, 2030 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(850, -324, 1)', () => {
        it('should return [ 818, -292 ]', () => {
            const   input: [ number, number, number ] = [ 850, -324, 1 ];
            const   output: [ number, number ] = [ 818, -292 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(850, -324, 0)', () => {
        it('should return [ 850, -324 ]', () => {
            const   input: [ number, number, number ] = [ 850, -324, 0 ];
            const   output: [ number, number ] = [ 850, -324 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(-1100, -245, 0)', () => {
        it('should return [ -1068, -277 ]', () => {
            const   input: [ number, number, number ] = [ -1100, -245, 0 ];
            const   output: [ number, number ] = [ -1068, -277 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

    describe('updateRanking(-1100, -245, 1)', () => {
        it('should return [ -1100, -245 ]', () => {
            const   input: [ number, number, number ] = [ -1100, -245, 1 ];
            const   output: [ number, number ] = [ -1100, -245 ];

            expect(
                service.updateRanking(...input)
            ).toEqual(output);
        });
    });

});
