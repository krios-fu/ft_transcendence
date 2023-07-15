import { Component } from "@angular/core"
import { AlertServices } from "../services/alert.service";
import { SocketService } from "./services/socket.service";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class    GameComponent {

    constructor(
        private readonly gameSocketService: SocketService,
        private readonly alertService: AlertServices
    ) {
        this._setSubscriptions();
    }

    private _setSubscriptions(): void {
        this.gameSocketService.getObservable<string>("playerExit")
            .subscribe({
                next: (roomName: string) => {
                    this.alertService.openSnackBar(
                        `Return to room ${roomName} in 15 secs, `
                        + "or lose the match.",
                        "OK"
                    );
                },
                error: (err: any) => {
                    console.error(err);
                }
            }
        );
    }

}
