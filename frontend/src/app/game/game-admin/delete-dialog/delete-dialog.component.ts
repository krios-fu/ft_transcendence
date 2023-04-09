import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent{

  validateRoomName: string | null = null;

  constructor(
    private _http: HttpClient,
    private _dialogRef: MatDialogRef<DeleteDialogComponent>,
    private _snackBar: MatSnackBar,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { 
      roomName: string,
      roomId: number
    }
  ) { }

  public deleteRoomBtn() {
    const url: string = `http://localhost:3000/user_room/room/${this.data.roomId}`

    console.log('ours : ', this.data.roomName, ', theirs: ', this.validateRoomName)
    if (this.data.roomName != this.validateRoomName) {
      this._snackBar.open('please validate with room name.', 'dismiss');
      return ;
    }
    this._http.delete(url).subscribe({
      next: (_) =>  {
        this._snackBar.open('room deleted successfully.', 'dismiss');
        this._router.navigate(['/']); // checkear esto
        this._dialogRef.close();
      },
      error: (err) => this._snackBar.open(err.error.message, 'dismiss')
    });
  }

  public closeModalBtn() {
    this._dialogRef.close();
  }
}
