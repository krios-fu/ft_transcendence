import {
    Test,
    TestingModule
} from '@nestjs/testing';
import { WinnerEntity } from '../match/winner/winner.entity';
import { UserEntity } from '../user/entities/user.entity';
import { Category } from '../user/enum/category.enum';
import { MatchEntity } from '../match/match.entity';
import { AchievementControlService } from './achievement.control.service';
import { LoserEntity } from '../match/loser/loser.entity';

const   testUser: Readonly<UserEntity> = {
    username: "testUser1",
} as Readonly<UserEntity>;

const   testPlayer = {
    user: {...testUser},
    category: Category.Iron,
    ranking: 900
};

const   testMatch: Readonly<MatchEntity> = {
    winner: clonePlayer(testPlayer) as Readonly<WinnerEntity>,
    loser: clonePlayer(testPlayer) as Readonly<LoserEntity>,
} as Readonly<MatchEntity>;

function clonePlayer(src) {
    return ({
        user: {...src.user},
        category: src.category,
        ranking: src.ranking
    });
}

function cloneMatch(src: MatchEntity): MatchEntity {
    return ({
        winner: clonePlayer(src.winner) as WinnerEntity,
        loser: clonePlayer(src.loser) as LoserEntity,
    } as MatchEntity);
}

describe('AchievementControlService', () => {
    let service: AchievementControlService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AchievementControlService]
        }).compile();

        service = module.get<AchievementControlService>(AchievementControlService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /*
    **  Rookie tests
    */

    describe('rookie tests', () => {
        const   achievementId: number = 1;
        const   targetUsername: string = "user-1";
    
        it('empty matches should return false', () => {
            const   matches: MatchEntity[] = [];

            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('non-existent should return false', () => {
            const   matches: MatchEntity[] = [
                testMatch
            ];

            expect(
                service.check(achievementId, "invalid", matches)
            ).toEqual(false);
        });

        it('one valid match should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });
    
    });

    /*
    **  Hardcore tests
    */

    describe('Hardcore tests', () => {
        const   achievementId: number = 2;
        const   targetUsername: string = "user-1";
        const   rivalUsername: string = "user-2";
    
        it('empty matches should return false', () => {
            const   matches: MatchEntity[] = [];

            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('non-existent should return false', () => {
            const   matches: MatchEntity[] = [
                testMatch
            ];

            expect(
                service.check(achievementId, "invalid", matches)
            ).toEqual(false);
        });

        it('2 win matches should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });

        it('1 win match should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.loser.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            baseMatch.loser.user = {
                username: rivalUsername
            } as UserEntity;
            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('2 win matches should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.loser.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            baseMatch.loser.user = {
                username: rivalUsername
            } as UserEntity;
            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });
    
    });

    /*
    **  Superior tests
    */

    describe('Superior tests', () => {
        const   achievementId: number = 3;
        const   targetUsername: string = "user-1";
        const   rivalUsername: string = "user-2";
    
        it('empty matches should return false', () => {
            const   matches: MatchEntity[] = [];

            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('non-existent should return false', () => {
            const   matches: MatchEntity[] = [
                testMatch
            ];

            expect(
                service.check(achievementId, "invalid", matches)
            ).toEqual(false);
        });

        it('2 win matches against same rank should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('1 win match against lower rank should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.loser.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            baseMatch.loser.user = {
                username: rivalUsername
            } as UserEntity;
            baseMatch.loser.ranking = 800;
            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 900;
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('2 win matches against lower rank should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 800;
            baseMatch.winner.ranking = 900;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });

        it('3 win matches against lower rank should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 800;
            baseMatch.winner.ranking = 900;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });

        it('2 win matches against higher rank should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 900;
            baseMatch.winner.ranking = 600;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });
    
    });

    /*
    **  Giant Killer tests
    */

    describe('Giant Killer tests', () => {
        const   achievementId: number = 4;
        const   targetUsername: string = "user-1";
        const   rivalUsername: string = "user-2";
    
        it('empty matches should return false', () => {
            const   matches: MatchEntity[] = [];

            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('non-existent should return false', () => {
            const   matches: MatchEntity[] = [
                testMatch
            ];

            expect(
                service.check(achievementId, "invalid", matches)
            ).toEqual(false);
        });

        it('2 win matches against same rank should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('1 win match against lower rank should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.loser.user = {
                username: targetUsername
            } as UserEntity;
            matches.push(cloneMatch(baseMatch));
            baseMatch.loser.user = {
                username: rivalUsername
            } as UserEntity;
            baseMatch.loser.ranking = 800;
            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 900;
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('2 win matches against lower rank should return false', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 800;
            baseMatch.winner.ranking = 900;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(false);
        });

        it('2 win matches against higher rank should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 900;
            baseMatch.winner.ranking = 600;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });

        it('3 win matches against higher rank should return true', () => {
            const   baseMatch: MatchEntity = cloneMatch(testMatch);
            let     matches: MatchEntity[] = [];

            baseMatch.winner.user = {
                username: targetUsername
            } as UserEntity;
            baseMatch.loser.ranking = 900;
            baseMatch.winner.ranking = 600;
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            matches.push(cloneMatch(baseMatch));
            expect(
                service.check(achievementId, targetUsername, matches)
            ).toEqual(true);
        });
    
    });

});
