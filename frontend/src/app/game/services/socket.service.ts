import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockIO from 'socket.io-client';
import { IAuthPayload } from 'src/app/interfaces/iauth-payload.interface';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: "root"
})
export class    SocketService {

    private _socket: SockIO.Socket;
    private _authAttempts: number;
    private _room: string;
    private _username?: string; //Provisional

    constructor(
        private readonly authService: AuthService
    ) {
        this._socket = SockIO.io("ws://localhost:3001", {
            auth: {
                token: this.authService.getAuthToken()
            },
        });
        this._addConnectionEvents();
        this._authAttempts = 0;
        this._room = "Game1"; //Provisional
        this._socket.once("mockUser", (data: any) => {
            this._username = data.mockUser;
        }); //Provisional
    }

    get socket(): SockIO.Socket {
        return (this._socket);
    }

    get room(): string {
        return (this._room);
    }

    get username(): string | undefined {
        return (this._username);
    }

    // Don't need to unsubscribe, as it returns just one value
    private _authenticateConnection(): void {
        this.authService.directRefreshToken().subscribe(
            (payload: IAuthPayload | undefined) => {
                console.log(payload);
                if (!payload)
                    return ;
                this._socket.emit("authentication", payload.accessToken);
            }
        );
    }

    private _addConnectionEvents(): void {
        this._socket.on("authFailure", () => {
            if (this._authAttempts < 3)
            {
                ++this._authAttempts;
                this._authenticateConnection();
            }
        });
        this.socket.on("authSuccess", () => {
            this._authAttempts = 0;
        });
    }

    joinRoom(roomId: string): void {
        if (!roomId || roomId === "")
            return ;
        this._socket.emit("joinRoom", roomId);
    }

    emit<T>(event: string, data: T): void {
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
