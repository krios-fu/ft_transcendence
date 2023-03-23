import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { SocketService } from 'src/app/game/services/socket.service';

interface IMatchInviteResponse {
    roomId: string;
    accept: boolean;
}

@Component({
    selector: 'app-match-notification',
    templateUrl: './match-notification.component.html',
    styleUrls: ['./match-notification.component.scss']
})
export class    MatchNotificationComponent implements OnInit {

    progressbarValue = 100;
    curSec: number = 0;

    constructor(
        private readonly dialogRef: MatDialogRef<MatchNotificationComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly roomId: string,
        private readonly gameSocketService: SocketService,
        private readonly router: Router
    ) {}

    startTimer(seconds: number) {
        const timer$ = interval(1000);
        const sub = timer$.subscribe((sec) => {
            this.progressbarValue = 100 - sec * 100 / seconds;
            this.curSec = sec;

            if (this.curSec === seconds) {
                sub.unsubscribe();
                this.dialogRef.close()
            }
        });
    }

    private _navigateToGameRoom(id: string): void {
        this.router.navigate(['/', {
            outlets: {
                game: ['room', id]
            }
        }]);
    }

    setActions(roomId: string): void {
        this.dialogRef.afterClosed().subscribe(result => {
            let accept: boolean = true;
        
            if (!result)
                accept = false;
            this.gameSocketService.emit<IMatchInviteResponse>(
                "matchInviteResponse",
                {
                    roomId: roomId,
                    accept: accept
                }
            );
            if (accept)
                this._navigateToGameRoom(roomId);
        });
    }

    ngOnInit(): void {
        this.startTimer(10);
        this.setActions(this.roomId);
    }

}
