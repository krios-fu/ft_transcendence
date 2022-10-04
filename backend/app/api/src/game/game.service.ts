import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

/*
**  Provisional
*/
enum    Level {
    Bronze,
    Silver,
    Gold
}

export class    GameService {
    gameQueue: Map<string, UserEntity[]>;
    gamePlayers: Map<string, [UserEntity, UserEntity]>;

    constructor(
        private userService: UserService
    ) {}

    private getPlayerLevel(player: UserEntity): Level {
        //Provisional
        return (Level.Bronze);
    }

    private getNextPlayers(gameId: string): [UserEntity, UserEntity] {
        let queue: UserEntity[] = this.gameQueue.get(gameId);
        let playerA: UserEntity = undefined;
        let playerB: UserEntity = undefined;
        let maxLevelDiff: number = 0;
        let levelDiff: number;

        if (queue.length < 2)
            return ([playerA, playerB]);
        playerA = queue[0];
        while (playerB === undefined)
        {
            for (let i: number = 1; i < queue.length; ++i)
            {
                levelDiff = Math.abs(
                    this.getPlayerLevel(playerA)
                    - this.getPlayerLevel(queue[i])
                );
                if (levelDiff <= maxLevelDiff)
                    playerB = queue[i];
            }
            ++maxLevelDiff;
        }
        return ([playerA, playerB]);
    }

    startGame(gameId: string): [UserEntity, UserEntity] {
        let nextPlayers: [UserEntity, UserEntity] = this.getNextPlayers(gameId);
        let currentPlayers: [UserEntity, UserEntity];
    
        if (nextPlayers[0] === undefined)
            return (nextPlayers);
        currentPlayers = this.gamePlayers.get(gameId);
        currentPlayers = nextPlayers;
        this.removeFromQueue(gameId, nextPlayers[0].username);
        this.removeFromQueue(gameId, nextPlayers[1].username);
        return (nextPlayers);
    }

    private updatePlayerScore(user: UserEntity): void {
        //Pending ...
    }

    endGame(gameId: string): void {
        let players: [UserEntity, UserEntity] = this.gamePlayers.get(gameId);

        this.updatePlayerScore(players[0]);
        this.updatePlayerScore(players[1]);
        players[0] = undefined;
        players[1] = undefined;
    }

    private findByUsername(username: string, queue: UserEntity[]): number {
        return (queue.findIndex((elem) => {
            elem.username === username
        }));
    }

    async addToQueue(gameId: string, username: string): Promise<void> {
        let queue: UserEntity[] = this.gameQueue.get(gameId);
        let targetIndex: number = this.findByUsername(username, queue);
        let userEntity: UserEntity = await this.userService.findOne(username);

        if (targetIndex === -1
            && userEntity)
            queue.push(userEntity);
    }

    removeFromQueue(gameId: string, username: string): void {
        let queue: UserEntity[] = this.gameQueue.get(gameId);
        let targetIndex: number = this.findByUsername(username, queue);

        if (targetIndex !== -1)
            queue.splice(targetIndex, 1);
    }
}
