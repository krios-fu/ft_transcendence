import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core"

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class    GameComponent implements OnInit {

    ROOM_PUBLIC = []
    private_room = true;
    constructor (private http: HttpClient
        
    ) {
        this.http.get(`http://localhost:3000/room`)
        .subscribe((entity) => {
            console.log('ROOM', entity)
        })
    }

    
    ngOnInit(): void {
        // throw new Error("Method not implemented.");
    }

}
