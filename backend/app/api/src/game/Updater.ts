import { Game, GameState } from "./Game";
import { Ball } from "./Ball";
import { Player } from "./Player";

export class    Updater {

    checkPlayerACollision(ball: Ball, playerA: Player,
                            xDisplacement: number): boolean {
        let ballLeftBorder = ball.xPosition - ball.radius;
        let playerARightBorder = playerA.xPosition + playerA.halfWidth;
    
        return (ballLeftBorder > playerARightBorder
            && ballLeftBorder + xDisplacement <= playerARightBorder
            && Math.abs(ball.yPosition - playerA.yPosition)
                <= playerA.halfHeight + ball.radius
        );
    }

    checkPlayerBCollision(ball: Ball, playerB: Player,
                            xDisplacement: number): boolean {
        let ballRightBorder = ball.xPosition + ball.radius;
        let playerBLeftBorder = playerB.xPosition - playerB.halfWidth;
    
        return (ballRightBorder < playerBLeftBorder
            && ballRightBorder + xDisplacement >= playerBLeftBorder
            && Math.abs(ball.yPosition - playerB.yPosition)
                <= playerB.halfHeight + ball.radius
        );
    }

    checkCollisionUp(ball: Ball, yDisplacement: number): boolean {
        return (ball.yPosition - ball.radius + yDisplacement <= 0);
    }

    checkCollisionDown(game: Game, yDisplacement: number): boolean {
        return (game.ball.yPosition + game.ball.radius + yDisplacement >= game.height);
    }

    checkCollisionRight(game: Game, xDisplacement: number): boolean {
        return (game.ball.xPosition + game.ball.radius + xDisplacement >= game.width);
    }

    checkCollisionLeft(ball: Ball, xDisplacement: number): boolean {
        return (ball.xPosition - ball.radius + xDisplacement <= 0);
    }

    collisionPlayerA(ball: Ball, playerA: Player): void {
        ball.xPosition = playerA.xPosition + playerA.halfWidth + ball.radius;
        ball.xVelocity = 300;
        if (ball.yPosition < playerA.yPosition)
            ball.yVelocity = Math.random() * (0 + 300) - 300;
        else
            ball.yVelocity = Math.random() * (300 - 0) + 0;
    }

    collisionPlayerB(ball: Ball, playerB: Player): void {
        ball.xPosition = playerB.xPosition - playerB.halfWidth - ball.radius;
        ball.xVelocity = 300;
        if (ball.yPosition < playerB.yPosition)
            ball.yVelocity = Math.random() * (0 + 300) - 300;
        else
            ball.yVelocity = Math.random() * (300 - 0) + 0;
        ball.xVelocity *= -1;
    }

    collisionUp(ball: Ball): void {
        ball.yPosition = 0 + ball.radius;
        ball.yVelocity *= -1;
    }

    collisionDown(game: Game): void {
        game.ball.yPosition = game.height - game.ball.radius;
        game.ball.yVelocity *= -1;
    }

    collisionRight(game: Game, playerA: Player): void {
        game.ball.xVelocity = 0;
        game.ball.yVelocity = 0;
        game.ball.xPosition = (game.width / 2) - game.ball.radius;
        game.ball.yPosition = (game.height / 2) - game.ball.radius;
        playerA.score += 1;
    }

    collisionLeft(game: Game, playerB: Player): void {
        game.ball.xVelocity = 0;
        game.ball.yVelocity = 0;
        game.ball.xPosition = (game.width / 2) - game.ball.radius;
        game.ball.yPosition = (game.height / 2) - game.ball.radius;
        playerB.score += 1;
    }

    checkWin(playerScore: number): boolean {
        return (playerScore === Game.getWinScore());
    }

    serve(game: Game): void {
        game.serveBall();
    }

    pauseGame(game: Game): void {
        game.state = GameState.Paused;
    }

    forceWin(game: Game, winner: string): void {
        if (winner === "PlayerA")
        {
            game.playerA.score = Game.getWinScore();
            game.playerB.score = 0;
        }
        else
        {
            game.playerB.score = Game.getWinScore();
            game.playerA.score = 0;
        }
    }

}
