import { Injectable } from "@nestjs/common";
import { GameType } from "./elements/Game";
import {
    GameQueueService,
    NextPlayerPair
} from "./game.queueService";
import { SocketHelper } from "./game.socket.helper";
import {
    EventEmitter2,
    OnEvent
} from '@nestjs/event-emitter';
import { GameDataService } from "./game.data.service";

export interface    UserQueueUpdate {
    queued: boolean,
    roomId?: string;
    type?: GameType;
}

@Injectable()
export class    GameMatchmakingService {

    private _pairingTimeouts: Map<string, NodeJS.Timeout>;

    constructor(
        private readonly queueService: GameQueueService,
        private readonly socketHelper: SocketHelper,
        private readonly gameDataService: GameDataService,
        private eventEmitter: EventEmitter2
    ) {
        this._pairingTimeouts = new Map<string, NodeJS.Timeout>;
    }

    @OnEvent('game.ended')
    async handleGameEndedEvent(gameId: string) {
        await this.attemptPlayerPairing(gameId);
    }

    private _emitQueueUpdate(roomId: string, gameType: GameType,
                                length: number): void {
        this.socketHelper.emitToRoom(
            roomId,
            gameType === "classic" ? "queueClassicLength" : "queueHeroLength",
            length
        );
    }

    private _emitUserQueueUpdate(username: string,
                                    data: UserQueueUpdate): void {
        this.socketHelper.emitToRoom(
            SocketHelper.getUserRoomName(username),
            "userQueue",
            data
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

    isNextPlayer(username: string, roomId: string): boolean {
        const   nextPlayers: NextPlayerPair | undefined =
                            this.queueService.getNextPlayers(roomId);
    
        if (!nextPlayers
                || !nextPlayers[0]
                || !nextPlayers[1])
            return (false);
        for (const nxtPlayer of nextPlayers)
        {
            if (nxtPlayer.queueElement.user.username === username)
                return (true);
        }
        return (false);
    }

    private _canAttemptPairing(gameId: string): boolean {
        const   nextPlayers: NextPlayerPair =
                            this.queueService.getNextPlayers(gameId);
    
        return (
            !nextPlayers
                || (!nextPlayers[0]
                    && !nextPlayers[1])
        );
    }

    private _canStartGame(gameId: string): boolean {
        return (
            !this.gameDataService.getGameData(gameId)
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
        this._emitUserQueueUpdate(username, {
            queued: true,
            roomId: gameId,
            type: gameType
        });
        if (lengthUpdate > 1
                && this._canAttemptPairing(gameId)
                && this._canStartGame(gameId))
            await this.attemptPlayerPairing(gameId);
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
        this._emitUserQueueUpdate(username, { queued: false });
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

    private async _initInRoom(gameId: string,
                                nextPlayers: Readonly<NextPlayerPair>)
                                            : Promise<void> {
        let inRoom: boolean;
        let username: string;
    
        for (const player of nextPlayers)
        {
            username = player.queueElement.user.username
            inRoom = await this.socketHelper.checkUserInRoom(
                username,
                gameId
            );
            if (inRoom)
                await this.updateNextPlayerRoom(username, gameId, inRoom);
        }
    }

    private _sendInvites(gameId: string,
                            nextPlayers: Readonly<NextPlayerPair>): void {
        for (const nextPlayer of nextPlayers)
        {
            if (nextPlayer.accepted)
                continue ;
            this.socketHelper.emitToRoom(
                SocketHelper.getUserRoomName(
                    nextPlayer.queueElement.user.username
                ),
                "matchInvite",
                gameId
            );
        }
    }

    private _removeInvalidNextPlayers(gameId: string): void {
        const   removedUsernames: [string, string] =
                                this.queueService.removeInvalidNextPlayers(
                                                        gameId);
    
        for (const username of removedUsernames)
        {
            if (username)
            {
                this.socketHelper.emitToRoom(
                    SocketHelper.getUserRoomName(username),
                    "unqueue"
                );
            }
        }
    }

    private _setPairingTimeout(gameId: string): void {
        let pairingTimeout: NodeJS.Timeout;
    
        pairingTimeout = this._pairingTimeouts.get(gameId);
        if (pairingTimeout)
            clearTimeout(pairingTimeout);
        pairingTimeout = setTimeout(async () => {
            this._removeInvalidNextPlayers(gameId);
            this._removePairingTimeout(gameId);
            await this.attemptPlayerPairing(gameId);
        },
        15 * 1000);
        this._pairingTimeouts.set(gameId, pairingTimeout);
    }

    async attemptPlayerPairing(gameId: string): Promise<void> {
        let nextPlayers: Readonly<NextPlayerPair> | undefined =
                    this.queueService.getNextPlayers(gameId);
    
        if (nextPlayers
                && nextPlayers[0]
                && nextPlayers[1])
            return ;
        nextPlayers = this.queueService.selectNextPlayers(gameId);
        if (!nextPlayers
                || !nextPlayers[0]
                || !nextPlayers[1])
        {
            this.emitAllQueuesLength(gameId, gameId); 
            return ;
        }
        this._setPairingTimeout(gameId);
        this._sendInvites(gameId, nextPlayers);
        await this._initInRoom(gameId, nextPlayers);
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
        this.gameDataService.setGameData(
            gameId,
            nextPlayers[0].gameType
        );
        this.gameDataService.setPlayers(
            gameId,
            {
                a: nextPlayers[0].queueElement.user,
                b: nextPlayers[1].queueElement.user
            }
        );
        this.eventEmitter.emit('game.start', gameId);
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
    async updateNextPlayerInvite(username: string, gameId: string,
                            accept: boolean): Promise<void> {
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
            this._removePairingTimeout(gameId);
            this._removeInvalidNextPlayers(gameId);
            await this.attemptPlayerPairing(gameId);
        }
        else if ((nextPlayers[0].accepted && nextPlayers[0].inRoom)
                    && (nextPlayers[1].accepted && nextPlayers[1].inRoom))
        {
            if (!this._confirmNextPlayers(gameId))
                await this.attemptPlayerPairing(gameId);
            else
                this._initGame(gameId, nextPlayers);
        }
    }

    // Called when a player joins or leaves a game room.
    async updateNextPlayerRoom(username: string, gameId: string,
                            join: boolean): Promise<void> {
        const   nextPlayers: NextPlayerPair | undefined =
                            this.queueService.updateNextPlayerRoom(
                                                username,
                                                gameId,
                                                join);
        const   registeredRoom: string = await this.queueService.findUser(
                                                                    username);

        if (registeredRoom != gameId && join)
            await this.updateNextPlayerRoom(username, registeredRoom, false);
        if (!nextPlayers
                || !nextPlayers[0]
                || !nextPlayers[1])
            return ;
        if ((nextPlayers[0].accepted && nextPlayers[0].inRoom)
                && (nextPlayers[1].accepted && nextPlayers[1].inRoom))
        {
            if (!this._confirmNextPlayers(gameId))
                await this.attemptPlayerPairing(gameId);
            else
                this._initGame(gameId, nextPlayers);
        }
    }

}
