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

export enum    Category {
    Pending,
    Iron,
    Bronze,
    Silver,
    Gold,
    Platinum
}

export interface    UserRanking {
    nickName: string;
    photoUrl: string;
    ranking: number;
    category: Category;
}

export interface   RankingData {
    rank: number; // Generating it when transforming response data
    nickName: string;
    rating: number;
    category: string;
}

@Injectable({
    providedIn: 'root'
})
export class    RankingService {

    // Store common urls in separate file to avoid duplication
    private readonly _urlAuthority: string = "http://localhost:3000";
    private readonly _urlPath: string = "/users";

    constructor(
        private readonly httpService: HttpClient
    ) {}

    private _httpErrorHandler(err: HttpErrorResponse): Observable<never> {
        return (
            throwError(() =>
                new Error(`GET rankings failed. Status code ${err.status}`)
            )
        );
    }

    getRankings(limit: number,
                    offset: number): Observable<[UserRanking[], number]> {
        return (this.httpService.get<[UserRanking[], number]>(
            `${this._urlAuthority}${this._urlPath}?`
            + `orderDesc=ranking`
            + `&orderDesc=username`
            + `&limit=${limit}`
            + `&offset=${offset}`
            + `&count=true`
        )
        .pipe(
            retry(3),
            catchError(this._httpErrorHandler)
        ));
    }

    userToRanking(users: UserRanking[], initRank: number): RankingData[] {
        return (users.map((user: UserRanking): RankingData => {
            return ({
                rank: initRank++,
                nickName: user.nickName,
                rating: user.ranking,
                category: Category[user.category] //Provisional Hack
            });
        }));
    }

}
