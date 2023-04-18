import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IData {
  isPrivate: boolean;
  roomId: number;
  roleId: number;
}

interface IPrivateRoleDto {
  roomId: number;
  roleId: number;
  password: string;
}

@Component({
  selector: 'app-private-dialog',
  templateUrl: './private-dialog.component.html',
  styleUrls: ['./private-dialog.component.scss']
})
export class PrivateDialogComponent implements OnInit {

  roomId: number | null = null;
  roleId: number | null = null;
  isPrivate: boolean | null = null;
  password: string | null = null;
  validatePassword: string | null = null;

  constructor( 
    private _http: HttpClient,
    private _dialogRef: MatDialogRef<PrivateDialogComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IData
  ) { 
    this.isPrivate = this.data.isPrivate;
    this.roomId = this.data.roomId;
    this.roleId = this.data.roleId;
  }
  ngOnInit(): void { }

  postPrivateRoom() {
    const url: string = `http://localhost:3000/room_roles/`;
    if (this.password === null) {
      return ;
    }
    if (this.roleId === null) {
      this._snackBar.open('private logic not yet implemented.', 'dismiss');
      return ;
    }
    if (this.roomId === null) {
      this._snackBar.open('could not complete request.', 'dismiss');
      return ;
    }
    const body: IPrivateRoleDto = { 
      'roomId': this.roomId, 
      'roleId': this.roleId,
      'password': this.password
    };
    this._http.post(url, body).subscribe({
      next: (_) => {
        this._snackBar.open('room successfully updated.', 'dismiss');
        this.isPrivate = true;
      },
      error: (err) => this._snackBar.open(err.error.message, 'dismiss')
    });
  }

  closeModal() {
    this._dialogRef.close({ 'isPrivate': this.isPrivate });
  }

  activatePostBtn() {
    return this.password && this.validatePassword && 
      this.password === this.validatePassword &&
      this.password.length > 7; // temporal, a implementar
  }
}
