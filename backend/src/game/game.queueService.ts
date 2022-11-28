import { Injectable } from "@nestjs/common";
import {
    Category,
    UserEntity
} from "../user/entities/user.entity";
import { UserService } from "../user/services/user.service";

@Injectable()
export class    GameQueueService {
    private gameQueue: Map<string, UserEntity[]>;

    constructor(
        private readonly userService: UserService,
    ) {
        this.gameQueue = new Map<string, UserEntity[]>;
    }

    getNextPlayers(gameId: string): [UserEntity, UserEntity] {
        let queue: UserEntity[] = this.gameQueue.get(gameId);
        let playerA: UserEntity = undefined;
        let playerB: UserEntity = undefined;
        let maxCategoryDiff: number = 0;
        let categoryDiff: number;

        if (!queue
            || queue.length < 2)
            return ([playerA, playerB]);
        playerA = queue[0];
        while (playerB === undefined)
        {
            for (let i: number = 1; i < queue.length; ++i)
            {
                categoryDiff = Math.abs(
                    playerA.category - queue[i].category
                );
                if (categoryDiff <= maxCategoryDiff
                    || queue[i].category === Category.Pending)
                {
                    playerB = queue[i];
                    break ;
                }
            }
            ++maxCategoryDiff;
        }
        return ([playerA, playerB]);
    }

    private findByUsername(username: string, queue: UserEntity[]): number {
        return (queue.findIndex((elem) => elem.username === username));
    }

    async add(gameId: string, username: string): Promise<void> {
        let targetIndex: number;
        let userEntity: UserEntity = await this.userService.findOneByUsername(username);
        let queue: UserEntity[] = this.gameQueue.get(gameId);
    
        if (!queue)
            queue = this.gameQueue.set(gameId, []).get(gameId);
        targetIndex = this.findByUsername(username, queue);
        if (targetIndex === -1
            && userEntity)
            queue.push(userEntity);
    }

    remove(gameId: string, username: string): void {
        let targetIndex: number;
        let queue: UserEntity[] = this.gameQueue.get(gameId);

        if (!queue || username === "")
            return ;
        targetIndex = this.findByUsername(username, queue);
        if (targetIndex !== -1)
            queue.splice(targetIndex, 1);
    }

}
