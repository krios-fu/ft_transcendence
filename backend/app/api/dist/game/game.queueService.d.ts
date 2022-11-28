import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
export declare class GameQueueService {
    private readonly userService;
    private gameQueue;
    constructor(userService: UserService);
    getNextPlayers(gameId: string): [UserEntity, UserEntity];
    private findByUsername;
    add(gameId: string, username: string): Promise<void>;
    remove(gameId: string, username: string): void;
}
