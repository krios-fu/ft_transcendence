import { Injectable } from "@nestjs/common";
import { GameType } from "./elements/Game";
import { GameDataService, Players } from "./game.data.service";
import { GameUpdateService } from "./game.updateService";

@Injectable()
export  class   GameManagementService {

    constructor(
        private readonly gameDataService: GameDataService,
        private readonly gameUpdateService: GameUpdateService
    ) {}

    start(gameId: string, players: Players, gameType: GameType): void {
        this.gameDataService.setGameData(gameId, gameType);
        this.gameDataService.setPlayers(gameId, players);
        this.gameUpdateService.startGame(gameId, gameType);
    }

    end(gameId: string): void {
        this.gameDataService.setGame(gameId, undefined);
        this.gameDataService.removeGameData(gameId);
    }

    canStart(gameId: string): boolean {
        return (
            !this.gameDataService.getGameData(gameId)
        );
    }

}
