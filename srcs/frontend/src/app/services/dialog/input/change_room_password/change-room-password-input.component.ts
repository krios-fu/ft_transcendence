import {
    Component,
    Inject,
    OnInit
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef
} from '@angular/material/dialog';

export interface    IPasswordChange {
    oldPassword: string;
    newPassword: string;
}

@Component({
    selector: 'app-change-room-password-input',
    templateUrl: './change-room-password-input.component.html',
    styleUrls: ['./change-room-password-input.component.scss']
})
export class    ChangeRoomPasswordInputComponent implements OnInit {

    passData: IPasswordChange;

    constructor(
        private readonly dialogRef: MatDialogRef<ChangeRoomPasswordInputComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IPasswordChange,
    ) {
        this.passData = {
            oldPassword: "",
            newPassword: ""
        };
    }

    ngOnInit(): void {
        this.passData = {
            oldPassword: "",
            newPassword: ""
        };
    }

}
