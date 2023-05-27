import {
    Component,
    Inject,
    OnInit
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef
} from '@angular/material/dialog';

@Component({
    selector: 'app-room-password-input',
    templateUrl: './room-password-input.component.html',
    styleUrls: ['./room-password-input.component.scss']
})
export class    RoomPasswordInputComponent implements OnInit {

    pass: string;

    constructor(
        private readonly dialogRef: MatDialogRef<RoomPasswordInputComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly roomName: string,
    ) {
        this.pass = '';
    }

    ngOnInit(): void {
        this.pass = '';
    }

}
