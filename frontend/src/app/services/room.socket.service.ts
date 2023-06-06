import {Injectable} from "@angular/core";
import * as SockIO from 'socket.io-client';
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({ providedIn: 'root'});
export class RoomSocketService {
    socket: SockIO.Socket;
    constructor(private readonly authService: AuthService) {
        this.socket = SockIO.io(environment.wsUrl,
            {
                reconnectionAttempts: 3,
                auth: cb => this.authService.getAuthUser()
            });
        this.addEventListeners();
    }



    //~~~ EVENT EMITTERS ~~~//
    /* emit message */

    /* join room */

    /* leave room */

    /* kick user */

   /* init room roles */

    //~~~ REST O WS ?? ~~~//
    /* ban user */
    /* promote user */
    /* silence user */
    /* demote user */
    /* unmute user */
    /* unban user */

    //~~~ EVENT LISTENERS ~~~//
    private addEventListeners(): void {
        this.socket.on('exception', () => {
           /* init role setup logic */
        });
        this.socket.on('refresh_role_request', () => {
            /* refresh role logic & acknoledgement */
        })
        this.socket.on('disconnect', () => {
           /* disconnect case ctrl */
        });
    }

    /* exception catcher */

    /* refresh roles request */
}