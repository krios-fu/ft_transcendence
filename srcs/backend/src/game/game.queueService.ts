import { Injectable } from "@nestjs/common";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/services/user.service";
import { GameType } from "./elements/Game";
import { Category } from "../user/enum/category.enum";
import { sortedIndexBy } from "lodash";
import { UserQueueUpdate } from "./game.matchmaking.service";

export interface   IQueueElement
{
    user: UserEntity;
    insertTime: number;
}

export interface   INextPlayer
{
    queueElement: IQueueElement;
    gameType: GameType;
    inRoom: boolean;
    accepted: boolean;
    declined: boolean;
}

export type NextPlayerPair = [
                INextPlayer | undefined,
                INextPlayer | undefined
];

type    AllQueues = [
            IQueueElement[] | undefined,
            IQueueElement[] | undefined
];

interface   GameQueues {
    classicQueue: IQueueElement[];
    heroQueue: IQueueElement[];
    nextPlayers: NextPlayerPair;
}

type    NextPlayerQueueType = [
            INextPlayer | undefined,
            IQueueElement[],
            GameType
];

type    PlayerQueueType = [
            IQueueElement | undefined,
            IQueueElement[],
            GameType
];

@Injectable()
export class    GameQueueService {
    private _gameQueues: Map<string, GameQueues>;

    constructor(
        private readonly userService: UserService
    ) {
        this._gameQueues = new Map<string, GameQueues>;
    }

    private _getNextQueue(gameId: string): [IQueueElement[], GameType] {
        const   queues: AllQueues = this._getAllQueues(gameId);
        let     queue: IQueueElement[] = queues[0] || [];
        let     queueHero: IQueueElement[] = queues[1] || [];
    
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

    private _getQueue(gameId: string,
                        gameType: GameType): IQueueElement[] | undefined {
        const   queues: GameQueues | undefined = this._gameQueues.get(gameId);
    
        if (!queues)
            return (undefined);
        return (
            gameType === "classic"
                ? queues.classicQueue
                : queues.heroQueue
        );
    }

    private _getAllQueues(gameId: string): AllQueues {
        const   queues: GameQueues | undefined = this._gameQueues.get(gameId);
    
        if (!queues)
            return ([undefined, undefined]);
        return ([
            queues.classicQueue,
            queues.heroQueue
        ])
    }

    private _setQueues(gameId: string): void {
        if (this._gameQueues.get(gameId))
            return ;
        this._gameQueues.set(gameId, {
            classicQueue: [],
            heroQueue: [],
            nextPlayers: [undefined, undefined]
        });
    }

    private _setNextPlayers(gameId: string, pair: NextPlayerPair): void {
        const   queues: GameQueues = this._gameQueues.get(gameId);

        if (!queues)
            return ;
        queues.nextPlayers = pair;
    }

    private _pruneGameQueues(gameId: string): void {
        const   gameQueues = this._gameQueues.get(gameId);
    
        if (!gameQueues.classicQueue.length
                && !gameQueues.heroQueue.length
                && !gameQueues.nextPlayers[0]
                && !gameQueues.nextPlayers[1])
            this._gameQueues.delete(gameId);
    }

    getAllQueuesLength(gameId: string): [number, number] {
        const   [queue, queueHero]: AllQueues = this._getAllQueues(gameId);
    
        return ([
            queue ? queue.length : 0,
            queueHero ? queueHero.length : 0
        ]);
    }

    private _generateNextPlayer(player: IQueueElement,
                                    gameType: GameType): INextPlayer {
        return ({
            queueElement: player,
            gameType: gameType,
            inRoom: false,
            accepted: false,
            declined: false
        });
    }

    private _selectPlayerB(playerA: UserEntity,
                            queue: IQueueElement[]): IQueueElement {
        let playerB: IQueueElement | undefined = undefined;
        let maxCategoryDiff: number = 0;
        let categoryDiff: number;
        let i: number;
    
        while (playerB === undefined)
        {
            for (i = 0; i < queue.length; ++i)
            {
                categoryDiff = Math.abs(
                    playerA.category - queue[i].user.category
                );
                if (categoryDiff <= maxCategoryDiff
                    || queue[i].user.category === Category.Pending)
                {
                    playerB = queue[i];
                    break ;
                }
            }
            ++maxCategoryDiff;
        }
        queue.splice(i, 1);
        return (playerB);
    }

    private _selectPlayerA(gameId: string): PlayerQueueType {
        const   [queue, type]: [IQueueElement[], GameType] =
                            this._getNextQueue(gameId);
        
        if (!queue.length)
            return ([undefined, [], "classic"]);
        return ([
            queue.shift(),
            queue,
            type
        ]);
    }

    /*
    **  Sets existing valid nextPlayer as playerA if there are other users
    **  in the queue. Otherwise, it gets reinserted into the queue.
    **
    **  There should only be one nextPlayer or any,
    **  because removeInvalidNextPlayers should have been called previously.
    */
    private _existingNextPlayer(gameId: string): NextPlayerQueueType {
        const   players: NextPlayerPair | undefined =
                        this.getNextPlayers(gameId);
        let     queue: IQueueElement[];
    
        if (!players)
            return ([undefined, [], "classic"]);
        for (const player of players)
        {
            if (!player)
                continue ;
            queue = this._getQueue(gameId, player.gameType);
            if (!queue.length)
            {
                this._reInsertToQueue(queue, player.queueElement);
                this._setNextPlayers(
                    gameId,
                    [undefined, undefined]
                );
                break ;
            }
            return ([player, queue, player.gameType]);
        }
        return ([undefined, [], "classic"]);
    }

    // Places 2 prospect players in the NextPlayers map
    selectNextPlayers(gameId: string): Readonly<NextPlayerPair> {
        let nextPlayerA: INextPlayer = undefined;
        let playerA: IQueueElement = undefined;
        let playerB: IQueueElement = undefined;
        let nextPlayers: NextPlayerPair;
        let queue: IQueueElement[];
        let gameType: GameType;

        [nextPlayerA, queue, gameType] = this._existingNextPlayer(gameId);
        if (!nextPlayerA)
            [playerA, queue, gameType] = this._selectPlayerA(gameId);
        if (!nextPlayerA
                && !playerA)
            return ([undefined, undefined]);
        playerB = this._selectPlayerB(
            nextPlayerA ? nextPlayerA.queueElement.user : playerA.user,
            queue
        );
        nextPlayers = [
            nextPlayerA ? nextPlayerA
                        : this._generateNextPlayer(playerA, gameType),
            this._generateNextPlayer(playerB, gameType)
        ];
        this._setNextPlayers(gameId, nextPlayers);
        return (nextPlayers);
    }

    // Returns the current NextPlayers, which are not confirmed
    getNextPlayers(gameId: string): NextPlayerPair | undefined {
        const   queues: GameQueues = this._gameQueues.get(gameId);
    
        if (!queues)
            return (undefined);
        return (queues.nextPlayers);
    }

    updateNextPlayerInvite(username: string, gameId: string,
                            accept: boolean): NextPlayerPair | undefined {
        const   nextPlayers: NextPlayerPair | undefined =
                            this.getNextPlayers(gameId);
        let     target: INextPlayer | undefined = undefined;
    
        if (!nextPlayers
                || !nextPlayers[0]
                || !nextPlayers[1])
            return (undefined);
        for (const nextPlayer of nextPlayers)
        {
            if (!nextPlayer
                    || nextPlayer.queueElement.user.username != username)
                continue ;
            if (!nextPlayer.accepted && !nextPlayer.declined)
                target = nextPlayer;
            break ;
        }
        if (!target)
            return (undefined);
        if (!accept)
            target.declined = true;
        else
            target.accepted = true;
        return (nextPlayers);
    }

    updateNextPlayerRoom(username: string, gameId: string,
                           join: boolean): NextPlayerPair | undefined {
        const   nextPlayers: NextPlayerPair | undefined =
                            this.getNextPlayers(gameId);
        let     target: INextPlayer | undefined = undefined;
    
        if (!nextPlayers)
            return (undefined);
        for (const nextPlayer of nextPlayers)
        {
            if (!nextPlayer
                    || nextPlayer.queueElement.user.username != username)
                continue ;
            target = nextPlayer;
            break ;
        }
        if (!target)
            return (undefined);
        target.inRoom = join;
        return (nextPlayers);
    }

    // Called when the caller is sure there are 2 valid INextPlayers
    confirmNextPlayers(gameId: string): [number, GameType] | undefined {
        const   gameQueues = this._gameQueues.get(gameId);
        let     gameType: GameType;
        let     targetQueue: IQueueElement[];
        let     lengthUpdate: number;
    
        if (!gameQueues
                || !gameQueues.nextPlayers[0]
                || !gameQueues.nextPlayers[1])
            return (undefined);
        gameType = gameQueues.nextPlayers[0].gameType;
        targetQueue = gameType === "hero"
                        ? gameQueues.heroQueue
                        : gameQueues.classicQueue;
        lengthUpdate = targetQueue.length;
        gameQueues.nextPlayers = [undefined, undefined];
        this._pruneGameQueues(gameId);
        return ([
            lengthUpdate,
            gameType
        ]);
    }

    removeInvalidNextPlayers(gameId: string): [string, string] {
        const   gameQueues: GameQueues = this._gameQueues.get(gameId);
        let nextPlayers: NextPlayerPair = gameQueues.nextPlayers;
        let removedUsernames: [string, string];
        let i: number;
    
        i = 0;
        removedUsernames = ["", ""];
        for (const nextPlayer of nextPlayers)
        {
            if (!nextPlayer.accepted
                    || (!nextPlayer.inRoom))
            {
                removedUsernames[i] = nextPlayer.queueElement.user.username;
                gameQueues.nextPlayers[i] = undefined;
            }
            ++i;
        }
        this._pruneGameQueues(gameId);
        return (removedUsernames);
    }

    private _findByUsername(username: string, queue: IQueueElement[]): number {
        return (queue.findIndex((elem) => elem.user.username === username));
    }

    private _setUserQueueUpdate(queued: boolean, roomId?: string,
                                    type?: GameType): UserQueueUpdate {
        return ({
            queued: queued,
            roomId: roomId,
            type: type
        });
    }

    /*
    **  Find user in any game queue.
    **
    **  Returns whether the user is queued, and the roomId and type
    **  of queue if it is.
    **
    **  If the user has been selected as a nextPlayer, the type of queue
    **  is not sent to the client to prevent unqueue requests at that
    **  point, because a match invite has already been sent that can be
    **  refused, which will unqueue the client as well.
    */
    async findUser(username: string): Promise<UserQueueUpdate> {
        let gameId: string;
        let queuesPartition: number = 0;
    
        for (const queues of this._gameQueues)
        {
            ++queuesPartition;
            gameId = queues[0];
            if (this._findByUsername(username, queues[1].classicQueue) != -1)
                return (this._setUserQueueUpdate(true, gameId, "classic"));
            if (this._findByUsername(username, queues[1].heroQueue) != -1)
                return (this._setUserQueueUpdate(true, gameId, "hero"));
            for (const nextPlayer of queues[1].nextPlayers)
            {
                if (!nextPlayer)
                    continue ;
                if (nextPlayer.queueElement.user.username === username)
                    return (this._setUserQueueUpdate(true, gameId));
            }
            if (queuesPartition === 30)
            {
                await new Promise((resolve) => {
                    setImmediate(resolve);
                });
                queuesPartition = 0;
            }
        }
        return (this._setUserQueueUpdate(false));
    }

    async add(gameId: string, gameType: GameType,
                    username: string): Promise<number | undefined> {
        const   userEntity: UserEntity =
                            await this.userService.findOneByUsername(username);
        let     queue: IQueueElement[] = this._getQueue(gameId, gameType);
    
        if (!userEntity)
            return (undefined);
        if (!queue)
        {
            this._setQueues(gameId);
            queue = this._getQueue(gameId, gameType);
        }
        if (!(await this.findUser(username)).queued)
        {
            queue.push({
                user: userEntity,
                insertTime: Date.now()
            });
            return (queue.length);
        }
        return (undefined);
    }

    deleteGameQueues(gameId: string): void {
        this._gameQueues.delete(gameId);
    }

    private _reInsertToQueue(queue: IQueueElement[],
                                player: IQueueElement): void {
        const   insertIndex: number = sortedIndexBy(queue, {
            insertTime: player.insertTime
        } as IQueueElement, (elem) => {
            return (elem);
        });

        queue.splice(insertIndex, 0, player);
    }

    private _removeFromQueue(queue: IQueueElement[],
                                username: string): boolean {
        let targetIndex: number;
    
        if (queue)
        {
            targetIndex = this._findByUsername(username, queue);
            if (targetIndex !== -1)
            {
                queue.splice(targetIndex, 1);
                return (true);
            }
        }
        return (false);
    }

    removeFromQueue(gameId: string, gameType: GameType,
                        username: string): number | undefined {
        const   queues: GameQueues = this._gameQueues.get(gameId);
        let     queue: IQueueElement[];
        let     queueLength: number;

        if (!queues
                || username === "")
            return (undefined);
        queue = gameType === "hero"
                    ? queues.heroQueue
                    : queues.classicQueue;
        if (!this._removeFromQueue(queue, username))
            return (undefined);
        queueLength = queue.length;
        this._pruneGameQueues(gameId);
        return (queueLength);
    }

    // User can only join 1 queue at a time
    removeAll(gameId: string,
                username: string): [number, GameType] | undefined {
        let lengthUpdate: number | undefined;
    
        if (username === "")
            return (undefined);
        lengthUpdate = this.removeFromQueue(gameId, "classic", username);
        if (lengthUpdate != undefined)
            return ([lengthUpdate, "classic"]);
        lengthUpdate = this.removeFromQueue(gameId, "hero", username);
        if (lengthUpdate != undefined)
            return ([lengthUpdate, "hero"]);
        return (undefined);
    }

}
