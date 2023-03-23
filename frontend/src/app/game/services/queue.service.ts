import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlertServices } from "src/app/services/alert.service";
import { UserQueueData } from "../game-queue/game-queue.component";
import { SocketService } from "./socket.service";

@Injectable({
    providedIn: "root"
})
export class    QueueService {

    private _queueClassic: Observable<number>;
    private _queueHero: Observable<number>;
    private _unqueue: Observable<void>;
    private _userQueue: Observable<UserQueueData>;
    private _invite: Observable<string>;

    constructor(
        private readonly socketService: SocketService,
        private readonly alertService: AlertServices
    ) {
        this._queueClassic = this._setObservable<number>("queueClassicLength");
        this._queueHero = this._setObservable<number>("queueHeroLength");
        this._unqueue = this._setObservable<void>("unqueue");
        this._userQueue = this._setObservable<UserQueueData>("userQueue");
        this._invite = this._setObservable<string>("matchInvite");
        this._setMatchInviteNotification();
    }

    private _setObservable<T>(event: string): Observable<T> {
        return (this.socketService.getObservable<T>(event));
    }

    private _setMatchInviteNotification(): void {
        this._invite.subscribe({
            next: (roomId: string) => {
                this.alertService.openMatchInvite(roomId);
            },
            error: (err: any) => {
                console.log(`Error in Match Invite Notification. ${err}`);
            }
        });
    }

    classicSubscription(): Observable<number> {
        return (this._queueClassic);
    }

    heroSubscription(): Observable<number> {
        return (this._queueHero);
    }

    unqueueSubscription(): Observable<void> {
        return (this._unqueue);
    }

    userQueueSubscription(): Observable<UserQueueData> {
        return (this._userQueue);
    }

    addToQueue(roomId: string): void {
        this.socketService.emit<string>(
            "addToGameQueue",
            roomId
        );
    }

    addToHeroQueue(roomId: string): void {
        this.socketService.emit<string>(
            "addToGameHeroQueue",
            roomId
        );
    }

    removeFromQueue(roomId: string): void {
        this.socketService.emit<string>(
            "removeFromGameQueue",
            roomId
        );
    }

    removeFromHeroQueue(roomId: string): void {
        this.socketService.emit<string>(
            "removeFromGameHeroQueue",
            roomId
        );
    }

}
