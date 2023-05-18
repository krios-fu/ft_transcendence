import {
    AfterViewInit,
    Component,
    OnInit
} from '@angular/core';
import {
    RankingData,
    RankingService,
    UserRanking
} from './ranking.service';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, AfterViewInit {

    ranking: RankingData[];
    displayedColumns: string[];
    totalUsers: number;
    pageSize: number;
    pageIndex: number;

    constructor(private readonly rankingService: RankingService) {
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
    }

    ngOnInit(): void {
        console.log("Initiated ranking component");
    }

    ngAfterViewInit(): void {
        this.updateRankings();
    }

    updateRankings(): void {
        this.rankingService.getRankings(
            this.pageSize,
            this.pageSize * this.pageIndex
        ).subscribe({ // No need to unsubscribe. Only one next value
            next: (data: [UserRanking[], number]) => {
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

}
