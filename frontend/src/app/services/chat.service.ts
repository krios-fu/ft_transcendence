import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class ChatService{
	constructor(
		private http: HttpClient,
	){}

	createChat(id_friend: number){
		return this.http.post('http://localhost:3000/chat/me', {
			friendId : id_friend
		})
	}
}