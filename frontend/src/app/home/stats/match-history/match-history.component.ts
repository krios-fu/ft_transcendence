import {
    AfterViewInit,
    Component,
    OnInit
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
    MatchHistoryData,
    MatchHistoryService,
    UserHistory
} from './match-history.service';

@Component({
    selector: 'app-match-history',
    templateUrl: './match-history.component.html',
    styleUrls: ['./match-history.component.scss']
})
export class MatchHistoryComponent implements OnInit, AfterViewInit {

    history: MatchHistoryData[];
    displayedColumns: string[];
    totalMatches: number;
    pageSize: number;
    pageIndex: number;
    user: string;

    constructor(
        private readonly matchHistoryService: MatchHistoryService,
        private readonly route: ActivatedRoute
    ) {
        this.history = [];
        this.displayedColumns = [
            "winner",
            "loser",
            "winScore",
            "loseScore",
            "official",
            "date"
        ];
        this.totalMatches = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.user = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        console.log("Initiated Match history");
    }

    ngAfterViewInit(): void {
        this.updateHistory();
    }

    updateHistory(): void {
        this.matchHistoryService.getMatchHistory(
            this.pageSize,
            this.pageSize * this.pageIndex,
            this.user
        ).subscribe({ // No need to unsubscribe. Only one next value
            next: (data: [UserHistory[], number]) => {
                this.history = this.matchHistoryService.userToMatchHistory(
                    data[0]
                );
                this.totalMatches = data[1];
            },
            error: (err: Observable<never>) => {
                console.error(err);
            }
        });
    }

    pageEventHandler(pageEvent: PageEvent): void {
        this.pageIndex = pageEvent.pageIndex;
        this.updateHistory();
    }

}
