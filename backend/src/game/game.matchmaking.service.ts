import { Injectable } from "@nestjs/common";
import { GameType } from "./elements/Game";
import { GameManagementService } from "./game.management.service";
import {
    GameQueueService,
    NextPlayerPair
} from "./game.queueService";
import { SocketHelper } from "./game.socket.helper";

@Injectable()
export class    GameMatchmakingService {

    private _pairingTimeouts: Map<string, NodeJS.Timeout>;

    constructor(
        private readonly queueService: GameQueueService,
        private readonly socketHelper: SocketHelper,
        private readonly gameManagementService: GameManagementService
    ) {
        this._pairingTimeouts = new Map<string, NodeJS.Timeout>;
    }

    private _emitQueueUpdate(roomId: string, gameType: GameType,
                                length: number): void {
        this.socketHelper.emitToRoom(
            roomId,
            gameType === "classic" ? "queueClassicLength" : "queueHeroLength",
            length
        );
    }

    emitAllQueuesLength(gameId: string, emitTo: string): void {
        const   [classicLength, heroLength]: [number, number] =
                                this.queueService.getAllQueuesLength(gameId);
    
        this._emitQueueUpdate(
            emitTo,
            "classic",
            classicLength
        );
        this._emitQueueUpdate(
            emitTo,
            "hero",
            heroLength
        );
    }

    async addToQueue(gameId: string, gameType: GameType,
                        username: string): Promise<void> {
        const   lengthUpdate: number | undefined = await this.queueService.add(
            gameId,
            gameType,
            username
        );

        if (lengthUpdate === undefined)
            return ;
        this._emitQueueUpdate(
            gameId,
            gameType,
            lengthUpdate
        );
        if (lengthUpdate > 1
                && this.gameManagementService.canStart(gameId))
            this.attemptPlayerPairing(gameId);

    }

    removeFromQueue(gameId: string, gameType: GameType,
                        username: string): void {
        let lengthUpdate: number | undefined;

        lengthUpdate = this.queueService.removeFromQueue(
            gameId,
            gameType,
            username
        );
        if (lengthUpdate === undefined)
            return ;
        this._emitQueueUpdate(
            gameId,
            gameType,
            lengthUpdate
        );
    }

    removeFromAllQueues(username: string): void {
        const   gameId: string = this.queueService.findUser(username);
        let     lengthUpdate: [number, GameType] | undefined;
    
        if (!gameId)
            return ;
        lengthUpdate = this.queueService.removeAll(gameId, username);
        if (lengthUpdate) {
            this._emitQueueUpdate(
                gameId,
                lengthUpdate[1],
                lengthUpdate[0]
            );
            return ;
        }
        this.updateNextPlayerInvite(username, gameId, false);
    }

    private _setPairingTimeout(gameId: string): void {
        let pairingTimeout: NodeJS.Timeout;
    
        pairingTimeout = this._pairingTimeouts.get(gameId);
        if (pairingTimeout)
            clearTimeout(pairingTimeout);
        pairingTimeout = setTimeout(() => {
            this.queueService.removeInvalidNextPlayers(gameId);
            clearTimeout(this._pairingTimeouts.get(gameId));
            this._pairingTimeouts.delete(gameId);
            this.attemptPlayerPairing(gameId);
        },
        10 * 1000);
        this._pairingTimeouts.set(gameId, pairingTimeout);
    }

    attemptPlayerPairing(gameId: string): void {
        let nextPlayers: Readonly<NextPlayerPair> | undefined =
                    this.queueService.getNextPlayers(gameId);
        
        if (nextPlayers
                && nextPlayers[0]
                && nextPlayers[1])
            return ;
        nextPlayers = this.queueService.selectNextPlayers(gameId);
        if (!nextPlayers)
        {
            this.emitAllQueuesLength(gameId, gameId); 
            return ;
        }
        this._setPairingTimeout(gameId);
        //EMIT NEXT PLAYER NOTIFICATIONS
    }

    private _removePairingTimeout(gameId: string): void {
        const   pairingTimeout: NodeJS.Timeout =
                            this._pairingTimeouts.get(gameId);
    
        if (!pairingTimeout)
            return ;
        clearTimeout(pairingTimeout);
        this._pairingTimeouts.delete(gameId);
    }

    private _initGame(gameId: string, nextPlayers: NextPlayerPair): void {
        this.gameManagementService.start(
            gameId,
            {
                a: nextPlayers[0].queueElement.user,
                b: nextPlayers[1].queueElement.user
            },
            nextPlayers[0].gameType
        );
    }

    private _confirmNextPlayers(gameId: string): boolean {
        const   confirmResult: [number, GameType] | undefined =
                            this.queueService.confirmNextPlayers(gameId);
    
        if (!confirmResult)
            return (false);
        this._removePairingTimeout(gameId);
        this._emitQueueUpdate(
            gameId,
            confirmResult[1],
            confirmResult[0]
        );
        return (true);
    }

    /*
    **  accept === false implies decline, because the user has taken a decision.
    **
    **  Only attempt another selection if both players have taken a decision,
    **  and at least one of them declined. If one of them declined, but the
    **  the other has not taken a decision yet, wait until the other's
    **  decision or until pairing timeout.
    */
    updateNextPlayerInvite(username: string, gameId: string,
                            accept: boolean): void {
        const   nextPlayers: NextPlayerPair | undefined =
                            this.queueService.updateNextPlayerInvite(
                                                    username,
                                                    gameId,
                                                    accept);
    
        if (!nextPlayers
                || !nextPlayers[0]
                || !nextPlayers[1])
            return ;
        if ((nextPlayers[0].declined
                    && (nextPlayers[1].accepted || nextPlayers[1].declined))
                || (nextPlayers[1].declined
                    && (nextPlayers[0].accepted || nextPlayers[0].declined)))
        {
            this.queueService.removeInvalidNextPlayers(gameId);
            this.attemptPlayerPairing(gameId);
        }
        else if ((nextPlayers[0].accepted && nextPlayers[0].inRoom)
                    && (nextPlayers[1].accepted && nextPlayers[1].inRoom))
        {
            if (!this._confirmNextPlayers(gameId))
                this.attemptPlayerPairing(gameId);
            else
                this._initGame(gameId, nextPlayers);
        }
    }

    // Called when a player joins or leaves a game room.
    updateNextPlayerRoom(username: string, gameId: string,
                            join: boolean): void {
        const   nextPlayers: NextPlayerPair | undefined =
                            this.queueService.updateNextPlayerRoom(
                                                username,
                                                gameId,
                                                join);

        if (!nextPlayers
                || !nextPlayers[0]
                || !nextPlayers[1])
            return ;
        if ((nextPlayers[0].accepted && nextPlayers[0].inRoom)
                && (nextPlayers[1].accepted && nextPlayers[1].inRoom))
        {
            if (!this._confirmNextPlayers(gameId))
                this.attemptPlayerPairing(gameId);
            else
                this._initGame(gameId, nextPlayers);
        }
    }

}
