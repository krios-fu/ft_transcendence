import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnChanges {

    @Input() username ?: string;
    constructor() { }

    ngOnInit(): void {}

    ngOnChanges(): void {}

}
