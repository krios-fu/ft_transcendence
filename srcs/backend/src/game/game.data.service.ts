import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/entities/user.entity";
import {
    Game,
    GameType
} from "./elements/Game";
import { GameSelection } from "./elements/GameSelection";
import { IGameResultData } from "./game.updateService";

export interface    Players {
    a: UserEntity;
    b: UserEntity;
}

interface   GameData {
    players: Players | undefined;
    type: GameType;
    selection: GameSelection | undefined;
    game: Game | undefined;
    pointTimeout: NodeJS.Timeout | undefined;
    result: IGameResultData | undefined;
}

export interface   RunningGame {
    id: string;
    game: Game;
}

@Injectable()
export class    GameDataService {

    private _gameData: Map<string, GameData>;
    private _runningGames: RunningGame[];

    constructor() {
        this._gameData = new Map<string, GameData>;
        this._runningGames = [];
    }

    getGameData(gameId: string): Readonly<GameData> | undefined {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData);
    }

    setGameData(gameId: string, gameType: GameType): void {
        this._gameData.set(gameId, {
            players: undefined,
            type: gameType,
            selection: undefined,
            game: undefined,
            pointTimeout: undefined,
            result: undefined
        });
    }

    getPlayers(gameId: string): Readonly<Players> | undefined {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData.players);
    }

    setPlayers(gameId: string, players: Players): void {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return ;
        else
            gameData.players = players;
    }

    getType(gameId: string): Readonly<GameType> {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData.type);
    }

    getSelection(gameId: string): GameSelection | undefined {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData.selection);
    }

    setSelection(gameId: string, selection: GameSelection | undefined): void {
        const   gameData: GameData = this._gameData.get(gameId);
    
        if (!gameData)
            return ;
        else
            gameData.selection = selection;
    }

    getGame(gameId: string): Game | undefined {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData.game);
    }

    private _removeRunningGame(gameId: string): void {
        let     index: number;
    
        index = this._runningGames.findIndex((elem: RunningGame) => {
            return (elem.id === gameId);
        });
        if (index != -1)
            this._runningGames.splice(index, 1);
    }

    setGame(gameId: string, game: Game | undefined): void {
        const   gameData: GameData = this._gameData.get(gameId);
    
        if (!gameData)
            return ;
        if (gameData.game)
            this._removeRunningGame(gameId);
        gameData.game = game;
        if (!gameData.game)
            return ;
        this._runningGames.push({
            id: gameId,
            game: gameData.game
        });
    }

    getRunningGames(): RunningGame[] {
        return (this._runningGames);
    }

    getPointTimeout(gameId: string): NodeJS.Timeout | undefined {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData.pointTimeout);
    }

    setPointTimeout(gameId: string,
                        timeout: NodeJS.Timeout | undefined): void {
        const   gameData: GameData = this._gameData.get(gameId);
    
        if (!gameData)
            return ;
        gameData.pointTimeout = timeout;
    }

    clearPointTimeout(gameId: string): void {
        const   gameData: GameData = this._gameData.get(gameId);
    
        if (!gameData
                || !gameData.pointTimeout)
            return ;
        clearTimeout(gameData.pointTimeout);
        gameData.pointTimeout = undefined;
    }

    getResult(gameId: string): Readonly<IGameResultData> | undefined {
        const   gameData: GameData = this._gameData.get(gameId);

        if (!gameData)
            return (undefined);
        return (gameData.result);
    }

    setResult(gameId: string, result: IGameResultData | undefined): void {
        const   gameData: GameData = this._gameData.get(gameId);
    
        if (!gameData)
            return ;
        gameData.result = result;
    }

    removeGameData(gameId: string): void {
        const   gameData: GameData = this._gameData.get(gameId);

        if (gameData.game)
            this._removeRunningGame(gameId);
        this._gameData.delete(gameId);
    }

}
