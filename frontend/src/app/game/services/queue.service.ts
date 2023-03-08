import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SocketService } from "./socket.service";

@Injectable({
    providedIn: "root"
})
export class    QueueService {

    private _queueClassic: Observable<number>;
    private _queueHero: Observable<number>;
    private _unqueue: Observable<void>;

    constructor(
        private readonly socketService: SocketService
    ) {
        this._queueClassic = this._setObservable<number>("queueClassicLength");
        this._queueHero = this._setObservable<number>("queueHeroLength");
        this._unqueue = this._setObservable<void>("unqueue");
    }

    private _setObservable<T>(event: string): Observable<T> {
        return (this.socketService.getObservable<T>(event));
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

    addToQueue(): boolean {
        this.socketService.emit<any>(
            "addToGameQueue",
            this.socketService.room
        );
        return (true);
    }

    addToHeroQueue() {
        this.socketService.emit<any>(
            "addToGameHeroQueue",
            this.socketService.room
        );
        return (true);
    }

}
