import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomDto } from 'src/app/dtos/room.dto';
import { UserDto } from 'src/app/dtos/user.dto';
import { UserRoomDto } from 'src/app/dtos/userroom.dto';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

// en que parte

@Component({
  selector: 'app-game-admin',
  templateUrl: './game-admin.component.html',
  styleUrls: ['./game-admin.component.scss']
})
export class GameAdminComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _dialog: MatDialog
    ) { }

  registeredUsers: UserRoomDto[] = [];
  roomId?: number | null = null;
  room?: RoomDto; // heredamos el json de configuracion de la sala de la ruta 
  
  uploadAvatar: File | null = null;
  avatarUrl: string | null = null;

  isPrivate?: boolean;
  selectedUser?: UserDto = null;

  openAvatarModal() {
    const dialogRef = this._dialog.open(AvatarDialogComponent, {
      data: { avatarUrl: this.avatarUrl, roomId: this.roomId },
      height: '500px',
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((data: { avatarUrl: string }) => {
      this.avatarUrl = data.avatarUrl;
    });
   }

  deleteRoomModal() {
    const dialogRef = this._dialog.open(DeleteDialogComponent, {
      data: { roomName: this.room?.roomName, roomId: this.roomId },
      height: '500px',
      autoFocus: true,
      disableClose: true
    });
  }


  ngOnInit(): void {
    // esto seria roomService.getRoom(roomId);
    this.roomId = this._route.snapshot.params['id'];
    console.log('calling room init');
    this.http.get<RoomDto>(`http://localhost:3000/room/${this.roomId}`)
      .subscribe({
        next: (room) => {
          this.room = room;
          this.avatarUrl = room.photoUrl;
        },
        error: (error) => {
          this._snackBar.open(error.error.message, 'dismiss');
          this._router.navigate(['/']); // a donde deberia redirigir esto
        },
    })
    // aqui a lo mejor una redireccion si no existe la sala
    const url: string = `http://localhost:3000/user_room/room/${this.room?.id}`
    console.log('calling user room init');
    this.http.get<UserRoomDto[]>(url)
      .subscribe((users) => this.registeredUsers = users);
    
      // pillar roles de la sala, si es oficial siempre valida a falso (luego checkeamos
      // validacion en back, pero deberia estar zanjado) (), si es privado validamos a falso pero
      // tenemos posibilidad de darle al boton y actualizar, si sala es privada abrimos modal para
      // introducir antigua contrasenya, si es publica abrimos modal para meter nueva contrasenya.
      // http.delete role en private To Public
      // http.post role en public to Private
    //this.http.get<RoomRoleDto>()
  
  }
}
