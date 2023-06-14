import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockIO from 'socket.io-client';
import { IAuthPayload } from 'src/app/interfaces/iauth-payload.interface';
import { AuthService } from 'src/app/services/auth.service';

enum SocketException {
    Unauthorized = "unauthorized",
    Forbidden = "forbidden",
    BadRequest = "badRequest",
    InternalServerError = "internalServerError"
}

interface   SocketExceptionData {
    cause: SocketException;
    data: any;
    targetEvent: string;
}

@Injectable({
    providedIn: "root"
})
export class    SocketService {

    private _socket: SockIO.Socket;
    private _connectAttempts: number;
    private _authAttempts: number;
    private _authenticating: boolean;
    private _lastAuthSuccess: number;
    private _failedEvents: SocketExceptionData[];

    constructor(
        private readonly authService: AuthService
    ) {
        this._socket = SockIO.io("ws://localhost:3001", {
            reconnectionAttempts: 3
        });
        this._addConnectionEvents();
        this._connectAttempts = 0;
        this._authAttempts = 0;
        this._authenticating = false;
        this._lastAuthSuccess = 0;
        this._failedEvents = [];
    }

    get socket(): SockIO.Socket {
        return (this._socket);
    }

    private _reconnect(): void {
        if (this._connectAttempts >= 3)
            return ;
        ++this._connectAttempts;
        this._socket.connect();
    }

    /*
    **  Don't need to unsubscribe, as it returns just one value.
    **
    **  Not using handshake.auth because it cannot be modified after
    **  the initial assignment after connection. And don't want to disconnect
    **  the socket each time the token gets refreshed, as it would impact UX
    **  negatively.
    */
    private _reAuthenticateConnection(): void {
        if (this._authAttempts >= 3)
            return ;
        ++this._authAttempts;
        this.authService.directRefreshToken().subscribe(
            (payload: IAuthPayload | undefined) => {
                if (!payload)
                    return ;
                this.emit<string>("authentication", payload.accessToken);
            }
        );
    }

    private _emitFailedEvents(): void {
        this._failedEvents.forEach((event) => {
            this.emit(event.targetEvent, event.data);
        });
        this._failedEvents = [];
    }

    private _addConnectionEvents(): void {
        this._socket.on("connect", () => {
            console.log('[ IN SOCKET.SERVICE ] connect ping!');
            this._connectAttempts = 0;
            //Authenticate through this event to register user in socket server
            this.emit("authentication", this.authService.getAuthToken());
        });
        this._socket.on("exception", (xcpt: SocketExceptionData) => {
            console.log("Websocket exception: ", xcpt);
            if (xcpt.cause != SocketException.Forbidden)
            {
                if (xcpt.targetEvent != "authentication")
                    this._failedEvents.push(xcpt);
                if (this._authenticating)
                    return ;
                this._authenticating = true;
                this._reAuthenticateConnection();
            }
        });
        this._socket.on("authSuccess", () => {
            const   currentTime: number = Date.now();
        
            this._authenticating = false;
            this._authAttempts = 0;
            if (currentTime - this._lastAuthSuccess > 5000)
                this._emitFailedEvents();
            else
                this._failedEvents = [];
            this._lastAuthSuccess = currentTime;
        });
        this._socket.on("disconnect", () => {
            this._reconnect();
        });
    }

    joinRoom(roomId: string): void {
        if (!roomId || roomId === "")
            return ;
        this.emit<string>("joinRoom", roomId);
    }

    emit<T = undefined>(event: string, data?: T): void {
        this._socket.emit(event, data);
    }

    getObservable<T>(event: string): Observable<T> {
        return (
            new Observable<T>((subscriber) => {
                this._socket.on(event, (data: T) => {
                    subscriber.next(data);
                });
            })
        );
    }

}
