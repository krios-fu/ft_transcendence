import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    Observer,
    Subscription
} from 'rxjs';
import { QueueService } from '../services/queue.service';

@Component({
    selector: 'app-game-queue',
    templateUrl: './game-queue.component.html',
    styleUrls: ['./game-queue.component.scss']
})
export class GameQueueComponent implements OnInit, OnDestroy {

    queued: boolean;
    classicLength: number;
    heroLength: number;

    private _classicSubscription: Subscription | undefined;
    private _heroSubscription: Subscription | undefined;
    private _unqueueSubscription: Subscription | undefined;

    constructor(
        private readonly queueService: QueueService
    ) {
        this.queued = false;
        this.classicLength = 0;
        this.heroLength = 0;
        this._classicSubscription = undefined;
        this._heroSubscription = undefined;
        this._unqueueSubscription = undefined;
    }

    private _updateClassicLength(length: number): void {
        this.classicLength = length;
    }

    private _updateHeroLength(length: number): void {
        this.heroLength = length;
    }

    private _getQueueObserver(
                updateLength: (length: number) => any): Observer<number> {
        return ({
            next: (length) => {
                updateLength(length);
            },
            error: (err: any) => {
                console.error(err);
            },
            complete: () => {}
        });
    }

    /*
    **  Calling bind to preserve the class context when class methods
    **  are passed as arguments.
    */
    private _subscribe(): void {
        this._classicSubscription = this.queueService.classicSubscription()
        .subscribe(
            this._getQueueObserver(this._updateClassicLength.bind(this))
        );
        this._heroSubscription = this.queueService.heroSubscription()
        .subscribe(
            this._getQueueObserver(this._updateHeroLength.bind(this))
        );
        this._unqueueSubscription = this.queueService.unqueueSubscription()
        .subscribe({
            next: () => { this.queued = false },
            error: (err: any) => {
                console.error(err);
            }
        });
    }

    ngOnInit(): void {
        this._subscribe();
    }

    addToQueue() {
        if (this.queued)
            return ;
        if (this.queueService.addToQueue())
            this.queued = true;
    }

    addToHeroQueue() {
        if (this.queued)
            return ;
        if (this.queueService.addToHeroQueue())
            this.queued = true;
    }

    ngOnDestroy(): void {
        if (this._classicSubscription)
            this._classicSubscription.unsubscribe();
        if (this._heroSubscription)
            this._heroSubscription.unsubscribe();
        if (this._unqueueSubscription)
            this._unqueueSubscription.unsubscribe();
    }

}
