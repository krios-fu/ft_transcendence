import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    IRoom,
    IRoomUserCount,
    RoomListService,
    RoomRole
} from './room-list.service';
import { AlertServices } from 'src/app/services/alert.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IUserRoom } from 'src/app/interfaces/IUserRoom.interface';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class    RoomListComponent implements OnInit {

    rooms: IRoom[];
    totalRooms: number;
    pageSize: number;
    pageIndex: number;

    @Input() roomPrivacy: RoomRole;

    constructor(
        private readonly roomListService: RoomListService,
        private readonly authService: AuthService,
        private readonly alertService: AlertServices,
        private readonly router: Router
    ) {
        this.rooms = [];
        this.totalRooms = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.roomPrivacy = "public";
    }

    ngOnInit(): void {
        this.rooms = [];
        this.getRooms();
    }

    getRooms(): void {
        this.roomListService.getRooms(
            this.roomPrivacy,
            this.pageSize,
            this.pageSize * this.pageIndex
        )
        .subscribe({
            next: ([rooms, totalRooms]: [IRoom[], number]) => {
                this.rooms = rooms;
                this.totalRooms = totalRooms;
                this.getRoomUserCount();
            },
            error: (err: any) => {
                let errMsg: string;
            
                if (err.error
                        && err.error.message)
                    errMsg = err.error.message;
                else
                    errMsg = "Room retrieval failed. Try again later.";
                this.alertService.openSnackBar(errMsg, "OK");
            }
        });
    }

    /*
    **  Not warning user if this method call fails, as the error does not
    **  come from an action the user requested.
    */
    getRoomUserCount(): void {
        this.roomListService.getRoomUserCount(
            this.roomPrivacy,
            this.pageSize,
            this.pageSize * this.pageIndex
        )
        .subscribe({
            next: ([roomUserCount, totalRooms]: [IRoomUserCount[], number]) => {
                if (this.totalRooms != totalRooms)
                {
                    console.error("totalRooms not matching at getRoomUSerCount");
                    return ;
                }
                for (const [id, room] of roomUserCount.entries())
                {
                    this.rooms[id].userCount = room.userCount;
                }
            },
            error: (err: any) => {
                console.error("getRoomUserCount failed: ", err);
            }
        })
    }

    pageEventHandler(pageEvent: PageEvent): void {
        this.pageIndex = pageEvent.pageIndex;
        this.getRooms();
    }

    private _redirectToRoom(roomId: string): void {
        this.router.navigate(['/', {
            outlets: {
                game: ['room', roomId]
            }
        }]);
    }

    private _initRegistry(userId: string, roomId: string,
                            password?: string): void {
        this.roomListService.registerUserToRoom(
            userId,
            roomId,
            password
        )
        .subscribe({
            next: () => {
                this._redirectToRoom(roomId);
            },
            error: (err: any) => {
                let errMsg: string;
            
                if (err.error
                        && err.error.message)
                    errMsg = err.error.message;
                else
                    errMsg = "Room registry failed. Try again later.";
                this.alertService.openSnackBar(errMsg, "OK");
            }
        })
    }

    private _registerToRoom(roomId: string, roomName: string): void {
        const   userId: string | null = this.authService.getAuthId();
    
        if (userId === null)
        {
            console.error("Could not get the user id.");
            return ;
        }
        if (this.roomPrivacy === 'private')
        {
            this.alertService.openPrivateRoomAccess(roomName)
            .subscribe({
                next: (pass: string) => {
                    if (pass)
                        this._initRegistry(userId, roomId, pass);
                }
            });
        }
        else
            this._initRegistry(userId, roomId, roomName)
    }

    goToRoom(roomId: string, roomName: string): void {
        this.roomListService.isUserRegisteredInRoom(roomId)
        .subscribe({
            next: (userInRoom: IUserRoom) => {
                if (userInRoom)
                {
                    if (String(userInRoom.userId)
                            === this.authService.getAuthId())
                        this._redirectToRoom(roomId);
                    else
                    {
                        this.alertService.openSnackBar(
                            "Could not redirect to room because of a credentials issue.", "OK"
                        );
                    }
                }
                else
                    this._registerToRoom(roomId, roomName)
            },
            error: (err: any) => {
                let errMsg: string;

                if (err.error
                        && err.error.message)
                    errMsg = err.error.message;
                else
                    errMsg = "Could not redirect to room at this moment."
                this.alertService.openSnackBar(errMsg, "OK");
            }
        })
    }

}
