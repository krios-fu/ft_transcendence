import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/services/user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { GameQueueService } from './game.queueService';
import { Category } from '../user/dto/user.dto';

const   mockUsers: UserEntity[] = (() => {
    const   res: UserEntity[] = [
        new UserEntity(),
        new UserEntity(),
        new UserEntity(),
        new UserEntity(),
        new UserEntity()
    ];

    res[0].category = Category.Iron;
    res[1].category = Category.Bronze;
    res[2].category = Category.Silver;
    res[3].category = Category.Gold;
    res[4].category = Category.Platinum;
    return (res);
})();

describe('GameQueueService', () => {
    let service: GameQueueService;
    let repository: Repository<UserEntity>;

    beforeEach(async () => {
        const   module: TestingModule = await Test.createTestingModule({
            providers: [
              GameQueueService,
              UserMapper,
              UserService,
              {
                provide: getRepositoryToken(UserEntity),
                useClass: Repository,
              },
            ],
        }).compile();

        service = module.get<GameQueueService>(GameQueueService);
        repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /*
    **  getNextPlayers() tests
    */

    describe('getNextPlayers()', () => {
        it('should return players of same Category', async () => {
            const   gameId: string = "Game1";
            const   output: [ UserEntity, UserEntity, number ] =
                                [ mockUsers[0], mockUsers[0], 0 ];

            jest.spyOn(repository, 'findOne')
            .mockResolvedValueOnce({...mockUsers[0]})
            .mockResolvedValueOnce({...mockUsers[4]})
            .mockResolvedValueOnce({...mockUsers[0]});
            await service.add(gameId, false, "first");
            await service.add(gameId, false, "second");
            await service.add(gameId, false, "third");
            expect(
                service.getNextPlayers(gameId)
            ).toEqual(output);
        });
    });

    describe('getNextPlayers()', () => {
        it('should return players of nearest category', async () => {
            const   gameId: string = "Game1";
            const   output: [ UserEntity, UserEntity, number ] =
                                [ mockUsers[0], mockUsers[3], 0 ];

            jest.spyOn(repository, 'findOne')
            .mockResolvedValueOnce({...mockUsers[0]})
            .mockResolvedValueOnce({...mockUsers[4]})
            .mockResolvedValueOnce({...mockUsers[3]});
            await service.add(gameId, false, "first");
            await service.add(gameId, false, "second");
            await service.add(gameId, false, "third");
            expect(
                service.getNextPlayers(gameId)
            ).toEqual(output);
        });
    });

    describe('getNextPlayers()', () => {
        it('should return players of nearest category', async () => {
            const   gameId: string = "Game1";
            const   output: [ UserEntity, UserEntity, number ] =
                                [ mockUsers[4], mockUsers[4], 0 ];

            jest.spyOn(repository, 'findOne')
            .mockResolvedValueOnce({...mockUsers[4]})
            .mockResolvedValueOnce({...mockUsers[4]})
            .mockResolvedValueOnce({...mockUsers[3]});
            await service.add(gameId, false, "first");
            await service.add(gameId, false, "second");
            await service.add(gameId, false, "third");
            expect(
                service.getNextPlayers(gameId)
            ).toEqual(output);
        });
    });

    describe('getNextPlayers()', () => {
        it('should return players of nearest category', async () => {
            const   gameId: string = "Game1";
            const   output: [ UserEntity, UserEntity, number ] =
                                [ mockUsers[2], mockUsers[3], 0 ];

            jest.spyOn(repository, 'findOne')
            .mockResolvedValueOnce({...mockUsers[2]})
            .mockResolvedValueOnce({...mockUsers[0]})
            .mockResolvedValueOnce({...mockUsers[4]})
            .mockResolvedValueOnce({...mockUsers[3]})
            .mockResolvedValueOnce({...mockUsers[1]});
            await service.add(gameId, false, "first");
            await service.add(gameId, false, "second");
            await service.add(gameId, false, "third");
            await service.add(gameId, false, "fourth");
            await service.add(gameId, false, "fifth");
            expect(
                service.getNextPlayers(gameId)
            ).toEqual(output);
        });
    });

});
