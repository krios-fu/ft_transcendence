import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface IRoomDto {

}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

    constructor(
      private http: HttpClient,
    ) { }

    //createRoom(): Observable<IRoomDto> {
    //    const joinUrl = 'http://localhost:3000/room/join';
//
    //    return this.http.post<IRoomDto>(joinUrl, {
    //        
    //    });
    //}
}
