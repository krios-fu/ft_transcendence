import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
export class MatchHistoryComponent implements OnInit, AfterViewInit, OnChanges {

    history: MatchHistoryData[];
    displayedColumns: string[];
    totalMatches: number;
    pageSize: number;
    pageIndex: number;
    @Input() username ?: string;
 
    constructor(
        private readonly matchHistoryService: MatchHistoryService,
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
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}
    
    ngOnChanges(): void {
        this.updateHistory();
    }

    updateHistory(): void {
        this.matchHistoryService.getMatchHistory(
            this.pageSize,
            this.pageSize * this.pageIndex,
            this.username as string
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
