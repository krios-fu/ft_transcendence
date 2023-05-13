import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    RankingData,
    RankingService,
    UserCountData
} from './ranking.service';
import { PageEvent } from '@angular/material/paginator';
import {
    Observable,
    Subscription
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy {

    ranking: RankingData[];
    displayedColumns: string[];
    totalUsers: number;
    pageSize: number;
    pageIndex: number;
    username: string;
    
    private _routeParams?: Subscription;

    constructor(
        private readonly rankingService: RankingService,
        private route: ActivatedRoute
    ) {
        this.ranking = [];
        this.displayedColumns = [
            "rank",
            "player",
            "rating",
            "category"
        ];
        this.totalUsers = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.username = "";
    }

    ngOnInit(): void {
        this._routeParams = this.route.params.subscribe(({ id }) => {
            this.username = id;
            this.updateRankings(this.username);
        });
    }

    private _requestRankingData(targetUser?: string)
                                    : Observable<UserCountData> {    
        if (targetUser)
        {
            return (
                this.rankingService.getInitialRankings(
                    this.pageSize,
                    targetUser
                )
            );
        }
        return (
            this.rankingService.getRankings(
                this.pageSize,
                this.pageSize * this.pageIndex
            )
        );
    }

    updateRankings(targetUser?: string): void {
        this._requestRankingData(targetUser)
        .subscribe({ // No need to unsubscribe. Only one next value
            next: (data: UserCountData) => {
                if (data[2] != undefined
                        && data[2] != 0)
                    this.pageIndex = Math.floor(data[2] / this.pageSize);
                this.ranking = this.rankingService.userToRanking(
                    data[0],
                    this.pageIndex * this.pageSize + 1
                );
                this.totalUsers = data[1];
            },
            error: (err: Observable<never>) => {
                console.error(err);
            }
        });
    }

    pageEventHandler(pageEvent: PageEvent): void {
        this.pageIndex = pageEvent.pageIndex;
        this.updateRankings();
    }

    ngOnDestroy(): void {
        this._routeParams?.unsubscribe();
    }

}
