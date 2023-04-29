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

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class    RoomListComponent implements OnInit {

    rooms: IRoom[];

    @Input() roomPrivacy: RoomRole;

    constructor(
        private readonly roomListService: RoomListService,
        private readonly alertService: AlertServices
    ) {
        this.rooms = [];
        this.roomPrivacy = "public"
    }

    ngOnInit(): void {
        this.rooms = [];
        this.getRooms();
    }

    getRooms(): void {
        this.roomListService.getRooms(this.roomPrivacy)
        .subscribe({
            next: (roomRoles: IRoomRole[]) => {
                for (const roomRole of roomRoles)
                    this.rooms.push(roomRole.room);
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

    goToRoom(roomId: number, roomName: string): void {
        console.log(`go to room id: ${roomId} with name: ${roomName}`);
    }

}
