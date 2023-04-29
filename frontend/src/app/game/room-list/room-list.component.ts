import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    IRoom,
    IRoomRole,
    RoomListService,
    RoomRole
} from './room-list.service';
import { AlertServices } from 'src/app/services/alert.service';
import { PageEvent } from '@angular/material/paginator';

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
        private readonly alertService: AlertServices
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
            next: ([roomRoles, totalRooms]: [IRoomRole[], number]) => {
                for (const roomRole of roomRoles)
                    this.rooms.push(roomRole.room);
                this.totalRooms = totalRooms;
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

    pageEventHandler(pageEvent: PageEvent): void {
        this.pageIndex = pageEvent.pageIndex;
        this.getRooms();
    }

    goToRoom(roomId: number, roomName: string): void {
        console.log(`go to room id: ${roomId} with name: ${roomName}`);
    }

}
