import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnChanges {

    @Input() username ?: string;
    constructor(
    private route: ActivatedRoute,

    ) { }

    ngOnInit(): void {
       
    }

    ngOnChanges(): void {
    }

}
