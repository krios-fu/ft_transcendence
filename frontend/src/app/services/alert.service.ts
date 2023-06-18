import { Component, Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogNotification } from "./dialog/dialog.notification";
import { FriendNotificationComponent } from "./dialog/notification/friend-notification/friend-notification.component";
import { GameNotificationComponent } from "./dialog/notification/game-notification/game-notification.component";
import { UserDto } from "../dtos/user.dto";
import {
  InviteData,
  MatchNotificationComponent
} from "./dialog/notification/match-notification/match-notification.component";
import { GameInstructionsComponent } from "./dialog/info/game-instructions/game-instructions.component";
import { RoomPasswordInputComponent } from "./dialog/input/room_password/room-password-input.component";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

/* This service is used to announce events at of the page 
** for example: Changes saved
*/
export class AlertServices {
  private durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar,
    private _dialog: MatDialog) { }

  /* Use for bottom page */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openDialog(): void {
    this._dialog.open(DialogNotification, {
      width: '500px',
      height: '500px',
      //   enterAnimationDuration,
      //   exitAnimationDuration,
    });
  }

  openFriendPending(): void {
    this._dialog.open(FriendNotificationComponent);
  }

  openRequestGame(user: UserDto, title: string) {
    const dialogRef: MatDialogRef<GameNotificationComponent> =
    this._dialog.open(GameNotificationComponent, {
      width: '300px',
      disableClose: true,
      data: { user: user, title: title },
      position: {
        top: '10vh',
        right: '1vw'
      }
    });
    return (
      dialogRef.afterClosed()
    );
  }

  openMatchInvite(inviteData: InviteData) {
    this._dialog.open(MatchNotificationComponent, {
      minWidth: '300px',
      maxWidth: '450px',
      data: inviteData,
      position: {
        bottom: '20px',
        left: '20px'
      }
    });
  }

  openGameInstructions(): void {
    this._dialog.open(GameInstructionsComponent, {
      minWidth: '300px',
      maxWidth: '450px',
    });
  }

  openPrivateRoomAccess(roomName: string): Observable<any> {
    const dialogRef: MatDialogRef<RoomPasswordInputComponent>
      = this._dialog.open(RoomPasswordInputComponent, {
        data: roomName
      });

    return (
      dialogRef.afterClosed()
    );
  }

}
