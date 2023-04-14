import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-private-dialog',
  templateUrl: './private-dialog.component.html',
  styleUrls: ['./private-dialog.component.scss']
})
export class PrivateDialogComponent implements OnInit {

  visibility: boolean | null = null;

  constructor( 
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { visibility: boolean }
  ) { }

  ngOnInit(): void {
      this.visibility = this.data.visibility;
  }

}
