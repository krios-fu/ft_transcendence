import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from './user.service';
import { User, UserStatus } from './user.entity'
import { UserDto } from './user.dto';

const inputUser : UserDto = {
    username: 'username_1',
    firstName: 'firstName_1',
    lastName: 'lastName 1',
    email: 'email 1',
    photo: 'photo_1'
}

const sampleUser : User = {
    username: 'username_1',
    firstName: 'firstName_1',
    lastName: 'lastName 1',
    email: 'email 1',
    photo: 'photo_1',
    nickName: 'username_1',
    status: UserStatus.ONLINE,
    creationDate: new Date(Date.now()),
    lastConnection: new Date(Date.now())
}

const sampleMultiUsers : User[] = [
    {
        username: 'username_1',
        firstName: 'firstName_1',
        lastName: 'lastName 1',
        email: 'email 1',
        photo: 'photo_1',
        nickName: 'username_1',
        status: UserStatus.ONLINE,
        creationDate: new Date(Date.now()),
        lastConnection: new Date(Date.now())
    },
    {
        username: 'username_2',
        firstName: 'firstName_2',
        lastName: 'lastName 2',
        email: 'email 2',
        photo: 'photo_2',
        nickName: 'username_2',
        status: UserStatus.ONLINE,
        creationDate: new Date(Date.now()),
        lastConnection: new Date(Date.now())
    }
]

describe('UserService', () => {
    let userService : UserService;
    let userRepo : Repository<User>

    beforeAll(async () => {
        const testModule : TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        find: jest.fn().mockResolvedValue(sampleMultiUsers),
                        findOne: jest.fn().mockResolvedValue(sampleUser),
                        save: jest.fn().mockResolvedValue(sampleUser),
                        delete: jest.fn(),
                        update: jest.fn().mockResolvedValue(new UpdateResult())
                    }
                }
            ]
        }).compile();

        userService = testModule.get<UserService>(UserService);
        userRepo = testModule.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('findAll', () => {
        test('returns array of users', async () => {
            expect(await userService.findAll()).toEqual(sampleMultiUsers);
            expect(userRepo.find).toBeCalledTimes(1);
        });
    });

    describe('findOne', () => {
        test('returns a single user', async () => {
            expect(await userService.findOne('username_1'))
                .toEqual(sampleUser);
            expect(userRepo.findOne).toBeCalledTimes(1);
            expect(userRepo.findOne).toBeCalledWith('username_1');
        });
    });

    describe('create', () => {
        test('receives a user and saves it', async () => {
            expect(await userService.create(inputUser)).toEqual(sampleUser);
            expect(userRepo.save).toBeCalledTimes(1);
            expect(userRepo.save)
                .toBeCalledWith({ ...inputUser, nickName: 'username_1' });
        });
    });

    describe('remove', () => {
        test('deletes a single user', async () => {
            expect(await userService.remove('username_1')).toBeUndefined();
            expect(userRepo.delete).toBeCalledTimes(1);
            expect(userRepo.delete).toBeCalledWith('username_1');
        });
    });

    describe('changeNick', () => {
        test('changes a user nickName', async () => {
            expect(await userService.changeNick('username_1',
                                                'nickname_1')).toBeDefined();
            expect(userRepo.update).toBeCalledTimes(1);
            expect(userRepo.update).toBeCalledWith('username_1',
                                                    { nickName: 'nickname_1' });
        });
    });
})