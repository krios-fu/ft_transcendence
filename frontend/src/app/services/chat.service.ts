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
		console.log("ID_FRIENDS", id_friend)
		this.http.post('http://localhost:3000/users/me/chat', {
			friendId : id_friend
		}).subscribe(
			data => {
				console.log('NEW CHAT', data);
			}
		)
	}
}