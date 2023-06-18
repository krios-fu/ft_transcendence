import {
    HttpClient,
    HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    catchError,
    Observable,
    retry,
    throwError
} from "rxjs";
import { environment } from 'src/environments/environment';


export interface    MatchHistoryData {
    winner: string;
    loser: string;
    winnerPhoto: string;
    loserPhoto: string;
    winScore: number;
    loseScore: number;
    official: boolean;
    date: string;
}

interface   UserData {
    photoUrl: string;
    nickName: string;
}

interface   PlayerData {
    score: number;
    user: UserData;
}

export interface   UserHistory {
    playedAt: Date;
    official: boolean;
    winner: PlayerData;
    loser: PlayerData;
}

@Injectable({
    providedIn: 'root'
})
export class    MatchHistoryService {

    // Store common urls in separate file to avoid duplication
    // private readonly _urlAuthority: string = "http://localhost:3000";
    // private readonly _urlPath: string = "/match";

    constructor(
        private readonly httpService: HttpClient
    ) {}

    private _httpErrorHandler(err: HttpErrorResponse): Observable<never> {
        return (
            throwError(() =>
                new Error(`GET match history failed. Status code ${err.status}`)
            )
        );
    }

    getMatchHistory(limit: number,
                    offset: number,
                    username: string): Observable<[UserHistory[], number]> {
        return (this.httpService.get<[UserHistory[], number]>(
            `${environment.apiUrl}match?`
            + `limit=${limit}`
            + `&offset=${offset}`
            + `&username=${username}`
        )
        .pipe(
            retry(3),
            catchError(this._httpErrorHandler)
        ));
    }

    userToMatchHistory(users: UserHistory[]): MatchHistoryData[] {
        return (users.map((match: UserHistory): MatchHistoryData => {
            return ({
                winner: match.winner.user.nickName,
                loser: match.loser.user.nickName,
                winnerPhoto: match.winner.user.photoUrl,
                loserPhoto: match.loser.user.photoUrl,
                winScore: match.winner.score,
                loseScore: match.loser.score,
                official: match.official,
                date: new Date(match.playedAt).toLocaleDateString('es-ES')
            });
        }));
    }

}
