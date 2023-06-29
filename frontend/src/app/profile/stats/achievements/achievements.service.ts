import {
    HttpClient,
    HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    catchError,
    Observable,
    retry,
    switchMap,
    throwError
} from "rxjs";
import { UserDto } from "src/app/dtos/user.dto";
import { environment } from 'src/environments/environment';


export interface    AchievementData {
    name: string;
    description: string;
    photoUrl: string;
    createdAt: string;
}

interface    Achievement {
    achievementName: string;
    description: string;
    photoUrl: string;
    createdAt: string;
}

export interface   UserAchievement {
    achievement: Achievement;
    createdAt: Date;
}

@Injectable({
    providedIn: "root"
})
export class    AchievementsService {
    constructor(
        private readonly httpService: HttpClient
    ) {}

    private _httpErrorHandler(err: HttpErrorResponse): Observable<never> {
        return (
            throwError(() =>
                new Error(
                    `GET user achievements failed. Status code ${err.status}`
                )
            )
        );
    }

    private _getUserAchievements(userId: number)
                                    : Observable<UserAchievement[]> {
        return (this.httpService.get<UserAchievement[]>(
            `${environment.apiUrl}achievements_user?`
            + `filter[userId]=${userId}`
        )
        .pipe(
            retry(3),
            catchError(this._httpErrorHandler)
        ));
    }

    private _getUser(username: string): Observable<UserDto[]> {
        return (
            this.httpService.get<UserDto[]>(
                `${environment.apiUrl}users?filter[username]=${username}`
            ).pipe(
                retry(3),
                catchError(this._httpErrorHandler)
            )
        );
    }

    getAchievements(username: string): Observable<UserAchievement[]> {
        return (this._getUser(username)
        .pipe(
            switchMap((users: UserDto[]) => {
                if (!users)
                    return (throwError(() => "User not found."))
                return (this._getUserAchievements(users[0].id));
            }),
            catchError((err) => {
                return throwError(() => err);
            })
        ));
    }

    userToAchievement(userAchievements: UserAchievement[]): AchievementData[] {
        return (userAchievements.map((userAchievement: UserAchievement) => {
            return ({
                name: userAchievement.achievement.achievementName,
                description: userAchievement.achievement.description,
                photoUrl: userAchievement.achievement.photoUrl,
                createdAt: new Date(
                    userAchievement.createdAt
                ).toLocaleDateString("es-ES")
            });
        }));
    }

}
