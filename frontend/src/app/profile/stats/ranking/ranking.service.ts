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
    username: string;
}

export interface   RankingData {
    rank: number; // Generating it when transforming response data
    nickName: string;
    photoUrl: string;
    rating: number;
    category: string;
    username: string;
}

export type UserCountData = [UserRanking[], number]
                                | [UserRanking[], number, number];

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

    private _execRankingRequest(url: string): Observable<UserCountData> {
        return (
            this.httpService.get<UserCountData>(url)
            .pipe(
                retry(3),
                catchError(this._httpErrorHandler)
            )
        );
    }

    getInitialRankings(limit: number,
                        targetUser: string)
                            : Observable<UserCountData> {
        return (
            this._execRankingRequest(
                `${this._urlAuthority}${this._urlPath}?`
                + `orderDesc=ranking`
                + `&orderDesc=username`
                + `&limit=${limit}`
                + `&target=${targetUser}`
                + `&count=true`
            )
        );
    }

    getRankings(limit: number,
                    offset: number): Observable<UserCountData> {
        return (
            this._execRankingRequest(
                `${this._urlAuthority}${this._urlPath}?`
                + `orderDesc=ranking`
                + `&orderDesc=username`
                + `&limit=${limit}`
                + `&offset=${offset}`
                + `&count=true`
            )
        );
    }

    userToRanking(users: UserRanking[], initRank: number): RankingData[] {
        return (users.map((user: UserRanking): RankingData => {
            return ({
                rank: initRank++,
                nickName: user.nickName,
                photoUrl: user.photoUrl,
                rating: user.ranking,
                username: user.username,
                category: Category[user.category] //Provisional Hack
            });
        }));
    }

}
