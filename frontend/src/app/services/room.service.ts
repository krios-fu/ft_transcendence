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
}
