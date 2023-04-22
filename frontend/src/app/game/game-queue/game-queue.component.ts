import {
    Component,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    Observer,
    Subscription
} from 'rxjs';
import { QueueService } from '../services/queue.service';

export type QueueType = "classic" | "hero";

export interface    UserQueueData {
    queued: boolean;
    roomId?: string;
    type?: QueueType;
}

@Component({
    selector: 'app-game-queue',
    templateUrl: './game-queue.component.html',
    styleUrls: ['./game-queue.component.scss']
})
export class GameQueueComponent implements OnInit, OnDestroy {

    classicLength: number;
    heroLength: number;
    userQueueData: UserQueueData;

    private _classicSubscription: Subscription | undefined;
    private _heroSubscription: Subscription | undefined;
    private _unqueueSubscription: Subscription | undefined;
    private _userQueueDataSubscription: Subscription | undefined;

    @Input('roomId') roomId: string = '';

    constructor(
        private readonly queueService: QueueService
    ) {
        this.classicLength = 0;
        this.heroLength = 0;
        this.userQueueData = { queued: false };
        this._classicSubscription = undefined;
        this._heroSubscription = undefined;
        this._unqueueSubscription = undefined;
        this._userQueueDataSubscription = undefined;
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
            next: () => { this.userQueueData.queued = false },
            error: (err: any) => {
                console.error(err);
            }
        });
        this._userQueueDataSubscription =
                                    this.queueService.userQueueSubscription()
        .subscribe({
            next: (data: UserQueueData) => {
                this.userQueueData = data;
            },
            error: (err: any) => {
                console.error(err);
            }
        })
    }

    ngOnInit(): void {
        this._subscribe();
    }

    addToQueue() {
        if (this.userQueueData.queued)
        {
            if (this.userQueueData.roomId === this.roomId
                    && this.userQueueData.type === "classic")
                this.queueService.removeFromQueue(this.roomId);
            return ;
        }
        this.queueService.addToQueue(this.roomId)
    }

    addToHeroQueue() {
        if (this.userQueueData.queued)
        {
            if (this.userQueueData.roomId === this.roomId
                    && this.userQueueData.type === "hero")
                this.queueService.removeFromHeroQueue(this.roomId);
            return ;
        }
        this.queueService.addToHeroQueue(this.roomId)
    }

    ngOnDestroy(): void {
        if (this._classicSubscription)
            this._classicSubscription.unsubscribe();
        if (this._heroSubscription)
            this._heroSubscription.unsubscribe();
        if (this._unqueueSubscription)
            this._unqueueSubscription.unsubscribe();
        if (this._userQueueDataSubscription)
            this._userQueueDataSubscription.unsubscribe();
    }

}
