import { Injectable } from "@nestjs/common";
import { MatchEntity } from "../match/match.entity";
import { Category } from "../user/enum/category.enum";

@Injectable()
export class    AchievementControlService {

    private static readonly _checkers: Map<number, Function> = new Map([
        [1, AchievementControlService._rookie],
        [2, AchievementControlService._hardcore],
        [3, AchievementControlService._superior],
        [4, AchievementControlService._giantKiller],
    ]);

    // Play your first match
    private static _rookie(username: string,
                                matchHistory: MatchEntity[]): boolean {
        return (
            matchHistory.find((match) => {
                return (
                    match.loser.user.username === username
                        || match.winner.user.username === username
                )
            })
            != undefined
        )
    }

    // Win 2 matches in a row
    private static _hardcore(username: string,
                                matchHistory: MatchEntity[]): boolean {
        let winCount: number = 0;

        for (const match of matchHistory) {
            if (match.winner.user.username === username)
            { // Matches are ordered by date in descending order
                if (++winCount === 2)
                    return (true);
            }
            else
                winCount = 0;
        }
        return (false);
    }

    /*
    **  Win 2 matches against lower ranking players.
    **
    **  Winner's and loser's ranking and category values
    **  are the ones they had before the match.
    */
    private static _superior(username: string,
                                matchHistory: MatchEntity[]): boolean {
        let superWinCount: number = 0;

        for (const match of matchHistory) {
            if (match.winner.user.username !== username)
                continue ;
            if (match.winner.category != Category.Pending
                    && match.loser.category != Category.Pending
                    && match.winner.ranking > match.loser.ranking)
            {// Matches are ordered by date in descending order
                if (++superWinCount === 2)
                    return (true);
            }
        }
        return (false);
    }

    /*
    **  Win 2 matches against lower ranking players.
    **
    **  Winner's and loser's ranking and category values
    **  are the ones they had before the match.
    */
    private static _giantKiller(username: string,
                                matchHistory: MatchEntity[]): boolean {
        let giantWinCount: number = 0;

        for (const match of matchHistory) {
            if (match.winner.user.username !== username)
                continue ;
            if (match.winner.category != Category.Pending
                    && match.loser.category != Category.Pending
                    && match.winner.ranking < match.loser.ranking)
            {// Matches are ordered by date in descending order
                if (++giantWinCount === 2)
                return (true);
            }
        }
        return (false);
    }

    check(achievementId: number, username: string,
            matchHistory: MatchEntity[]): boolean {
        const   checker: Function =
                    AchievementControlService._checkers.get(achievementId);
        
        if (!username || !matchHistory.length || !checker)
            return (false);
        return (checker(username, matchHistory));
    }

}
