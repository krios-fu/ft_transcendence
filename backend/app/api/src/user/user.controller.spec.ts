import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserStatus } from './user.entity'
import { UserDto } from './user.dto';

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

const sampleUserDto : UserDto = {
	username: 'username_1',
	firstName: 'firstName_1',
	lastName: 'lastName 1',
	email: 'email 1',
	photo: 'photo_1'
}

describe('UserController', () => {
	let userController : UserController;
	let userService : UserService;

	beforeAll(async () => {
		const testModule : TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				UserService,
				{
					provide: UserService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(sampleMultiUsers),
						findOne: jest.fn().mockResolvedValue(sampleMultiUsers[1]),
						/*create: jest.fn().mockImplementation((user : UserDto) => Promise.
							resolve(sampleMultiUsers[0])),*/
						create: jest.fn().mockResolvedValue(sampleMultiUsers[0]),
						remove: jest.fn()
					}
				}
			]
		}).compile();

		userController = testModule.get<UserController>(UserController);
		userService = testModule.get<UserService>(UserService);
	});

	describe('all', () => {
		test('Returns array of users', () => {
			expect(userController.all()).resolves.toEqual(sampleMultiUsers);
			expect(userService.findAll).toBeCalledTimes(1);
		});
	});

	describe('one', () => {
		test('Returns one user', () => {
			expect(userController.one('username_2'))
				.resolves.toEqual(sampleMultiUsers[1]);
			expect(userService.findOne).toBeCalledTimes(1);
			expect(userService.findOne).toBeCalledWith('username_2');
		});
	});

	describe('create', () => {
		test('Receives a UserDto and saves a User', () => {
			expect(userController.create(sampleUserDto))
				.resolves.toEqual(sampleMultiUsers[0]);
			expect(userService.create).toBeCalledTimes(1);
			expect(userService.create).toBeCalledWith(sampleUserDto);
		});
	});

	describe('remove', () => {
		test('Deletes a single User', () => {
			expect(userController.remove('username_1')).resolves.toBeUndefined();
			expect(userService.remove).toBeCalledTimes(1);
			expect(userService.remove).toBeCalledWith('username_1');
		});
	});

});
