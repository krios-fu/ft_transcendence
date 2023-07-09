import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { UserDto } from 'src/app/dtos/user.dto';
import { g_buildImgUrl } from '../../../../game/utils/images';

interface dialogGame {
  user: UserDto,
  title: string
}

@Component({
  selector: 'app-game-notification',
  templateUrl: './game-notification.component.html',
  styleUrls: ['./game-notification.component.scss']
})

export class GameNotificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GameNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogGame) { }

  progressbarValue = 100;
  curSec: number = 0;

  startTimer(seconds: number) {
    const time = seconds;
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


  ngOnInit(): void {
    this.startTimer(10);
    // this.sendResponse();
  }

  buildImgUrl(imgPath: string): string {
    return (g_buildImgUrl(imgPath));
  }

}
