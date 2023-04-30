import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomDto } from 'src/app/dtos/room.dto';

@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent implements OnInit {

  avatar: File | null = null;
  avatarUrl: string | null = null;

  constructor(
    private _http: HttpClient,
    private _dialogRef: MatDialogRef<AvatarDialogComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { avatarUrl: string, roomId: number }
  ) { }

  ngOnInit(): void {
    this.avatarUrl = this.data.avatarUrl;
  }

  public selectNewAvatar($event: Event) {
    const target: HTMLInputElement = $event.target as HTMLInputElement;

    this.avatar = (target.files as FileList)[0];
    this.avatarUrl = (target.files as FileList)[0]['name'];
  }

  public uploadAvatar() {
    let form: FormData = new FormData();
    const url: string = `http://localhost:3000/room/${this.data.roomId}/avatar`;

    if (this.avatar === null) {
      this._snackBar.open('you did not select a file.', 'dismiss');
      return ;
    }
    form.append('avatar', this.avatar);
    this._http.post<RoomDto>(url, form).subscribe({
      next: (room: RoomDto) => {
        this._snackBar.open('avatar uploaded successfully.', 'dismiss');
        this.avatarUrl = room.photoUrl;
        this.avatar = null;
      },
      error: (err) => {
        this._snackBar.open(err.error.message, 'Dismiss');
        this.avatar = null;
      }
    });
  }

  public closeModal() {
    this._dialogRef.close({ avatarUrl: this.avatarUrl })
  }
}
