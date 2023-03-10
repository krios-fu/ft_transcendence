import {Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'dialog-notification',
	templateUrl: './dialog.notification.html'
})
export class DialogNotification{
	constructor(public dialogRef: MatDialogRef<DialogNotification>){}
}