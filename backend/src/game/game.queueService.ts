import { Injectable } from "@nestjs/common";
<<<<<<< HEAD
import { Category } from "../user/enums/user.enum";
=======
>>>>>>> main
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/services/user.service";
import { GameType } from "./elements/Game";
import { SocketHelper } from "./game.socket.helper";
import { Category } from "../user/enum/category.enum";

interface   IQueueElement
{
    user: UserEntity;
    insertTime: number;
}

@Injectable()
export class    GameQueueService {
    private gameQueue: Map<string, IQueueElement[]>;
    private gameHeroQueue: Map<string, IQueueElement[]>

    constructor(
        private readonly userService: UserService,
        private readonly socketHelper: SocketHelper
    ) {
        this.gameQueue = new Map<string, IQueueElement[]>;
        this.gameHeroQueue = new Map<string, IQueueElement[]>;
    }

    private getNextQueue(gameId): [IQueueElement[], GameType] {
        let queue: IQueueElement[] = this.gameQueue.get(gameId) || [];
        let queueHero: IQueueElement[] = this.gameHeroQueue.get(gameId) || [];
    
        if (queue.length < 2 && queueHero.length < 2)
            return ([[], undefined]);
        if (queue.length < 2 && queueHero.length > 1)
            return ([queueHero, "hero"]);
        if (queueHero.length < 2 && queue.length > 1)
            return ([queue, "classic"]);
        if (queue[0].insertTime < queueHero[0].insertTime)
            return ([queue, "classic"]);
        return ([queueHero, "hero"]);
    }

    private _emitUpdate(room: string, gameType: GameType,
                            length: number): void {
        this.socketHelper.emitToRoom(
            room,
            gameType === "classic" ? "queueClassicLength" : "queueHeroLength",
            length
        );
    }

    clientInitQueuesLength(gameId: string, client: string): void {
        const   queue: IQueueElement[] = this.gameQueue.get(gameId);
        const   queueHero: IQueueElement[] = this.gameHeroQueue.get(gameId);    
    
        this._emitUpdate(
            client,
            "classic",
            queue ? queue.length : 0
        );
        this._emitUpdate(
            client,
            "hero",
            queueHero ? queueHero.length : 0
        );
    }

    getNextPlayers(gameId: string): [UserEntity, UserEntity, GameType] {
        let [queue, type]: [IQueueElement[], GameType] =
                                                this.getNextQueue(gameId);
        let playerA: UserEntity = undefined;
        let playerB: UserEntity = undefined;
        let maxCategoryDiff: number = 0;
        let categoryDiff: number;

        if (!queue.length)
            return ([playerA, playerB, type]);
        playerA = queue[0].user;
        while (playerB === undefined)
        {
            for (let i: number = 1; i < queue.length; ++i)
            {
                categoryDiff = Math.abs(
                    playerA.category - queue[i].user.category
                );
                if (categoryDiff <= maxCategoryDiff
                    || queue[i].user.category === Category.Pending)
                {
                    playerB = queue[i].user;
                    break ;
                }
            }
            ++maxCategoryDiff;
        }
        this.removeFromQueue(queue, playerA.username);
        this.removeFromQueue(queue, playerB.username);
        this._emitUpdate(
            gameId,
            type,
            queue.length
        )
        return ([playerA, playerB, type]);
    }

    private findByUsername(username: string, queue: IQueueElement[]): number {
        return (queue.findIndex((elem) => elem.user.username === username));
    }

    async add(gameId: string, hero: boolean,
                    username: string): Promise<void> {
        let     targetIndex: number;
        const   userEntity: UserEntity =
                                    await this.userService.findOneByUsername(username);
        let     queue: IQueueElement[] = hero
                                    ? this.gameHeroQueue.get(gameId)
                                    : this.gameQueue.get(gameId);
    
        if (!queue)
        {
            if (hero)
                queue = this.gameHeroQueue.set(gameId, []).get(gameId);
            else
                queue = this.gameQueue.set(gameId, []).get(gameId);
        }
        targetIndex = this.findByUsername(username, queue);
        if (targetIndex === -1
            && userEntity)
        {
            queue.push({
                user: userEntity,
                insertTime: Date.now()
            });
        }
        this._emitUpdate(
            gameId,
            hero ? "hero" : "classic",
            queue.length
        );
    }

    private removeFromQueue(queue: IQueueElement[], username: string): void {
        let targetIndex: number;
    
        if (queue)
        {
            targetIndex = this.findByUsername(username, queue);
            if (targetIndex !== -1)
                queue.splice(targetIndex, 1);
        }
    }

    removeClassic(gameId, username: string): void {
        let queue: IQueueElement[] = this.gameQueue.get(gameId);

        if (username === "")
            return ;
        this.removeFromQueue(queue, username);
        this._emitUpdate(
            gameId,
            "classic",
            queue ? queue.length : 0
        );
    }

    removeHero(gameId, username: string): void {
        let queueHero: IQueueElement[] = this.gameHeroQueue.get(gameId);

        if (username === "")
            return ;
        this.removeFromQueue(queueHero, username);
        this._emitUpdate(
            gameId,
            "hero",
            queueHero ? queueHero.length : 0
        );
    }

    removeAll(gameId: string, username: string): void {        
        if (username === "")
            return ;
        this.removeClassic(gameId, username);
        this.removeHero(gameId, username);
    }

}
